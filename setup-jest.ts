import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing';

// Polyfill global web APIs for Jest 30 compatibility with Firebase auth
if (typeof global.fetch === 'undefined') {
    global.fetch = jest.fn();
}
if (typeof global.Request === 'undefined') {
    (global as unknown as Record<string, unknown>).Request = jest.fn();
}
if (typeof global.Response === 'undefined') {
    (global as unknown as Record<string, unknown>).Response = jest.fn();
}

setupZoneTestEnv();
