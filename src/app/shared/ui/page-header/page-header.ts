import { Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 *
 */
@Component({
    selector: 'app-page-header',
    imports: [Icon],
    templateUrl: './page-header.html',
    styleUrl: './page-header.scss',
})
export class PageHeader {
    readonly icon = input('');
}
