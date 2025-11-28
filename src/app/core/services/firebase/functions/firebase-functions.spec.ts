import { TestBed } from '@angular/core/testing';

import { FirebaseFunctions } from './firebase-functions';

describe('FirebaseFunctions', () => {
    let service: FirebaseFunctions;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FirebaseFunctions);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
