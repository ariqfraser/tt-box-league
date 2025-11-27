import { environment } from '@env/environment';

/**
 * Logger utility class for logging messages to the console.
 *
 * In production mode (`environment.isProduction === true`), logging is
 * suppressed and the methods are no-ops. Each method sends a formatted
 * message to the appropriate console method when not in production.
 *
 * Example:
 * ```ts
 * Log.debug('Loaded user', user);
 * Log.info('Server started');
 * Log.warn('Deprecated API used');
 * ```
 */
export class Log {
    /**
     * Log a debug-level trace message.
     *
     * This uses `console.trace` so the call site is visible in dev tools.
     * @param message - Short human readable message describing the event
     * @param data - Optional additional data to include with the log
     */
    static debug(message: string, data?: unknown): void {
        if (environment.isProduction) {
            return;
        }
        console.trace(`%c[DEBUG]%c ${message}`, 'color: lightblue; font-size: 1em;', data);
    }

    /**
     * Log an informational message.
     * @param message - Short human readable message describing the event
     * @param data - Optional additional data to include with the log
     */
    static info(message: string, data?: unknown): void {
        if (environment.isProduction) {
            return;
        }
        console.info(`%c[INFO]%c ${message}`, 'color: lightgreen; font-size: 1em;', data);
    }

    /**
     * Log a warning message.
     * @param message - Short human readable message describing the event
     * @param data - Optional additional data to include with the log
     */
    static warn(message: string, data?: unknown): void {
        if (environment.isProduction) {
            return;
        }
        console.info(`%c[WARN]%c ${message}`, 'color: lightorange; font-size: 1em;', data);
    }
}
