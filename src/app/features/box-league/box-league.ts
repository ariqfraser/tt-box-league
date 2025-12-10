import { Component, inject, OnInit } from '@angular/core';
import { BoxLeagueService } from './box-league.service';
import { Log } from '@shared/utils/logger/logger.util';
import { LeagueBox } from '@shared/ui/league-box/league-box';
import { PageHeader } from '@shared/ui/page-header/page-header';
import { MatButtonModule } from '@angular/material/button';

/**
 *
 */
@Component({
    selector: 'app-box-league',
    imports: [LeagueBox, PageHeader, MatButtonModule],
    templateUrl: './box-league.html',
    styleUrl: './box-league.scss',
})
export class BoxLeague implements OnInit {
    private readonly service = inject(BoxLeagueService);

    readonly boxes = this.service.boxes;

    /**
     *
     */
    ngOnInit(): void {
        Log.info('BoxLeague initialized', { boxCount: this.boxes().length, boxes: this.boxes() });
    }
}
