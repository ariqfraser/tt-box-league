import { Component } from '@angular/core';
import { Match } from '@app/core/models/match.models';
import { LeagueBox } from '@app/shared/ui/league-box/league-box';
import { premadeMatches } from './admin-tab-box-league.const';
import { Log } from '@app/shared/utils/logger/logger.util';

@Component({
  selector: 'app-admin-tab-box-league',
  imports: [LeagueBox],
  templateUrl: './admin-tab-box-league.html',
  styleUrl: './admin-tab-box-league.scss',
})
export class AdminTabBoxLeague {
    protected readonly premadeMatches: Match[] = premadeMatches;

    onAddScore(matchId: string): void {
      Log.debug('onAddScore', {matchId});
    }
}
