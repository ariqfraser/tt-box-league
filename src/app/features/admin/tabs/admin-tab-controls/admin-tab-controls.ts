import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseFunctions } from '@core/services/firebase/functions/firebase-functions';
import { Log } from '@shared/utils/logger/logger.util';

/**
 *
 */
@Component({
    selector: 'app-admin-tab-controls',
    imports: [MatButtonModule],
    templateUrl: './admin-tab-controls.html',
    styleUrl: './admin-tab-controls.scss',
})
export class AdminTabControls {
    private readonly fn = inject(FirebaseFunctions);

    /**
     *
     */
    startNewSeason(): void {
        this.fn.call('startNewSeason').subscribe((res) => {
            Log.info('[AdminTabControls] startNewSeason response:', res);
        });
    }
}
