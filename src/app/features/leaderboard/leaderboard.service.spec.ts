import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from './leaderboard.service';
import { FirestoreAccess } from '@core/services/firebase/firestore-access/firestore-access';
import { of } from 'rxjs';

describe('LeaderboardService', () => {
    let service: LeaderboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LeaderboardService,
                {
                    provide: FirestoreAccess,
                    useValue: {
                        getUsers: () => of([]),
                    },
                },
            ],
        });
        service = TestBed.inject(LeaderboardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
