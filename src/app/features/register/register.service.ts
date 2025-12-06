import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Register } from './register';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private readonly dialog = inject(MatDialog);

    /**
     *
     */
    openRegisterDialog(): void {
        this.dialog.open(Register, {
            disableClose: true,
            autoFocus: false,
        });
    }
}
