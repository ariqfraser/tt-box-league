import { TestBed } from '@angular/core/testing';

import { BoxLeagueService } from './box-league.service';
import { MatchesService } from '@app/core/services/matches/matches.service';
import { signal, WritableSignal } from '@angular/core';
import { Match } from '@app/core/models/match.models';

describe('BoxLeagueService', () => {
    let service: BoxLeagueService;
    let matchesServiceMock: { currentSeasonMatches: WritableSignal<Match[]> };

    beforeEach(() => {
        matchesServiceMock = {
            currentSeasonMatches: signal<Match[]>([]),
        };

        TestBed.configureTestingModule({
            providers: [{ provide: MatchesService, useValue: matchesServiceMock }],
        });
        service = TestBed.inject(BoxLeagueService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should compute boxes correctly', () => {
        const mockMatches: Match[] = [
            { box: 0, documentId: '1' } as Match,
            { box: 1, documentId: '2' } as Match,
            { box: 0, documentId: '3' } as Match,
            { box: 0, documentId: '4' } as Match,
        ];

        matchesServiceMock.currentSeasonMatches.set(mockMatches);

        const expected = [
            [
                { box: 0, documentId: '1' } as Match,
                { box: 0, documentId: '3' } as Match,
                { box: 0, documentId: '4' } as Match,
            ],
            [{ box: 1, documentId: '2' } as Match],
        ];

        const boxes = service.boxes();
        expect(boxes).toEqual(expected);
        expect(boxes).toBeDefined();
    });
});
