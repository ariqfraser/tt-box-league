import { inject, Injectable, OnDestroy } from '@angular/core';
import { Auth, authState, user } from '@angular/fire/auth';
import { Log } from '@app/shared/utils/logger/logger.util';
import { Subscription } from 'rxjs';

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

    ngOnDestroy(): void {
        this.authStateSub.unsubscribe();
    }
}
