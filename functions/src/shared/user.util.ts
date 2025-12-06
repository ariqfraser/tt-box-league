import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * User document interface for Firestore
 */
export interface UserDocument {
    email: string;
    name: string;
    joinDate: Timestamp;
    elo: number;
    wins: number;
    losses: number;
}

/**
 * Creates a new user document in Firestore
 * @param uid - The Firebase Auth user ID
 * @param email - The user's email
 * @param displayName - The user's display name
 * @returns Promise that resolves when the document is created
 */
export async function createUserDocument(
    uid: string,
    email: string,
    displayName: string,
): Promise<void> {
    const userData: UserDocument = {
        email,
        name: displayName,
        joinDate: Timestamp.now(),
        elo: 1000,
        wins: 0,
        losses: 0,
    };

    logger.debug('Creating user document for new user:', { uid, email });

    try {
        await admin.firestore().collection('users').doc(uid).set(userData);
        logger.info(`Created user document for ${uid}`, { email });
    } catch (error) {
        logger.error(`Failed to create user document for ${uid}:`, error);
        throw error;
    }
}
