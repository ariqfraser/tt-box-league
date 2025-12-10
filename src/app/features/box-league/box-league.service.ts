import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BoxMatch } from '@core/models/box.models';
import { FirestoreAccess } from '@core/services/firebase/firestore-access/firestore-access';
import { combineLatest, map, Observable } from 'rxjs';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class BoxLeagueService {
    private readonly dataAccess = inject(FirestoreAccess);

    private readonly users$ = this.dataAccess.getUsers();
    private readonly matches$ = this.dataAccess.getCurrentSeasonMatches();
    private readonly mappedMatches$: Observable<BoxMatch[]> = combineLatest([
        this.users$,
        this.matches$,
    ]).pipe(
        map(([users, matches]) => {
            return matches.map((match) => {
                const p1 = users.find((usr) => usr.documentId === match.p1Id)!;
                const p2 = users.find((usr) => usr.documentId === match.p2Id)!;
                return {
                    ...match,
                    p1Name: p1.name,
                    p2Name: p2.name,
                } as BoxMatch;
            });
        }),
    );
    private readonly mappedMatches = toSignal(this.mappedMatches$, { initialValue: [] });

    boxes = computed<BoxMatch[][]>(() => {
        const matches = this.mappedMatches();
        const boxes: BoxMatch[][] = [];
        for (const match of matches) {
            if (!boxes[match.box]) boxes[match.box] = [];
            boxes[match.box].push(match);
        }
        return boxes;
    });
}
