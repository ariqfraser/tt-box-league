# Registration System Testing Guide

## Overview

The registration system consists of:
1. **Cloud Function**: `functions/src/register/register.function.ts` - Handles user registration with validation, rate limiting, and error handling
2. **Angular Service**: `src/app/core/services/firebase/functions/registration.service.ts` - Calls the function and maps errors
3. **Angular Component**: `src/app/features/register/register.ts` - User registration UI

## Testing Layers

### Layer 1: Unit Tests (Angular Service)

**Location**: `src/app/core/services/firebase/functions/registration.service.spec.ts`

**What's tested**:
- Error mapping for all error codes (invalid-argument, already-exists, permission-denied, resource-exhausted, internal)
- Success response handling
- Observable flow and proper error propagation

**Run unit tests**:
```bash
npm test
```

**Expected output**: All 9 test cases pass

---

### Layer 2: Integration Tests (Cloud Function)

**Location**: `functions/src/register/register.integration.spec.ts`

**What's tested**:
- Successful user registration (Auth + Firestore)
- Duplicate username detection
- Rate limiting (by IP and username)
- Invalid verification code rejection
- Username format validation (length, characters)
- Password validation (minimum length)
- Rollback behavior when Firestore write fails
- Username normalization (lowercase, trimmed)
- Concurrent registration requests

**Prerequisites**:
```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start --only functions,firestore,auth

# Terminal 2: Run integration tests
cd functions
npm run build
# Tests will run against emulator (implementation pending)
```

---

### Layer 3: End-to-End Tests (Full Flow)

**What's tested**:
- Registration dialog opens
- Form validation works
- Error messages display correctly
- Successful registration closes dialog
- Loading state works properly

**Manual testing**:
```bash
npm start:host
```

Then:
1. Click "Register" button
2. Fill in the form:
   - Full Name: "John Doe"
   - Username: "johndoe" (or any valid username)
   - Password: "password123"
   - Confirm Password: "password123"
   - Verification Code: (get from your Firebase config)
3. Click "Register"
4. Verify success or error message

---

## Testing Verification Code

### Set Verification Code

Before testing, configure the verification code in your local environment:

```bash
# Set for local development
firebase functions:config:set registration.code="test-code-123"

# Verify it's set
firebase functions:config:get

# For emulator testing, set via environment
export FIREBASE_FUNCTIONS_CONFIG='{registration: {code: "test-code-123"}}'
```

### In Tests

When writing integration tests, use:
```typescript
const verificationCode = 'test-code-123'; // Must match functions.config()
```

---

## Rate Limiting

The system enforces two independent rate limits:
- **Per IP**: 15 registration attempts per hour
- **Per Username**: 15 registration attempts per hour

### Testing Rate Limiting

To test rate limiting in integration tests:
1. Make 15 successful registration attempts from same IP with different usernames
2. 16th attempt from same IP should fail with 'resource-exhausted' error
3. Similarly test per-username rate limiting

Rate limit data is stored in Firestore at:
```
collections/rateLimits/
  ├─ registrations-ip-{IP}
  └─ registrations-username-{username}
```

Each document contains:
```json
{
  "attempts": [timestamp1, timestamp2, ...],
  "lastAttempt": timestamp,
  "createdAt": timestamp
}
```

---

## Error Codes & Expected Behavior

| Error Code | Cause | User Message |
|---|---|---|
| `invalid-argument` | Invalid input (username format, password length) | "Invalid username or password. Please check your input." |
| `already-exists` | Username or email already taken | "This username is already taken. Please choose another." |
| `permission-denied` | Wrong verification code | "Invalid verification code." |
| `resource-exhausted` | Rate limit exceeded | "Too many registration attempts. Please wait before trying again." |
| `internal` | Server error (Auth/Firestore failure) | "An error occurred during registration. Please try again later." |

---

## Test Checklist

- [ ] Unit tests pass: `npm test -- registration.service.spec.ts`
- [ ] Cloud Function builds: `cd functions && npm run build`
- [ ] Firebase emulators start: `firebase emulators:start`
- [ ] Integration tests ready (implementation pending)
- [ ] Verification code configured in local dev
- [ ] Manual registration test succeeds
- [ ] Error scenarios tested (invalid username, duplicate, rate limit)
- [ ] Rate limit cleaned up (delete docs in `rateLimits` collection for next test)

---

## Debugging

### View Cloud Function Logs

In emulator UI (http://localhost:4000):
1. Go to Functions section
2. Look for `register` function
3. Click to see logs and errors

Or in terminal:
```bash
firebase functions:log
```

### Inspect Firestore Data

In emulator UI:
1. Go to Firestore section
2. Browse collections:
   - `users/{username}` - User profiles
   - `rateLimits/registrations-*` - Rate limit counters

### Inspect Auth Data

In emulator UI:
1. Go to Authentication section
2. See created users with emails like `username@ariqfraser.dev`

---

## Next Steps

1. **Complete integration tests** using Firebase Test SDK
2. **Set up CI/CD** to run tests on each push
3. **Configure production secrets** for verification code in Secret Manager
4. **Monitor production registration** via Cloud Logging
5. **Set up alerts** for rate limit threshold breaches

---

## Resources

- [Firebase Functions Testing](https://firebase.google.com/docs/functions/local-emulator)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Cloud Functions Error Handling](https://firebase.google.com/docs/functions/callable#error_handling)
