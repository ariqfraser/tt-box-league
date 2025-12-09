import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from './account.service';

/**
 *
 */
@Component({
    selector: 'app-account',
    imports: [MatButtonModule],
    templateUrl: './account.html',
    styleUrl: './account.scss',
})
export class Account {
    private readonly service = inject(AccountService);

    /**
     *
     */
    logout(): void {
        this.service.logout();
    }
}
