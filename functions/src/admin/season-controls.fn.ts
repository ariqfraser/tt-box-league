import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export const startNewSeason = onCall(async (request) => {
    try {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'User must be authenticated');
        }

        // Add admin check if needed
        const userDoc = await admin.firestore().collection('users').doc(request.auth.uid).get();
        if (!userDoc.data()?.isAdmin) {
            throw new HttpsError('permission-denied', 'User must be an admin');
        }

        await admin
            .firestore()
            .collection('settings')
            .doc('global')
            .update({
                seasonNumber: admin.firestore.FieldValue.increment(1),
                seasonStart: admin.firestore.Timestamp.now(),
            });

        return { success: true, message: 'Season started successfully' };
    } catch (error) {
        throw new HttpsError('internal', 'Failed to start new season', error);
    }
});
