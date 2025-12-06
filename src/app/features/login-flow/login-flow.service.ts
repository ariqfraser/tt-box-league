import { inject, Injectable, signal } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FirebaseAuth } from '@core/services/firebase/auth/firebase-auth';
import { StorageService } from '@core/services/storage/storage.service';
import { CookieStore } from '@shared/utils/cookie-store/cookie-store.util';
import { Observable, catchError, throwError, of } from 'rxjs';

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
     * Validates the auth code against the server
     * @param code - The auth code to validate
     * @returns Observable of whether the code is valid
     */
    validateAuthCode(code: string): Observable<boolean> {
        // TODO: Replace with actual API call to validate auth code
        // For now, simulate validation - any non-empty code is valid
        if (!code || code.trim() === '') {
            return of(false);
        }
        // Store the auth code in cookies for future sessions
        CookieStore.setCookie('auth', code, 7);
        this._isAuthenticated.set(true);
        return of(true);
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
     */
    completeLogin(authCode: string, email: string): void {
        CookieStore.setCookie('auth', authCode, 7);
        this.storage.set('USER_EMAIL', email);
        this._isAuthenticated.set(true);
    }
}
