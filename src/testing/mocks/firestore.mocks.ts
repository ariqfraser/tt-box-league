/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="jest" />

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

// Mock @angular/fire/firestore
jest.mock('@angular/fire/firestore', () => ({
    Firestore: class MockFirestore {},
}));
