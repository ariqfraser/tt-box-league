import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';

@Component({
    selector: 'app-navigation',
    imports: [RouterOutlet, Icon],
    templateUrl: './navigation.html',
    styleUrl: './navigation.scss',
})
export class Navigation {}
