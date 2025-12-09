import { TestBed } from '@angular/core/testing';
import { MatchesService } from './matches.service';
import { FirestoreAccess } from '../firebase/firestore-access/firestore-access';
import { of } from 'rxjs';

describe('MatchesService', () => {
    let service: MatchesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MatchesService,
                {
                    provide: FirestoreAccess,
                    useValue: {
                        getCurrentSeasonMatches: () => of([]),
                    },
                },
            ],
        });
        service = TestBed.inject(MatchesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
