import { inject, Injectable, OnDestroy } from '@angular/core';
import { Auth, authState, signInAnonymously, user, UserCredential } from '@angular/fire/auth';
import { Log } from '@app/shared/utils/logger/logger.util';
import { catchError, from, Observable, Subscription, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FirebaseAuth implements OnDestroy {
    private readonly auth = inject(Auth);
    readonly authState$ = authState(this.auth);
    readonly user$ = user(this.auth);
    private authStateSub: Subscription;

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

    ngOnDestroy(): void {
        this.authStateSub.unsubscribe();
    }
}
