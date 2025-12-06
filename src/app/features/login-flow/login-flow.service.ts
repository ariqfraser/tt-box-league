import { inject, Injectable, signal } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FirebaseAuth } from '@core/services/firebase/auth/firebase-auth';
import { StorageService } from '@core/services/storage/storage.service';
import { CookieStore } from '@shared/utils/cookie-store/cookie-store.util';
import { Observable, catchError, throwError, of, tap } from 'rxjs';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class LoginFlowService {
    private readonly storage = inject(StorageService);
    private readonly auth = inject(FirebaseAuth);

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
     * Saves the user's email to storage
     * @param email - The email to save
     */
    submitEmail(email: string): void {
        this.storage.set('USER_EMAIL', email);
    }

    /**
     * Gets the stored email from storage
     * @returns The stored email or empty string
     */
    getStoredEmail(): string {
        return this.storage.get('USER_EMAIL').trim();
    }

    /**
     * Completes the login flow - called after all steps are done
     * @param authCode - The validated auth code
     * @param email - The user's email
     * @returns Observable<boolean> that emits true when login succeeds and errors when validation fails
     */
    submitLogin(authCode: string, email: string): Observable<boolean> {
        // Make API call to validate auth code and email
        const validate$ = of(false); // Simulate API call for now

        return validate$.pipe(
            tap((isValid) => {
                if (!isValid) {
                    throw new Error('Invalid auth code or email');
                }
                CookieStore.setCookie('auth', authCode);
                this.storage.set('USER_EMAIL', email);
                this._isAuthenticated.set(true);
            }),
            catchError((e) => {
                return throwError(() => new Error(e.message));
            }),
        );
    }
}
