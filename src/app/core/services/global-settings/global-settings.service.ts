import { inject, Injectable } from '@angular/core';
import { FirebaseFirestore } from '../firebase/firestore/firebase-firestore';
import { Observable, shareReplay } from 'rxjs';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class GlobalSettingsService {
    private readonly firestore = inject(FirebaseFirestore);

    /** Get global settings */
    getGlobalSettings(): Observable<unknown> {
        return this.firestore.getDocument<unknown>('settings/global').pipe(shareReplay(1));
    }
}
