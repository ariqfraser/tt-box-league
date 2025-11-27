import { TestBed } from '@angular/core/testing';

import { FirebaseFirestore } from './firebase-firestore';
import { Firestore } from '@angular/fire/firestore';

describe('FirebaseFirestore', () => {
    let service: FirebaseFirestore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: Firestore, useValue: {} }],
        });
        service = TestBed.inject(FirebaseFirestore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
