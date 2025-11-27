import { inject, Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LoginSheet } from './login-sheet';

@Injectable({
    providedIn: 'root',
})
export class LoginSheetService {
    private readonly _bottomSheet = inject(MatBottomSheet);
    private sheetRef: MatBottomSheetRef<LoginSheet> | undefined;

    open(): void {
        if (this.sheetRef) {
            this.sheetRef.dismiss();
        }

        this.sheetRef = this._bottomSheet.open(LoginSheet, {
            panelClass: 'login-panel',
        });
    }
}
