import * as admin from 'firebase-admin';
import { login } from './login/login.fn';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export functions
export { login };
