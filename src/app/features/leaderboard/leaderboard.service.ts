import { inject, Injectable } from '@angular/core';
import { User } from '@app/core/models/user.models';
import { FirebaseFirestore } from '@core/services/firebase/firestore/firebase-firestore';
import { Observable } from 'rxjs';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    private readonly firestore = inject(FirebaseFirestore);

    /**
     *
     * @returns all users for the leaderboard
     */
    getLeaderboardData(): Observable<User[]> {
        return this.firestore.getCollection<User[]>('users');
    }
}
