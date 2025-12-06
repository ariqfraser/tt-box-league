import { Timestamp } from '@angular/fire/firestore';

export type UserId = string;

/**
 * Interface representing a user document
 */
export interface User {
    id: UserId;
    name: string;
    username: string;
    joinDate: Timestamp;
    wins: number;
    losses: number;
    elo: number;
}
