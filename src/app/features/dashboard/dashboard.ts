import { Component, inject } from '@angular/core';
import { LoginSheetService } from '../login-sheet/login-sheet.service';

@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    private login = inject(LoginSheetService);

    openLoginSheet(): void {
        this.login.open();
    }
}
