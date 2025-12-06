/**
 * Utility class for managing browser cookies.
 * Provides static methods to set and retrieve cookies.
 */
export class CookieStore {
    /**
     * Sets a cookie with the specified name, value, and expiration in days.
     * @param name - The name of the cookie.
     * @param value - The value to store in the cookie.
     * @param days - The number of days until the cookie expires. Defaults to 365 days.
     */
    static setCookie(name: string, value: string, days = 365): void {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    /**
     * Retrieves the value of a cookie by its name.
     * @param name - The name of the cookie to retrieve.
     * @returns The value of the cookie if found, otherwise null.
     */
    static getCookie(name: string): string | null {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}
