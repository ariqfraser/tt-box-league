import { Component, inject } from '@angular/core';
import { LeaderboardService } from './leaderboard.service';
import { catchError, map, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

/**
 *  leaderboard feature component
 */
@Component({
    selector: 'app-leaderboard',
    imports: [AsyncPipe, MatTableModule],
    templateUrl: './leaderboard.html',
    styleUrl: './leaderboard.scss',
})
export class Leaderboard {
    private readonly leaderboardService = inject(LeaderboardService);

    protected readonly leaderboard$ = this.leaderboardService.getLeaderboardData().pipe(
        map((users) => {
            return users
                .sort((a, b) => b.elo - a.elo)
                .map((user, index) => ({
                    rank: index + 1,
                    ...user,
                    winRate:
                        user.wins + user.losses > 0
                            ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(2) + '%'
                            : '0%',
                    gamesPlayed: user.wins + user.losses,
                }));
        }),
        tap(console.log),
        catchError(() => of([])),
    );

    protected readonly displayedColumns: string[] = [
        'rank',
        'name',
        'elo',
        'wins',
        'losses',
        'winRate',
        'gamesPlayed',
    ];
}
