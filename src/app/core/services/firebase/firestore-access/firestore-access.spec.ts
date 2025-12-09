import { TestBed } from '@angular/core/testing';
import { FirestoreAccess } from './firestore-access';
import { Cache } from '../../cache/cache';
import { FirebaseFirestore } from '../firestore/firebase-firestore';
import { of } from 'rxjs';

describe('FirestoreAccess', () => {
    let service: FirestoreAccess;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FirestoreAccess,
                {
                    provide: Cache,
                    useValue: {
                        use: () => of([]),
                    },
                },
                {
                    provide: FirebaseFirestore,
                    useValue: {
                        getCollection: () => of([]),
                        getDocument: () => of({}),
                    },
                },
            ],
        });
        service = TestBed.inject(FirestoreAccess);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
