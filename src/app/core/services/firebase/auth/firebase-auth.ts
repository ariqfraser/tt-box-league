import { inject, Injectable, OnDestroy } from '@angular/core';
import {
    Auth,
    authState,
    signInAnonymously,
    user,
    UserCredential,
    signInWithEmailAndPassword,
    signOut,
} from '@angular/fire/auth';
import { Log } from '@app/shared/utils/logger/logger.util';
import { catchError, from, Observable, Subscription, throwError } from 'rxjs';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class FirebaseAuth implements OnDestroy {
    private readonly auth = inject(Auth);
    readonly authState$ = authState(this.auth);
    readonly user$ = user(this.auth);
    private authStateSub: Subscription;

    /**
     *
     */
    constructor() {
        this.authStateSub = this.authState$.subscribe((state) => {
            // Handle user state changes if needed
            Log.debug('Auth state changed:', state);
        });
    }

    /**
     * Handle anonymous sign-in for users.
     * @returns - UserCredential from Firebase anonymous sign-in
     */
    signIn(): Observable<UserCredential> {
        return from(signInAnonymously(this.auth)).pipe(
            catchError((e) => {
                Log.error('Error during anonymous sign-in:', e);
                return throwError(() => new Error('Anonymous sign-in failed'));
            }),
        );
    }

    /**
     * handles user sign-out
     */
    signOut(): void {
        signOut(this.auth).catch((e) => {
            Log.error('Error during sign-out:', e);
        });
    }

    /**
     * Sign in a user using email and password.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns Observable that emits the Firebase UserCredential on success.
     */
    signInEmail(email: string, password: string): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            catchError((e) => {
                Log.error('Error during email/password sign-in:', e);
                return throwError(() => new Error('Email/password sign-in failed'));
            }),
        );
    }

    /**
     *
     */
    ngOnDestroy(): void {
        this.authStateSub.unsubscribe();
    }
}
