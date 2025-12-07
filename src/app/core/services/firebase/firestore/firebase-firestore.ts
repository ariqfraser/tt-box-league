import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, query, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 *
 */
@Injectable({
    providedIn: 'root',
})
export class FirebaseFirestore {
    private readonly firestore = inject(Firestore);

    /**
     * @param path
     * @returns Observable of collection data
     */
    getCollection<T>(path: string): Observable<T> {
        const ref = collection(this.firestore, path);
        return collectionData(ref) as Observable<T>;
    }

    /**
     * @param path
     * @returns Observable of document data
     */
    getDocument<T>(path: string): Observable<T> {
        const ref = collection(this.firestore, path);
        const docQuery: Query = query(ref);
        return collectionData(docQuery, { idField: 'documentId' }) as Observable<T>;
    }
}
