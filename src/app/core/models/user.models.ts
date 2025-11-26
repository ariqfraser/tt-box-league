import { Timestamp } from '@angular/fire/firestore';

/**
 * Interface representing a user document
 */
export interface User {
    id: string;
    name: string;
    username: string;
    joinDate: Timestamp;
    winCount: number;
    lossCount: number;
    elo: number;
}
