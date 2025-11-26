import { environment } from '@env/environment';

/**
 * Logger utility class for logging messages to the console.
 * In production mode, logging is disabled.
 */
export class Log {
    static debug(message: string, data?: unknown): void {
        if (environment.isProduction) {
            return;
        }
        console.trace(`%c[DEBUG]%c ${message}`, 'color: lightblue; font-size: 1em;', data);
    }

    static info(message: string, data?: unknown): void {
        if (environment.isProduction) {
            return;
        }
        console.info(`%c[INFO]%c ${message}`, 'color: lightgreen; font-size: 1em;', data);
    }
}
