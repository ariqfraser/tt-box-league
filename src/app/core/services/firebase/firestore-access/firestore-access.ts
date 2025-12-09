import { inject, Injectable } from '@angular/core';
import { Cache } from '../../cache/cache';
import { FirebaseFirestore } from '../firestore/firebase-firestore';
import { Observable, switchMap } from 'rxjs';
import { User } from '@core/models/user.models';
import { Match } from '@core/models/match.models';
import { FirestoreAccessKey } from './firestore-access.enum';
import { GlobalSettings } from '@core/models/global-settings.model';
import { where } from '@angular/fire/firestore';

/**
 * Firestore data access layer with built-in caching.
 * Provides typed access to frequently accessed collections and documents.
 */
@Injectable({
    providedIn: 'root',
})
export class FirestoreAccess {
    private readonly cache = inject(Cache);
    private readonly firestore = inject(FirebaseFirestore);

    /**
     * Retrieves all users from Firestore with caching.
     * @returns Cached observable of all users.
     */
    getUsers(): Observable<User[]> {
        return this.cache.use<User[]>(
            FirestoreAccessKey.USERS,
            this.firestore.getCollection<User>('users'),
        );
    }

    /**
     * Retrieves global settings document with caching.
     * @returns Cached observable of global settings.
     */
    getGlobalSettings(): Observable<GlobalSettings> {
        return this.cache.use<GlobalSettings>(
            FirestoreAccessKey.GLOBAL_SETTINGS,
            this.firestore.getDocument<GlobalSettings>('settings/global'),
        );
    }

    /**
     * Retrieves matches for the current season with caching.
     * Dynamically filters by the current season from global settings.
     * @returns Cached observable of current season matches.
     */
    getCurrentSeasonMatches(): Observable<Match[]> {
        return this.cache.use<Match[]>(
            FirestoreAccessKey.CURRENT_SEASON_MATCHES,
            this.getGlobalSettings().pipe(
                switchMap(({ currentSeason }) =>
                    this.firestore.getCollection<Match>(
                        'matches',
                        where('season', '==', currentSeason),
                    ),
                ),
            ),
        );
    }
}
