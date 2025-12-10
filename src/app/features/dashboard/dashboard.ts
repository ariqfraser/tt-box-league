import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { PageHeader } from '@shared/ui/page-header/page-header';
import { MatIconModule } from '@angular/material/icon';
import { MatchScoreForm } from '@shared/ui/match-score-form/match-score-form';
import { MatDialogModule } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { MatchConfirmationDialog } from '@shared/ui/match-confirmation-dialog/match-confirmation-dialog';
import { DashboardService } from './dashboard.service';

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
    private readonly dialog = inject(Dialog);
    private readonly service = inject(DashboardService);
    protected readonly userMatches = this.service.userMatches;

    /**
     *
     * @param winnerId
     */
    matchScoreConfirmation(winnerId: string): void {
        alert(`Match submitted! Winner ID: ${winnerId}`);
        this.dialog.open(MatchConfirmationDialog, { data: { winnerId } });
    }
}
