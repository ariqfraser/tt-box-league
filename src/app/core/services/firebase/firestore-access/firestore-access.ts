import { inject, Injectable } from '@angular/core';
import { Cache } from '../../cache/cache';
import { FirebaseFirestore } from '../firestore/firebase-firestore';
import { Observable, switchMap, tap } from 'rxjs';
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

    readonly _usersMap = new Map<string, User>();

    /**
     * Retrieves all users from Firestore with caching.
     * Populates internal users map for fast player name lookups.
     * @returns Cached observable of all users.
     */
    getUsers(): Observable<User[]> {
        return this.cache.use<User[]>(
            FirestoreAccessKey.USERS,
            this.firestore
                .getCollection<User>('users')
                .pipe(tap((users) => this.populateUsersMap(users))),
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

    /**
     * Retrieves a player's name by their user ID.
     * Uses cached users map for O(1) lookup. Falls back to null if player not found.
     * @param playerId - The user ID (Firebase Auth UID) of the player.
     * @returns The player's display name, or null if not found.
     */
    getPlayerName(playerId: string): string | null {
        const user = this._usersMap.get(playerId);
        return user?.name ?? null;
    }

    /**
     * Populates the internal users map for fast player name lookups.
     * Called automatically when users are fetched.
     * @param users - Array of users to populate the map with.
     */
    private populateUsersMap(users: User[]): void {
        this._usersMap.clear();
        for (const user of users) {
            this._usersMap.set(user.documentId, user);
        }
    }
}
