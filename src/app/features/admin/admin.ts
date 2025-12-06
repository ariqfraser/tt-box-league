import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminTabLogic } from './tabs/admin-tab-logic/admin-tab-logic';
import { AdminTabBoxLeague } from './tabs/admin-tab-box-league/admin-tab-box-league';

/**
 *
 */
@Component({
    selector: 'app-admin',
    imports: [MatTabsModule, AdminTabLogic, AdminTabBoxLeague],
    templateUrl: './admin.html',
    styleUrl: './admin.scss',
})
export class Admin {}
