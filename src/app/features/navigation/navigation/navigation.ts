import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-navigation',
    imports: [RouterOutlet],
    templateUrl: './navigation.html',
    styleUrl: './navigation.scss',
})
export class Navigation {}
