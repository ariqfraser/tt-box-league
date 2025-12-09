import { inject, Injectable } from '@angular/core';
import { FirebaseFirestore } from '../firebase/firestore/firebase-firestore';
import { where } from '@angular/fire/firestore';
import { shareReplay, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GlobalSettingsService } from '../global-settings/global-settings.service';
import { Match } from '@app/core/models/match.models';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class MatchesService {
    private readonly fs = inject(FirebaseFirestore);
    private readonly globalSettings = inject(GlobalSettingsService);

    currentSeasonMatches = toSignal(
        this.globalSettings.getGlobalSettings().pipe(
            switchMap(({ currentSeason }) =>
                this.fs.getCollection<Match[]>('matches', where('season', '==', currentSeason)),
            ),
            shareReplay(1),
        ),
        {
            initialValue: [] as Match[],
        },
    );
}
