import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Admin } from './admin';
import { FirebaseFunctions } from '@core/services/firebase/functions/firebase-functions';
import { MatchesService } from '@core/services/matches/matches.service';
import { FirestoreAccess } from '@core/services/firebase/firestore-access/firestore-access';
import { BoxLeagueService } from '@features/box-league/box-league.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('Admin', () => {
    let component: Admin;
    let fixture: ComponentFixture<Admin>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Admin],
            providers: [
                {
                    provide: FirebaseFunctions,
                    useValue: {
                        call: () => of({ success: true }),
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
                {
                    provide: BoxLeagueService,
                    useValue: {
                        boxes: () => [],
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Admin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
