import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

/**
 * A simple in-memory cache service for storing Observable values.
 * Useful for memoizing HTTP requests or other asynchronous operations.
 * @example
 * ```typescript
 * constructor(private cache: Cache) {}
 *
 * getData(): Observable<Data> {
 *   try {
 *     return this.cache.get<Data>('data-key');
 *   } catch {
 *     const data$ = this.http.get<Data>('/api/data');
 *     this.cache.set('data-key', data$);
 *     return data$;
 *   }
 * }
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class Cache {
    private readonly store = new Map<string, Observable<unknown>>();

    /**
     *
     * @param key
     * @param request
     */
    use<T>(key: string, request: Observable<T>): Observable<T> {
        if (!this.store.has(key)) {
            this.set<T>(key, request);
        }
        return this.get<T>(key);
    }

    /**
     * Retrieves a cached Observable by key.
     * @param key The cache key to look up.
     * @returns The cached Observable.
     * @throws {Error} if no value is found for the given key.
     */
    private get<T>(key: string): Observable<T> {
        const value = this.store.get(key);
        if (!value) {
            throw new Error(`No cached value found for key: ${key}`);
        }
        return value as Observable<T>;
    }

    /**
     * Stores an Observable in the cache.
     * @param key The cache key to store under.
     * @param value The Observable to cache.
     * @throws {Error} if a value already exists for the given key.
     */
    private set<T>(key: string, value: Observable<T>): void {
        if (this.store.has(key)) {
            throw new Error(`Cache already contains a value for key: ${key}`);
        }
        this.store.set(key, value.pipe(shareReplay(1)));
    }

    /**
     * Checks if a cached value exists for the given key.
     * @param key The cache key to check.
     * @returns True if a value exists, false otherwise.
     */
    private has(key: string): boolean {
        return this.store.has(key);
    }

    /**
     * Clears all cached values from the store.
     */
    flush(): void {
        this.store.clear();
    }
}
