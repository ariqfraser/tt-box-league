import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
    getAnalytics,
    provideAnalytics,
    ScreenTrackingService,
    UserTrackingService,
} from '@angular/fire/analytics';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';
import { environment } from '@env/environment';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideFirebaseApp(() =>
            initializeApp({
                projectId: 'tt-box-d7764',
                appId: '1:188445509374:web:1efdc25294c03caf6087af',
                storageBucket: 'tt-box-d7764.firebasestorage.app',
                apiKey: 'AIzaSyD-_d-kYZw99J4nlWKFpnrNwKjZ_FBV58s',
                authDomain: 'tt-box-d7764.firebaseapp.com',
                messagingSenderId: '188445509374',
                measurementId: 'G-KXX8WTW53N',
                // projectNumber: '188445509374',
                // version: '2',
            }),
        ),
        provideAuth(() => {
            const auth = getAuth();

            if (!environment.isProduction && environment.useEmulators) {
                connectAuthEmulator(auth, 'http://localhost:9099');
            }

            return auth;
        }),
        provideAnalytics(() => getAnalytics()),
        ScreenTrackingService,
        UserTrackingService,
        provideFirestore(() => {
            const firestore = getFirestore();
            if (!environment.isProduction && environment.useEmulators) {
                connectFirestoreEmulator(firestore, 'localhost', 8082);
            }
            return firestore;
        }),
        provideDatabase(() => {
            const db = getDatabase();
            if (!environment.isProduction && environment.useEmulators) {
                connectDatabaseEmulator(db, 'localhost', 8081);
            }
            return db;
        }),
        provideFunctions(() => {
            const functions = getFunctions();
            if (!environment.isProduction && environment.useEmulators) {
                connectFunctionsEmulator(functions, 'localhost', 5001);
            }
            return functions;
        }),
    ],
};
