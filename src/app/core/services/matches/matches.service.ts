import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Match } from '@core/models/match.models';
import { FirestoreAccess } from '../firebase/firestore-access/firestore-access';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private readonly firestoreAccess = inject(FirestoreAccess);

    currentSeasonMatches = toSignal(this.firestoreAccess.getCurrentSeasonMatches(), {
        initialValue: [] as Match[],
    });
}
