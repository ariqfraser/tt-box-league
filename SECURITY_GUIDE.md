# Security & Secrets Management Guide

## Overview

This guide covers securing the registration system including secrets management, security rules, and production deployment.

## Secrets Management

### Verification Code

The verification code is the gatekeeper for registration. It must be securely managed.

#### Local Development

For local testing with emulators:

```bash
# Set verification code in environment
export FIREBASE_FUNCTIONS_CONFIG='{"registration":{"code":"dev-code-123"}}'

# Or configure via Firebase CLI
firebase functions:config:set registration.code="dev-code-123"
firebase functions:config:get
```

#### Production (Recommended: Google Secret Manager)

```bash
# Create secret in Google Secret Manager
gcloud secrets create registration-verification-code --data-file=- <<< "your-production-code"

# Grant Cloud Functions access
gcloud secrets add-iam-policy-binding registration-verification-code \
  --member=serviceAccount:PROJECT_ID@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

Update Cloud Function to use Secret Manager:

```typescript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

async function getVerificationCode(): Promise<string> {
  const client = new SecretManagerServiceClient();
  
  const name = client.secretVersionPath(
    process.env.GCP_PROJECT,
    'registration-verification-code',
    'latest'
  );
  
  const [version] = await client.accessSecretVersion({ name });
  const payload = version.payload?.data?.toString() || '';
  
  return payload;
}
```

#### Staging Environment

Use Firebase Functions Config (less secure but simpler):

```bash
firebase deploy --only functions --project staging-project
firebase functions:config:set registration.code="staging-code" --project staging-project
```

### Other Secrets to Consider

1. **Rate Limit Thresholds** - Could be configurable per environment
2. **Email Domain** - Currently hardcoded, could be config
3. **API Keys** - If using third-party services for email verification

---

## Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read their own profile
    match /users/{username} {
      allow read: if request.auth != null && request.auth.uid == resource.data.uid;
      allow write: if false; // Only Cloud Functions can write
    }

    // Rate limits - private, functions only
    match /rateLimits/{document=**} {
      allow read: if false;
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

### Firebase Authentication Security

1. **Email Verification** (optional future feature):
   ```typescript
   // Require email verification before user can access app
   if (!currentUser.emailVerified) {
     redirectToEmailVerification();
   }
   ```

2. **Password Requirements**:
   - Minimum 6 characters (enforced by function)
   - Consider enforcing stronger requirements

3. **Session Management**:
   - Set appropriate session duration
   - Implement logout on suspicious activity

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Secrets configured in Secret Manager
- [ ] Rate limits tuned for production traffic
- [ ] Firestore security rules deployed
- [ ] Email domain verified for Auth emails
- [ ] Error logging configured
- [ ] Rate limit alerts set up
- [ ] Rate limit cleanup scheduled
- [ ] Backup plan for rate limit table
- [ ] Monitoring and metrics set up
- [ ] Rollback procedure documented

### Deployment Steps

```bash
# 1. Review changes
git diff

# 2. Build and test
npm run build
npm test

# 3. Deploy to staging first
firebase deploy --project staging-project

# 4. Test on staging
# (manual testing and integration tests)

# 5. Deploy to production
firebase deploy --project production-project

