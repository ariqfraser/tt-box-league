import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Log } from '@shared/utils/logger/logger.util';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('tt-box-league');

    constructor() {
        Log.debug(`App title is:`, this.title());
    }
}
