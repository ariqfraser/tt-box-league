import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable, HttpsCallableResult } from '@angular/fire/functions';
import { from, Observable } from 'rxjs';

/**
 * Abstraction service for calling Firebase Cloud Functions
 */
@Injectable({
    providedIn: 'root',
})
export class FirebaseFunctions {
    private readonly functions = inject(Functions);

    /**
     * Calls a Firebase Cloud Function with the given name and data
     * @param name - the name of the Cloud Function to call
     * @param data - the data to send to the Cloud Function
     * @returns an Observable of the Cloud Function result
     */
    call<Response, Request>(
        name: string,
        data?: Request,
    ): Observable<HttpsCallableResult<Response>> {
        const callable = httpsCallable(this.functions, name);
        return from(callable(data) as Promise<HttpsCallableResult<Response>>);
    }
}
