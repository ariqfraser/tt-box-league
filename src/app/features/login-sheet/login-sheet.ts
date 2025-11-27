import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Icon } from '@app/shared/ui/icon/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-login-sheet',
    imports: [MatInputModule, MatFormFieldModule, Icon, MatButtonModule],
    templateUrl: './login-sheet.html',
    styleUrl: './login-sheet.scss',
})
export class LoginSheet {
    protected readonly hidePassword = signal(true);

    togglePasswordVisibility(): void {
        this.hidePassword.update((state) => !state);
    }
}
