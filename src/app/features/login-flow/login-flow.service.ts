import { inject, Injectable, signal } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FirebaseAuth } from '@core/services/firebase/auth/firebase-auth';
import { StorageService } from '@core/services/storage/storage.service';
import { CookieStore } from '@shared/utils/cookie-store/cookie-store.util';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
import { FirebaseFunctions } from '@core/services/firebase/functions/firebase-functions';

/**
 * Service to manage the login flow with QR code authentication and Firebase integration
 */
@Injectable({
    providedIn: 'root',
})
export class LoginFlowService {
    private readonly storage = inject(StorageService);
    private readonly auth = inject(FirebaseAuth);
    private readonly functions = inject(FirebaseFunctions);

    private readonly _isAuthenticated = signal(false);

    /** Whether the user has completed Firebase authentication */
    readonly isAuthenticated = this._isAuthenticated.asReadonly();

    /**
     * Signs in to Firebase anonymously
     * @returns Observable of the user credential or null
     */
    signIn(): Observable<UserCredential | null> {
        return this.auth.signIn().pipe(
            catchError((e) => {
                return throwError(() => new Error(e.message));
            }),
        );
    }

    /**
     * Checks if there's an existing valid auth code in cookies
     * @returns Whether an auth code exists
     */
    hasExistingAuth(): boolean {
        const auth = CookieStore.getCookie('auth');
        return !!auth;
    }

    /**
     * Gets the existing auth code from cookies
     * @returns The auth code or null
     */
    getExistingAuthCode(): string | null {
        return CookieStore.getCookie('auth');
    }

    /**
     * Gets the stored email from storage
     * @returns The stored email or empty string
     */
    getStoredEmail(): string {
        return this.storage.get('USER_EMAIL').trim();
    }

    /**
     * Completes the login flow - validates QR code, creates user via cloud function, then signs in
     * @param code - The scanned QR code (used as password)
     * @param email - The user's email
     * @returns Observable<boolean> that emits true when login succeeds
     */
    submitLogin(code: string, email: string): Observable<boolean> {
        // Step 1: Cloud function validates code/email and creates the user in Firebase Auth
        return this.functions
            .call<{ success: boolean }, { email: string; code: string }>('login', { email, code })
            .pipe(
                tap((response) => {
                    if (!response.data.success) {
                        throw new Error('User creation failed');
                    }
                }),
                tap(() => {
                    this.auth.signInEmail(email.toLowerCase(), code).subscribe();
                }),
                tap(() => {
                    CookieStore.setCookie('auth', code, 7);
                    this.storage.set('USER_EMAIL', email);
                    this._isAuthenticated.set(true);
                }),
                map(() => true),
                catchError((e) => {
                    return throwError(() => new Error(e.message));
                }),
            );
    }
}
