import { TestBed } from '@angular/core/testing';
import { StorageSchema, StorageSchemaKey } from '@configs/storage.config';

import { StorageService } from './storage.service';

describe('StorageService', () => {
    let service: StorageService;
    const schemaKey: StorageSchemaKey = 'USER_EMAIL';
    const storageKey = StorageSchema[schemaKey].key;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StorageService);
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('returns parsed value when storage contains data', () => {
        const storedValue = 'Leia Organa';
        localStorage.setItem(storageKey, JSON.stringify(storedValue));

        const result = service.get(schemaKey);

        expect(result).toBe(storedValue);
    });

    it('falls back to schema default when storage is empty', () => {
        const result = service.get(schemaKey);

        expect(result).toBe(StorageSchema[schemaKey].defaultValue);
    });

    it('returns schema default when JSON parsing fails', () => {
        const invalidPayload = '{not valid json';
        localStorage.setItem(storageKey, invalidPayload);

        const result = service.get(schemaKey);

        expect(result).toBe(StorageSchema[schemaKey].defaultValue);
    });

    it('persists values via set', () => {
        const payload = 'Han Solo';

        service.set(schemaKey, payload);

        const storedValue = localStorage.getItem(storageKey);
        expect(storedValue).toBe(JSON.stringify(payload));
    });

    it('removes items via remove', () => {
        const payload = 'Initial value';
        localStorage.setItem(storageKey, JSON.stringify(payload));

        service.remove(schemaKey);

        expect(localStorage.getItem(storageKey)).toBeNull();
    });
});
