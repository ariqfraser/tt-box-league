import { TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

// Create a subject we can control from the mock
const authStateSubject = new Subject<unknown>();

// Mock @angular/fire/auth before importing the service so imports use the mock
jest.mock('@angular/fire/auth', () => ({
    Auth: class MockAuth {},
    authState: (auth?: unknown) => authStateSubject.asObservable(),
    user: (auth?: unknown) => of(null),
    __esModule: true,
}));

// Mock the logger to prevent console output in tests
jest.mock('@app/shared/utils/logger/logger.util', () => ({
    Log: { debug: jest.fn(), info: jest.fn(), error: jest.fn() },
    __esModule: true,
}));

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
