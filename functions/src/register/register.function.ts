import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const EMAIL_DOMAIN = '@ariqfraser.dev';
const USERNAME_REGEX = /^[a-z0-9._-]{3,30}$/;
const RATE_LIMIT_WINDOW_HOURS = 1;
const RATE_LIMIT_MAX_ATTEMPTS = 15;

interface RegisterRequest {
    fullName: string;
    username: string;
    password: string;
    verificationCode: string;
}

interface RegisterResponse {
    ok: boolean;
    uid: string;
    username: string;
}

/**
 * Validates and normalizes username
 * @param username raw username input
 * @returns normalized username (lowercase, trimmed)
 * @throws {functions.https.HttpsError} if invalid
 */
function validateUsername(username: string): string {
    if (!username || typeof username !== 'string') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Username is required and must be a string.',
        );
    }

    const normalized = username.trim().toLowerCase();

    if (!USERNAME_REGEX.test(normalized)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Username must be 3-30 characters and contain only letters, numbers, dots, dashes, and underscores.',
        );
    }

    return normalized;
}

/**
 * Validates password
 * @param password raw password input
 * @throws {functions.https.HttpsError} if invalid
 */
function validatePassword(password: string): void {
    if (!password || typeof password !== 'string') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Password is required and must be a string.',
        );
    }

    if (password.length < 6) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Password must be at least 6 characters.',
        );
    }
}

/**
 * Validates verification code
 * @param inputCode provided verification code
 * @throws {functions.https.HttpsError} if mismatch
 */
function validateVerificationCode(inputCode: string): void {
    const config = functions.config();
    const expectedCode = config.registration?.code;

    if (!expectedCode) {
        console.error('register: REGISTRATION_CODE not configured in functions config');
        throw new functions.https.HttpsError(
            'internal',
            'Server configuration error. Please contact support.',
        );
    }

    if (!inputCode || inputCode !== expectedCode) {
        throw new functions.https.HttpsError('permission-denied', 'Verification code is invalid.');
    }
}

/**
 * Checks and enforces rate limits using Firestore sliding window counters
 * @param remoteIp client IP address
 * @param username normalized username
 * @throws {functions.https.HttpsError} if rate limit exceeded
 */
async function checkRateLimit(remoteIp: string, username: string): Promise<void> {
    const db = admin.firestore();
    const now = Date.now();
    const windowStartMs = now - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000;

    // Check rate limit for IP
    const ipRateLimitDocRef = db.collection('rateLimits').doc(`registrations-ip-${remoteIp}`);
    const ipRateLimitSnap = await ipRateLimitDocRef.get();

    if (ipRateLimitSnap.exists) {
        const ipData = ipRateLimitSnap.data();
        const attempts = (ipData?.attempts || []) as number[];
        const recentAttempts = attempts.filter((ts) => ts > windowStartMs);

        if (recentAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
            throw new functions.https.HttpsError(
                'resource-exhausted',
                'Too many registration attempts from this IP. Please try again later.',
            );
        }

        // Update with new attempt
        await ipRateLimitDocRef.update({
            attempts: admin.firestore.FieldValue.arrayUnion(now),
            lastAttempt: now,
        });
    } else {
        // Create new rate limit doc
        await ipRateLimitDocRef.set({
            attempts: [now],
            lastAttempt: now,
            createdAt: now,
        });
    }

    // Check rate limit for username
    const usernameRateLimitDocRef = db
        .collection('rateLimits')
        .doc(`registrations-username-${username}`);
    const usernameRateLimitSnap = await usernameRateLimitDocRef.get();

    if (usernameRateLimitSnap.exists) {
        const usernameData = usernameRateLimitSnap.data();
        const attempts = (usernameData?.attempts || []) as number[];
        const recentAttempts = attempts.filter((ts) => ts > windowStartMs);

        if (recentAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
            throw new functions.https.HttpsError(
                'resource-exhausted',
                'Too many registration attempts for this username. Please try again later.',
            );
        }

        // Update with new attempt
        await usernameRateLimitDocRef.update({
            attempts: admin.firestore.FieldValue.arrayUnion(now),
            lastAttempt: now,
        });
    } else {
        // Create new rate limit doc
        await usernameRateLimitDocRef.set({
            attempts: [now],
            lastAttempt: now,
            createdAt: now,
        });
    }
}

/**
 * Register callable function
 * Creates a new user with email/password auth and stores profile in Firestore
 */
export const register = functions.https.onCall(
    async (
        data: RegisterRequest,
        context: functions.https.CallableContext,
    ): Promise<RegisterResponse> => {
        const { username: rawUsername, password, verificationCode, fullName } = data;

        // Get client IP for rate limiting
        const remoteIp =
            (context.rawRequest.headers['x-forwarded-for'] as string)?.split(',')[0] ||
            context.rawRequest.socket.remoteAddress ||
            'unknown';

        console.log(`register: attempt from IP ${remoteIp} for username ${rawUsername}`);

        try {
            // Validate inputs
            const username = validateUsername(rawUsername);
            validatePassword(password);
            validateVerificationCode(verificationCode);

            // Check rate limits
            await checkRateLimit(remoteIp, username);

            // Check if username already exists
            const db = admin.firestore();
            const userDocRef = db.collection('users').doc(username);
            const userDocSnap = await userDocRef.get();

            if (userDocSnap.exists) {
                console.warn(`register: username ${username} already exists`);
                throw new functions.https.HttpsError(
                    'already-exists',
                    'This username is already taken.',
                );
            }

            // Create Auth user
            const email = `${username}${EMAIL_DOMAIN}`;
            let uid: string;

            try {
                const userRecord = await admin.auth().createUser({
                    email,
                    password,
                    displayName: fullName,
                });
                uid = userRecord.uid;
                console.log(`register: created Auth user ${uid} for username ${username}`);
            } catch (authError: unknown) {
                const err = authError as { code?: string; message?: string };
                if (err.code === 'auth/email-already-exists') {
                    console.warn(`register: email ${email} already exists (collision)`);
                    throw new functions.https.HttpsError(
                        'already-exists',
                        'A user with this username already exists.',
                    );
                }
                console.error(`register: Auth creation error for ${username}:`, err);
                throw new functions.https.HttpsError(
                    'internal',
                    'Failed to create user account. Please try again.',
                );
            }

            // Write Firestore user document
            try {
                await userDocRef.set({
                    uid,
                    username,
                    fullName,
                    displayName: username,
                    createdAt: admin.firestore.Timestamp.now(),
                });
                console.log(`register: created Firestore doc for username ${username}`);
            } catch (firestoreError: unknown) {
                // Rollback: delete Auth user if Firestore write fails
                console.error(
                    `register: Firestore write failed for username ${username}:`,
                    firestoreError,
                );
                try {
                    await admin.auth().deleteUser(uid);
                    console.log(`register: rolled back Auth user ${uid} due to Firestore failure`);
                } catch (deleteError: unknown) {
                    console.error(
                        `register: failed to delete Auth user ${uid} during rollback:`,
                        deleteError,
                    );
                }
                throw new functions.https.HttpsError(
                    'internal',
                    'Failed to create user profile. Please try again.',
                );
            }

            console.log(`register: success for username ${username} (uid ${uid})`);
            return { ok: true, uid, username };
        } catch (error: unknown) {
            // If it's already an HttpsError, re-throw it
            if (error instanceof functions.https.HttpsError) {
                throw error;
            }

            // Unexpected error
            console.error(`register: unexpected error:`, error);
            throw new functions.https.HttpsError(
                'internal',
                'An unexpected error occurred. Please try again.',
            );
        }
    },
);
