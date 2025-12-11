import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';

/**
 *
 */
@Component({
    selector: 'app-match-confirmation-dialog',
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
    templateUrl: './match-confirmation-dialog.html',
    styleUrl: './match-confirmation-dialog.scss',
})
export class MatchConfirmationDialog {
    private readonly dialogRef = inject(MatDialogRef<MatchConfirmationDialog>);
    private readonly data = inject(MAT_DIALOG_DATA);
    readonly winner: string = this.data?.winner ?? 'Unknown';
}
