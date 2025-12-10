import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirebaseAuth } from '@core/services/firebase/auth/firebase-auth';
import { FirestoreAccess } from '@core/services/firebase/firestore-access/firestore-access';
import { BoxLeagueService } from '@features/box-league/box-league.service';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private readonly dataAccess = inject(FirestoreAccess);
    private readonly auth = inject(FirebaseAuth);
    private readonly boxLeagueService = inject(BoxLeagueService);

    private readonly user = toSignal(this.auth.user$);
    userMatches = computed(() => {
        return (
            this.boxLeagueService
                .boxes()
                .filter((box) => {
                    return box.some(
                        (match) =>
                            match.p1Id === this.user()?.uid || match.p2Id === this.user()?.uid,
                    );
                })[0]
                ?.filter(
                    ({ p1Id, p2Id }) => p1Id === this.user()?.uid || p2Id === this.user()?.uid,
                ) ?? []
        );
    });
}
