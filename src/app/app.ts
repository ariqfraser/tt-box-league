import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Log } from '@shared/utils/logger/logger.util';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { RegisterService } from './features/register/register.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatBottomSheetModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements AfterViewInit {
    private readonly register = inject(RegisterService);

    protected readonly title = signal('tt-box-league');

    constructor() {
        Log.debug(`App title is:`, this.title());
    }

    ngAfterViewInit(): void {
        this.register.openRegisterDialog();
    }
}
