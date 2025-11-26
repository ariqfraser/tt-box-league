import { TestBed } from '@angular/core/testing';

import { FirebaseFirestore } from './firebase-firestore';

describe('FirebaseFirestore', () => {
    let service: FirebaseFirestore;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FirebaseFirestore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
