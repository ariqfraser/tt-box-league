import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { defineString } from 'firebase-functions/params';
import * as admin from 'firebase-admin';

interface LoginRequest {
    email: string;
    code: string;
}

const VALID_CODE = defineString('VALID_CODE').value();
const VALID_EMAIL_PATTERN = new RegExp(defineString('VALID_EMAIL_PATTERN').value());

export const login = onCall<LoginRequest>(async (request) => {
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

    const displayName = email.split('@')[0].split('.').join(' ');

    const user = await admin
        .auth()
        .createUser({
            email: email,
            emailVerified: true,
            password: code,
            displayName,
        })
        .catch((error) => {
            if (error.code !== 'auth/email-already-exists') {
                throw new HttpsError('internal', 'Failed to create user');
            }
        });

    // For now, just return success
    return { success: true, user };
});
