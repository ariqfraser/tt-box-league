import { Timestamp } from '@angular/fire/firestore';

/**
 * Interface representing a match document
 */
export interface Match {
    id: string;
    p1Id: string;
    p2Id: string;
    p1Score: number;
    p2Score: number;
    timestamp: Timestamp | null;
    season: number;
    box: number;
}