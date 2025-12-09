import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Log } from '@shared/utils/logger/logger.util';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

/**
 *
 */
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatBottomSheetModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements AfterViewInit {
    protected readonly title = signal('tt-box-league');

    /**
     *
     */
    constructor() {
        Log.debug(`App title is:`, this.title());
    }

    /**
     *
     */
    ngAfterViewInit(): void {
        Log.debug('App component initialized');
    }
}
