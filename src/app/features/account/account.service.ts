import { inject, Injectable } from '@angular/core';
import { FirebaseAuth } from '@app/core/services/firebase/auth/firebase-auth';

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
