# Firebase Emulators Setup Guide

## Overview

This guide explains how to set up and use Firebase Emulators for local development and testing of the registration system.

## Prerequisites

- Node.js 20+
- Firebase CLI (v11+)
- Docker (optional, for emulator suite)

## Installation

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

### 2. Initialize Firebase Project (Already Done)

The project is already initialized with `firebase.json` containing emulator configuration.

## Starting Emulators

### Option 1: Using the Quick Start Script

```bash
chmod +x start-emulators.sh
./start-emulators.sh
```

This script:
- Checks for Firebase CLI
- Builds Cloud Functions if needed
- Sets verification code for testing
- Starts all emulators (auth, firestore, functions)
- Opens the Emulator UI

### Option 2: Manual Start

```bash
# Build functions first
cd functions
npm run build
cd ..

# Start emulators
firebase emulators:start --only functions,firestore,auth,ui
```

### Option 3: Development with Watch Mode

Terminal 1:
```bash
cd functions
npm run build:watch  # Watches for changes and rebuilds
```

Terminal 2:
```bash
firebase emulators:start --only functions,firestore,auth,ui
```

## Emulator Endpoints

Once started, access:

| Service | URL | Purpose |
|---------|-----|---------|
| **Emulator UI** | http://localhost:4000 | Dashboard for all emulators |
| **Auth** | localhost:9099 | Firebase Authentication |
| **Firestore** | localhost:8083 | Firestore Database |
| **Functions** | localhost:5001 | Cloud Functions |

## Emulator UI

The Emulator UI (http://localhost:4000) provides:

### Authentication Tab
- View created users
- Create test users
- See email/password combinations

### Firestore Tab
- Browse all collections and documents
- View rate limit counters
- View user profiles
- Add/edit/delete test data

### Functions Tab
- View function logs
- See execution history
- Check error messages

### Logs Tab
- Real-time logs from all emulators

## Configuration

### Verification Code

The verification code is required for registration. Set it in your environment:

```bash
# For local testing
export FIREBASE_FUNCTIONS_CONFIG='{"registration":{"code":"test-code-123"}}'
```

Or configure it globally:

```bash
firebase functions:config:set registration.code="test-code-123"
firebase functions:config:get
```

### Firebase Connection in Angular App

The Angular app automatically connects to emulators when:
1. `environment.isProduction === false`
2. Firebase is initialized with the emulator settings

Check `src/environments/environment.development.ts`:

```typescript
export const environment = {
  isProduction: false,
  firebase: {
    apiKey: 'AIzaSy...',
    authDomain: 'tt-box-league.firebaseapp.com',
    projectId: 'tt-box-league',
    storageBucket: 'tt-box-league.appspot.com',
    messagingSenderId: '...',
    appId: '...',
  },
};
```

Emulator connection is handled in `src/main.ts`:

```typescript
if (!environment.isProduction) {
  const auth = getAuth();
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  
  const firestore = getFirestore();
  connectFirestoreEmulator(firestore, 'localhost', 8083);
  
  const functions = getFunctions();
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## Development Workflow

### 1. Start Emulators

```bash
./start-emulators.sh
```

### 2. Start Angular App

In another terminal:
```bash
npm start:host
```

### 3. Test Registration Flow

1. Open http://localhost:4200
2. Click "Register"
3. Fill in form with:
   - Full Name: "Test User"
   - Username: "testuser" (must be unique)
   - Password: "password123"
   - Confirm Password: "password123"
   - Verification Code: "test-code-123"
4. Click "Register"

### 4. Monitor in Emulator UI

- Go to http://localhost:4000
- Check **Authentication** tab for new user
- Check **Firestore** tab for:
  - `users/testuser` document
  - `rateLimits/registrations-ip-*` counter
  - `rateLimits/registrations-username-testuser` counter

### 5. View Logs

- Check **Functions** tab for `register` function logs
- Check **Logs** tab for real-time output

## Cleaning Up Between Tests

### Clear All Data

Option 1: Delete individual collections in Firestore tab
Option 2: Restart emulators (data is ephemeral by default)

### Reset Rate Limits

```javascript
// In Emulator UI, Firestore tab:
// Delete documents matching: rateLimits/registrations-*
```

### Delete Test Users

```javascript
// In Emulator UI, Authentication tab:
// Click user and delete
```

## Debugging Tips

### Function Not Calling?

1. Check browser console for errors
2. Verify functions emulator is running on port 5001
3. Confirm functions code built: check `functions/lib/index.js` exists
4. Check Functions tab in Emulator UI for errors

### Registration Always Fails?

1. Verify verification code matches config
2. Check Firestore has permissions (should be permissive in emulator)
3. View function logs in Emulator UI
4. Check browser console for client-side errors

### Rate Limit Not Working?

1. Verify documents in `rateLimits/` collection
2. Check timestamps are within 1-hour window
3. Restart emulators to reset data

### Auth User Created But Firestore Failed?

1. Check Firestore collection permissions
2. Look for error logs in Functions tab
3. Verify Firestore emulator is running (port 8083)

## Stopping Emulators

Press `Ctrl+C` in the terminal running the emulators.

All data in emulators is ephemeral and will be lost on restart.

## Troubleshooting

### Port Already in Use

If emulators fail to start due to port conflicts:

```bash
# Find process using port 5001 (or other port)
lsof -i :5001

# Kill process
kill -9 <PID>

# Or change port in firebase.json
```

### Firebase CLI Permission Errors

```bash
# Clear Firebase cache
firebase logout
firebase login

# Or use service account
firebase use --add
```

### Emulator Not Responding

```bash
# Check if emulators are running
firebase emulators:exec "echo 'Connected'"

# Restart emulators
firebase emulators:stop
firebase emulators:start --only functions,firestore,auth,ui
```

## Next Steps

1. Run unit tests: `npm test`
2. Test registration flow manually
3. Verify error scenarios work
4. Check rate limiting behavior
5. Review logs in Emulator UI

## Resources

- [Firebase Emulator Suite Docs](https://firebase.google.com/docs/emulator-suite)
- [Local Emulation Testing](https://firebase.google.com/docs/functions/local-emulator)
- [Firestore Emulator](https://firebase.google.com/docs/firestore/emulator-setup)
