import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { PageHeader } from '@shared/ui/page-header/page-header';
import { MatIconModule } from '@angular/material/icon';
import { MatchScoreForm } from '@shared/ui/match-score-form/match-score-form';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatchConfirmationDialog } from '@shared/ui/match-confirmation-dialog/match-confirmation-dialog';
import { DashboardService } from './dashboard.service';
import { filter, switchMap } from 'rxjs';

/**
 *
 */
@Component({
    selector: 'app-dashboard',
    imports: [
        PageHeader,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        MatchScoreForm,
        MatDialogModule,
    ],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    private readonly dialog = inject(MatDialog);
    private readonly service = inject(DashboardService);
    protected readonly userMatches = this.service.userMatches;

    /**
     * Opens confirmation dialog for match winner selection
     * @param winner - Object containing winner name and id
     * @param winner.name
     * @param winner.matchId
     * @param winner.winnerId
     */
    matchScoreConfirmation({
        name,
        matchId,
        winnerId,
    }: {
        name: string;
        matchId: string;
        winnerId: string;
    }): void {
        this.dialog
            .open(MatchConfirmationDialog, {
                data: { winner: name },
                disableClose: true,
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => confirmed),
                switchMap(() => this.service.submitWinner(matchId, winnerId)),
            );
    }
}
