import { inject, Injectable } from '@angular/core';
import { User } from '@core/models/user.models';
import { FirestoreAccess } from '@core/services/firebase/firestore-access/firestore-access';
import { Observable } from 'rxjs';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    private readonly firestoreAccess = inject(FirestoreAccess);

    /**
     *
     * @returns all users for the leaderboard
     */
    getLeaderboardData(): Observable<User[]> {
        return this.firestoreAccess.getUsers();
    }
}
