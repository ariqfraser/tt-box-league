import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { SettingsGlobal } from '../shared/settings-global.types';
import { logger } from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore';

export const startNewSeason = onCall(async (request) => {
    try {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'User must be authenticated');
        }

        const userDoc = await admin.firestore().collection('users').doc(request.auth.uid).get();
        if (!userDoc.data()?.isAdmin) {
            throw new HttpsError('permission-denied', 'User must be an admin');
        }

        logger.info('Admin user verified, starting new season');

        const db = admin.firestore();
        const settingsRef = db.collection('settings').doc('global');

        const result = await settingsRef.update({
            currentSeason: FieldValue.increment(1),
            startedAt: FieldValue.serverTimestamp(),
        });

        logger.info('Updated settings for new season:', { result });

        const updatedSettings = await settingsRef.get();
        const settings = updatedSettings.data() as SettingsGlobal;
        logger.info('Starting new season:', { settings });

        try {
            const db = admin.firestore();
            const matchesRef = db.collection('matches');
            const batch = db.batch();

            // Get settings to know players per box
            const playersPerBox = settings?.playersPerBox || 4;

            // Get all users
            const usersRef = admin.firestore().collection('users');
            const usersSnapshot = await usersRef.get();
            const userIds = usersSnapshot.docs.map((doc) => doc.id);

            const totalUsers = userIds.length;
            const boxCount = Math.ceil(totalUsers / playersPerBox);

            // Distribute users into boxes
            let userIndex = 0;
            for (let box = 0; box < boxCount; box++) {
                const boxUsers: string[] = [];
                for (let i = 0; i < playersPerBox && userIndex < totalUsers; i++) {
                    boxUsers.push(userIds[userIndex++]);
                }

                // Generate round-robin matches for this box
                for (let i = 0; i < boxUsers.length; i++) {
                    for (let j = i + 1; j < boxUsers.length; j++) {
                        const matchData = {
                            p1Id: boxUsers[i],
                            p2Id: boxUsers[j],
                            p1Score: 0,
                            p2Score: 0,
                            timestamp: null,
                            season: settings.currentSeason,
                            box: box,
                        };

                        const matchDocRef = matchesRef.doc();
                        batch.set(matchDocRef, matchData);
                    }
                }
            }

            await batch.commit();
        } catch (error) {
            logger.error('Error generating matches for new season:', error);
            throw new HttpsError('internal', 'Failed to generate matches for new season', error);
        }

        logger.info('Season started successfully with updated settings');
        return { success: true, message: 'Season started successfully', settings };
    } catch (error) {
        logger.error('Error starting new season:', error);
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError(
            'internal',
            `Failed to start new season: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
});
