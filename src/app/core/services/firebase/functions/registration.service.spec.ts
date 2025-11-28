import { TestBed } from '@angular/core/testing';
import { RegistrationService, RegisterRequest, RegisterError } from './registration.service';
import { httpsCallable, Functions } from '@angular/fire/functions';

jest.mock('@angular/fire/functions', () => ({
    httpsCallable: jest.fn(),
    Functions: jest.fn(),
}));

describe('RegistrationService', () => {
    let service: RegistrationService;
    let mockHttpsCallable: jest.Mock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RegistrationService, { provide: Functions, useValue: {} }],
        });
        service = TestBed.inject(RegistrationService);
        mockHttpsCallable = httpsCallable as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should call httpsCallable with register function name', (done) => {
            const request: RegisterRequest = {
                username: 'testuser',
                password: 'password123',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const mockCallable = jest.fn(() =>
                Promise.resolve({ data: { ok: true, uid: 'uid123', username: 'testuser' } }),
            );
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(() => {
                expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), 'register');
                done();
            });
        });

        it('should return registration response on success', (done) => {
            const request: RegisterRequest = {
                username: 'testuser',
                password: 'password123',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const expectedResponse = {
                ok: true,
                uid: 'uid123',
                username: 'testuser',
            };

            const mockCallable = jest.fn(() => Promise.resolve({ data: expectedResponse }));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe((response) => {
                expect(response).toEqual(expectedResponse);
                done();
            });
        });

        it('should map invalid-argument error', (done) => {
            const request: RegisterRequest = {
                username: 'invalid',
                password: 'short',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const error = new Error('Function call error: invalid-argument: Password too short');
            (error as Error & { code?: string }).code = 'invalid-argument';

            const mockCallable = jest.fn(() => Promise.reject(error));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(
                () => fail('should have thrown'),
                (err: RegisterError) => {
                    expect(err.code).toBe('invalid-argument');
                    expect(err.message).toContain('Invalid username or password');
                    done();
                },
            );
        });

        it('should map already-exists error', (done) => {
            const request: RegisterRequest = {
                username: 'existinguser',
                password: 'password123',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const error = new Error('Function call error: already-exists: Username taken');
            (error as Error & { code?: string }).code = 'already-exists';

            const mockCallable = jest.fn(() => Promise.reject(error));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(
                () => fail('should have thrown'),
                (err: RegisterError) => {
                    expect(err.code).toBe('already-exists');
                    expect(err.message).toContain('already taken');
                    done();
                },
            );
        });

        it('should map permission-denied error', (done) => {
            const request: RegisterRequest = {
                username: 'testuser',
                password: 'password123',
                verificationCode: 'wrongcode',
                fullName: 'Test User',
            };

            const error = new Error('Function call error: permission-denied: Invalid code');
            (error as Error & { code?: string }).code = 'permission-denied';

            const mockCallable = jest.fn(() => Promise.reject(error));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(
                () => fail('should have thrown'),
                (err: RegisterError) => {
                    expect(err.code).toBe('permission-denied');
                    expect(err.message).toContain('verification code');
                    done();
                },
            );
        });

        it('should map resource-exhausted error', (done) => {
            const request: RegisterRequest = {
                username: 'testuser',
                password: 'password123',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const error = new Error('Function call error: resource-exhausted: Rate limit');
            (error as Error & { code?: string }).code = 'resource-exhausted';

            const mockCallable = jest.fn(() => Promise.reject(error));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(
                () => fail('should have thrown'),
                (err: RegisterError) => {
                    expect(err.code).toBe('resource-exhausted');
                    expect(err.message).toContain('Too many');
                    done();
                },
            );
        });

        it('should map internal error', (done) => {
            const request: RegisterRequest = {
                username: 'testuser',
                password: 'password123',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const error = new Error('Function call error: internal: Server error');
            (error as Error & { code?: string }).code = 'internal';

            const mockCallable = jest.fn(() => Promise.reject(error));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(
                () => fail('should have thrown'),
                (err: RegisterError) => {
                    expect(err.code).toBe('internal');
                    expect(err.message).toContain('error occurred');
                    done();
                },
            );
        });

        it('should handle generic Error', (done) => {
            const request: RegisterRequest = {
                username: 'testuser',
                password: 'password123',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const error = new Error('Network error');

            const mockCallable = jest.fn(() => Promise.reject(error));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(
                () => fail('should have thrown'),
                (err: RegisterError) => {
                    expect(err.code).toBe('unknown');
                    expect(err.message).toContain('Network error');
                    done();
                },
            );
        });

        it('should handle non-Error rejection', (done) => {
            const request: RegisterRequest = {
                username: 'testuser',
                password: 'password123',
                verificationCode: 'code123',
                fullName: 'Test User',
            };

            const mockCallable = jest.fn(() => Promise.reject('unknown error'));
            mockHttpsCallable.mockReturnValue(mockCallable);

            service.register(request).subscribe(
                () => fail('should have thrown'),
                (err: RegisterError) => {
                    expect(err.code).toBe('unknown');
                    expect(err.message).toContain('unexpected error');
                    done();
                },
            );
        });
    });
});
