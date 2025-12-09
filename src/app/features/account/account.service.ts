import { inject, Injectable } from '@angular/core';
import { FirebaseAuth } from '@core/services/firebase/auth/firebase-auth';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private readonly auth = inject(FirebaseAuth);

    /**
     *
     */
    logout(): void {
        this.auth.signOut();
    }
}
