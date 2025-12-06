import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { defineString } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { createUserDocument } from '../shared/user.util';

interface LoginRequest {
    email: string;
    code: string;
}

export const login = onCall<LoginRequest>(async (request) => {
    const _VALID_CODE = defineString('VALID_CODE');
    const VALID_CODE = _VALID_CODE.value();
    const _VALID_EMAIL_PATTERN = defineString('VALID_EMAIL_PATTERN');
    const VALID_EMAIL_PATTERN = new RegExp(_VALID_EMAIL_PATTERN.value());

    const email = request.data.email.toLowerCase();
    const code = request.data.code;

    const isValidCode = code === VALID_CODE;
    if (!isValidCode) {
        throw new HttpsError('unauthenticated', 'Invalid authentication code');
    }

    const isValidEmail = VALID_EMAIL_PATTERN.test(email);
    logger.debug('Validating email:', { email, isValidEmail, pattern: VALID_EMAIL_PATTERN.source });
    if (!isValidEmail) {
        throw new HttpsError('invalid-argument', 'Email is not authorised');
    }

    const displayName = email.split('@')[0].split('.').join(' ').replace(/[0-9]/g, '');

    let isNewUser = false;
    let user: admin.auth.UserRecord;

    try {
        // Try to create a new user
        user = await admin.auth().createUser({
            email: email,
            emailVerified: true,
            password: code,
            displayName,
        });
        isNewUser = true;
        logger.info(`New user created: ${user.uid}`, { email });
    } catch (error: unknown) {
        const authError = error as { code?: string };
        if (authError?.code === 'auth/email-already-exists') {
            // User already exists, get their record
            user = await admin.auth().getUserByEmail(email);
            isNewUser = false;
            logger.info(`Existing user logging in: ${user.uid}`, { email });
        } else {
            logger.error('Failed to create user:', error);
            throw new HttpsError('internal', 'Failed to create user');
        }
    }

    // Create user document only if this is a new user
    if (isNewUser) {
        await createUserDocument(user.uid, email, displayName);
    }

    return { success: true };
});
