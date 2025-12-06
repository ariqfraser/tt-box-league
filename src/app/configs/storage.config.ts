/**
 * Storage schema configuration used by the storage service.
 *
 * Description:
 * This schema defines all localStorage keys and their default values. It ensures type-safe access
 * and prevents direct localStorage manipulation. **Never access localStorage directly**—always use
 * {@link StorageService} for reading, writing, or removing values.
 *
 * Shape summary:
 *  - key: string — the localStorage key used to persist the value.
 *  - defaultValue: T — the default value returned if the key is not found in storage.
 *
 * Remarks:
 * - To add new localStorage items, amend this schema with a new entry (key + defaultValue).
 * - Use {@link StorageService.get}, {@link StorageService.set}, and {@link StorageService.remove} exclusively.
 * - All values are serialised to JSON when stored in localStorage.
 * - The schema is immutable; modify the service if storage behaviour needs to change.

 */
export const StorageSchema = {
    USER_EMAIL: { key: 'user_email', defaultValue: '' as string },
} as const;

export type StorageKey = (typeof StorageSchema)[keyof typeof StorageSchema]['key'];
export type StorageSchemaKey = keyof typeof StorageSchema;
