import { TestBed } from '@angular/core/testing';

import { FirestoreAccess } from './firestore-access';

describe('FirestoreAccess', () => {
    let service: FirestoreAccess;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FirestoreAccess);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
