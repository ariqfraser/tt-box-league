import { computed, inject, Injectable } from '@angular/core';
import { Match } from '@app/core/models/match.models';
import { MatchesService } from '@app/core/services/matches/matches.service';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class BoxLeagueService {
    private readonly matchesService = inject(MatchesService);

    boxes = computed(() => {
        const matches = this.matchesService.currentSeasonMatches();
        const boxes: Match[][] = [];
        for (const match of matches) {
            if (!boxes[match.box]) boxes[match.box] = [];
            boxes[match.box].push(match);
        }
        return boxes;
    });
}
