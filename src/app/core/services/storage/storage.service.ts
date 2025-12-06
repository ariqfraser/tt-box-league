import { Injectable } from '@angular/core';
import { StorageSchema, StorageSchemaKey } from '@configs/storage.config';

/**
 * Abstract layer for localStorage.
 * See {@link StorageSchema} for configuration
 */
@Injectable({
    providedIn: 'root',
})
export class StorageService {
    /**
     * Retrieves a value from localStorage based on the storage schema key.
     * @template K - The storage schema key type
     * @param schemaKey - The key to retrieve from storage schema
     * @returns The stored value or the default value if not found or parsing fails
     */
    get<K extends StorageSchemaKey>(schemaKey: K): (typeof StorageSchema)[K]['defaultValue'] {
        try {
            const key = StorageSchema[schemaKey].key;
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : StorageSchema[schemaKey].defaultValue;
        } catch {
            return StorageSchema[schemaKey].defaultValue;
        }
    }

    /**
     * Stores a value in localStorage based on the storage schema key.
     * @template K - The storage schema key type
     * @param schemaKey - The key to store in storage schema
     * @param value - The value to store
     */
    set<K extends StorageSchemaKey>(
        schemaKey: K,
        value: (typeof StorageSchema)[K]['defaultValue'],
    ): void {
        const key = StorageSchema[schemaKey].key;
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Removes a value from localStorage based on the storage schema key.
     * @param schemaKey - The key to remove from storage schema
     */
    remove(schemaKey: StorageSchemaKey): void {
        const key = StorageSchema[schemaKey].key;
        window.localStorage.removeItem(key);
    }
}
