import { inject, Injectable } from '@angular/core';
import {
    collection,
    collectionData,
    doc,
    docData,
    Firestore,
    query,
    QueryConstraint,
} from '@angular/fire/firestore';
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
     * Retrieves a collection from Firestore.
     * @param path The path to the collection.
     * @param constraints Optional query constraints to filter the collection.
     * @returns Observable emitting an array of collection documents.
     */
    getCollection<T>(path: string, ...constraints: QueryConstraint[]): Observable<T[]> {
        const ref = collection(this.firestore, path);
        if (constraints.length > 0) {
            const queryRef = query(ref, ...constraints);
            return collectionData(queryRef, { idField: 'documentId' }) as Observable<T[]>;
        }
        return collectionData(ref, { idField: 'documentId' }) as Observable<T[]>;
    }

    /**
     * Retrieves a single document from Firestore.
     * @param path The path to the document.
     * @returns Observable emitting the document data.
     */
    getDocument<T>(path: string): Observable<T> {
        const ref = doc(this.firestore, path);
        return docData(ref, { idField: 'documentId' }) as Observable<T>;
    }
}
