import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export functions
export { login } from './src/login/login.fn';
export { startNewSeason } from './src/admin/season-controls.fn';
