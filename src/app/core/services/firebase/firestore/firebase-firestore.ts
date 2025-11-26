import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, query, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FirebaseFirestore {
    private readonly firestore = inject(Firestore);

    getCollection<T>(path: string): Observable<T> {
        const ref = collection(this.firestore, path);
        return collectionData(ref) as Observable<T>;
    }

    getDocument<T>(path: string, id: string): Observable<T> {
        const ref = collection(this.firestore, path);
        const docQuery: Query = query(ref);
        return collectionData(docQuery, { idField: 'id' }) as Observable<T>;
    }
}