# 6. Verify production
firebase functions:log --project production-project
```

### Post-Deployment Monitoring

Monitor these metrics:

1. **Registration Success Rate**
   - Target: >95% success rate
   - Alert if drops below 90%

2. **Rate Limit Triggers**
   - Track how many users hit rate limits
   - Monitor for patterns (same IP, same username)

3. **Error Rates by Type**
   - invalid-argument errors (user input issues)
   - internal errors (server issues)
   - permission-denied errors (wrong verification code)

4. **Function Execution Time**
   - Target: <200ms per call
   - Alert if exceeds 500ms

### Monitoring Setup

```typescript
// In register.function.ts - already includes logging
console.log(`register: attempt from IP ${remoteIp} for username ${rawUsername}`);
console.log(`register: success for username ${username} (uid ${uid})`);
console.warn(`register: username ${username} already exists`);
console.error(`register: Auth creation error for ${username}:`, err);
```

These logs are automatically captured in Cloud Logging.

---

## Rate Limit Data Management

### Automatic Cleanup

The rate limit data contains timestamps. The function filters by window:

```typescript
const windowStartMs = now - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000;
const recentAttempts = attempts.filter((ts) => ts > windowStartMs);
```

Over time, old attempts stay in the `attempts` array and should be cleaned up.

### Manual Cleanup (Optional)

```bash
# Delete old rate limit documents in Firestore
# When they haven't been accessed in 24+ hours
# Can be done via Firestore UI or Cloud Function
```

### Scheduled Cleanup (Recommended)

Create a cleanup Cloud Function:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Run daily at 2 AM UTC
export const cleanupRateLimits = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    const db = admin.firestore();
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    const snapshot = await db
      .collection('rateLimits')
      .where('lastAttempt', '<', oneHourAgo)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
    console.log(`Deleted ${snapshot.size} expired rate limit documents`);
  });
```

---

## Error Handling & Logging

### Error Codes

All errors use standard HttpsError codes:

| Code | Meaning | Logged |
|------|---------|--------|
| `invalid-argument` | User input error | warn |
| `already-exists` | Resource conflict | warn |
| `permission-denied` | Auth failure | warn |
| `resource-exhausted` | Rate limit | warn |
| `internal` | Server error | error |

### Log Levels

- **INFO**: Successful operations
- **WARN**: Expected errors (user mistakes, rate limits)
- **ERROR**: Unexpected errors (auth failures, Firestore issues)

### Log Retention

Configure in Cloud Logging:
- Info/Warn logs: 30 days
- Error logs: 90 days

---

## Compliance & Privacy

### Data Retention

- **User Profiles**: Retained until account deleted
- **Rate Limit Counters**: Auto-cleanup after 1 hour window passes
- **Auth User**: Retained in Firebase Auth
- **Logs**: Retained per Cloud Logging policy (30-90 days)

### Audit Trail

All registration attempts are logged:
- Timestamp
- Username (normalized)
- IP address (not stored, only logged)
- Success/failure status
- Error code (if failed)

### GDPR Compliance

1. **Right to Access**: User can request their data
2. **Right to Erasure**: User can delete their account
3. **Data Portability**: Can export user data
4. **Consent**: Users consent to email storage during signup

---

## Incident Response

### Rate Limit Attack

If someone is abusing rate limits:

```bash
# 1. Check logs
firebase functions:log --project production-project

# 2. Identify pattern (IP or username)
gcloud logging read \
  'resource.type="cloud_function" AND severity="WARN"' \
  --limit 100 --project production-project

# 3. Block if needed
# - Delete rate limit counter to reset
# - Implement IP-based blocking (future enhancement)

# 4. Update verification code
firebase functions:config:set registration.code="new-code" --project production-project
firebase deploy --only functions --project production-project
```

### Auth User Creation Failure

If Auth is down:

```bash
# 1. Check Firebase Auth status
# (In Cloud Console)

# 2. Disable registration temporarily
# - Update verification code to prevent new attempts
# - Or deploy a version that returns 'internal' error

# 3. Once fixed, update verification code to resume
```

### High Error Rate

If >10% errors detected:

```bash
# 1. Check function logs
firebase functions:log --project production-project | grep ERROR

# 2. Check Firestore status
# (In Cloud Console)

# 3. Possible fixes:
# - Check rate limit table is not too large
# - Check Firestore has capacity
# - Check Auth has capacity
```

---

## Security Best Practices Checklist

- [x] Secrets not hardcoded
- [x] Input validation on server
- [x] Error messages don't leak sensitive info
- [x] Rate limiting implemented
- [x] Firestore security rules configured
- [x] HTTPS enforced
- [ ] Email verification (future)
- [ ] Account lockout after failed attempts (future)
- [ ] Password strength requirements (future)
- [ ] Two-factor authentication (future)

---

## Resources

- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Cloud Functions Security](https://cloud.google.com/functions/docs/securing)
- [Google Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Cloud Logging](https://cloud.google.com/logging/docs)
- [Firebase Auth Security](https://firebase.google.com/docs/auth/best-practices)
