import { Component } from '@angular/core';
import { Match } from '@app/core/models/match.models';

@Component({
    selector: 'app-box-league',
    imports: [],
    templateUrl: './box-league.html',
    styleUrl: './box-league.scss',
})
export class BoxLeague {
    protected matches: Match[] = [
        {
            id: '0',
            p1Id: '1',
            p2Id: '2',
            p1Score: 0,
            p2Score: 0,
            timestamp: null,
            season: 1,
            box: 1,
        },
        {
            id: '1',
            p1Id: '1',
            p2Id: '3',
            p1Score: 0,
            p2Score: 0,
            timestamp: null,
            season: 1,
            box: 1,
        },
        {
            id: '2',
            p1Id: '2',
            p2Id: '3',
            p1Score: 0,
            p2Score: 0,
            timestamp: null,
            season: 1,
            box: 1,
        },
    ];
}
