import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoxLeague } from './box-league';
import { BoxLeagueService } from './box-league.service';
import { MatchesService } from '@core/services/matches/matches.service';
import { FirestoreAccess } from '@core/services/firebase/firestore-access/firestore-access';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('BoxLeague', () => {
    let component: BoxLeague;
    let fixture: ComponentFixture<BoxLeague>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BoxLeague],
            providers: [
                {
                    provide: BoxLeagueService,
                    useValue: {
                        boxes: signal([]),
                    },
                },
                {
                    provide: MatchesService,
                    useValue: {
                        currentSeasonMatches: signal([]),
                    },
                },
                {
                    provide: FirestoreAccess,
                    useValue: {
                        getUsers: () => of([]),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BoxLeague);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
