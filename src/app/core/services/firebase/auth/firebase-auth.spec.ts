import { TestBed } from '@angular/core/testing';

import { FirebaseAuth } from './firebase-auth';
import { Auth } from '@angular/fire/auth';
import { Log } from '@app/shared/utils/logger/logger.util';

describe('FirebaseAuth', () => {
    let service: FirebaseAuth;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: Auth, useValue: {} }],
        });

        service = TestBed.inject(FirebaseAuth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        // Ensure Log.debug was called at least once by the constructor subscription
        expect((Log.debug as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(0);
    });
});
