import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Request body for user registration
 */
export interface RegisterRequest {
    username: string;
    password: string;
    verificationCode: string;
    fullName: string;
}

/**
 * Response from successful registration
 */
export interface RegisterResponse {
    ok: boolean;
    uid: string;
    username: string;
}

/**
 * Error response from registration failure
 */
export interface RegisterError {
    code: string;
    message: string;
}

/**
 * Service for user registration via Cloud Function
 * Handles communication with the backend register callable function
 */
@Injectable({
    providedIn: 'root',
})
export class RegistrationService {
    private readonly functions = inject(Functions);

    /**
     * Registers a new user with email/password authentication
     * @param request Registration request with username, password, verification code
     * @returns Observable of registration response with uid and username
     * @throws {RegisterError} if registration fails
     */
    register(request: RegisterRequest): Observable<RegisterResponse> {
        const registerFn = httpsCallable<RegisterRequest, RegisterResponse>(
            this.functions,
            'register',
        );

        return from(registerFn(request)).pipe(
            map((result) => result.data),
            catchError((error: unknown) => this.mapFirebaseError(error)),
        );
    }

    /**
     * Maps Firebase HTTP error to user-friendly RegisterError
     * @param error Firebase error or unknown error
     * @returns Observable that throws RegisterError
     */
    private mapFirebaseError(error: unknown): Observable<never> {
        let registerError: RegisterError;

        if (error instanceof Error && 'code' in error) {
            const firebaseError = error as Error & { code?: string; message: string };
            registerError = this.mapHttpsError(firebaseError);
        } else if (error instanceof Error) {
            registerError = {
                code: 'unknown',
                message: `An unexpected error occurred: ${error.message}`,
            };
        } else {
            registerError = {
                code: 'unknown',
                message: 'An unexpected error occurred.',
            };
        }

        return throwError(() => registerError);
    }

    /**
     * Maps Firebase error codes to user-friendly messages
     * @param error Firebase error object with code property
     * @returns RegisterError with appropriate message
     */
    private mapHttpsError(error: Error & { code?: string }): RegisterError {
        const code = error.code || 'unknown';
        const originalMessage = error.message || '';

        switch (code) {
            case 'invalid-argument':
                return {
                    code: 'invalid-argument',
                    message:
                        this.extractFirebaseMessage(originalMessage) ||
                        'Invalid username or password. Please check your input.',
                };

            case 'already-exists':
                return {
                    code: 'already-exists',
                    message: 'This username is already taken. Please choose another.',
                };

            case 'permission-denied':
                return {
                    code: 'permission-denied',
                    message: 'Invalid verification code.',
                };

            case 'resource-exhausted':
                return {
                    code: 'resource-exhausted',
                    message: 'Too many registration attempts. Please wait before trying again.',
                };

            case 'internal':
            case 'unknown':
            default:
                return {
                    code: 'internal',
                    message: 'An error occurred during registration. Please try again later.',
                };
        }
    }

    /**
     * Extracts the original error message from Firebase error message
     * Firebase error messages are formatted as "Function call error: <code>: <message>"
     * @param message Full Firebase error message
     * @returns Extracted message or empty string
     */
    private extractFirebaseMessage(message: string): string {
        // Firebase error format: "Function call error: invalid-argument: <actual message>"
        const match = message.match(/Function call error: \w+: (.+)/);
        return match?.[1] || '';
    }
}
