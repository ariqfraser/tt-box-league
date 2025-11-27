import * as functions from 'firebase-functions';

/**
 * Example function - replace with your actual functions
 */
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send('Hello from Firebase!');
});
