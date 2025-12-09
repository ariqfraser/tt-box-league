import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Match } from '@core/models/match.models';

/**
 *
 */
@Component({
    selector: 'app-league-box',
    imports: [MatCardModule, MatButtonModule],
    templateUrl: './league-box.html',
    styleUrl: './league-box.scss',
})
export class LeagueBox {
    readonly matches = input.required<Match[]>();
    readonly currentUserId = input.required<string>();
    /** Outputs the target matchId the users wants to add a score  */
    readonly addScore = output<string>();

    readonly playerIds = computed<string[]>(() => {
        const playerIds = new Set<string>();
        for (const match of this.matches()) {
            playerIds.add(match.p1Id);
            playerIds.add(match.p2Id);
        }
        return Array.from(playerIds);
    });

    protected hasMatchConcluded(playerA: string, playerB: string): Match | null {
        const targetMatch = this.findMatchFromPlayers(playerA, playerB);
        return targetMatch.p1Score !== 0 || targetMatch.p2Score !== 0 ? targetMatch : null;
    }

    protected handleClick(playerA: string, playerB: string): void {
        const { documentId: matchId } = this.findMatchFromPlayers(playerA, playerB);
        this.addScore.emit(matchId);
    }

    private findMatchFromPlayers(playerA: string, playerB: string): Match {
        const targetMatch = this.matches().find(({ p1Id, p2Id }) => {
            return (p1Id === playerA && p2Id === playerB) || (p1Id === playerB && p2Id === playerA);
        });

        if (!targetMatch) {
            throw new Error('[FATAL] Could not find match from players', {
                cause: { matches: this.matches, playerA, playerB },
            });
        }

        return targetMatch;
    }
}
