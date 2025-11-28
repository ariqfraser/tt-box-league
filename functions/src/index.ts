import * as admin from 'firebase-admin';
import { register } from './register/register.function';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export functions
export { register };
