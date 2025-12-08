import { inject, Injectable } from '@angular/core';
import { FirebaseFirestore } from '../firebase/firestore/firebase-firestore';
import { Observable, shareReplay } from 'rxjs';

interface GlobalSettings {
    currentSeason: string;
}

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class GlobalSettingsService {
    private readonly firestore = inject(FirebaseFirestore);

    /** Get global settings */
    getGlobalSettings(): Observable<GlobalSettings> {
        return this.firestore.getDocument<GlobalSettings>('settings/global').pipe(shareReplay(1));
    }
}
