export class Storage {
    private static prefix = "stellar";

    private static key(key: string) {
        return `${this.prefix}:${key}`;
    }

    static set<T>(key: string, value: T): void {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(this.key(key), stringValue);
    }

    static get<T>(key: string, defaultValue?: T): T | null {
        const raw = localStorage.getItem(this.key(key));
        if (!raw) return defaultValue ?? null;

        try {
            return JSON.parse(raw) as T;
        } catch {
            return raw as T;
        }
    }

    static remove(key: string): void {
        localStorage.removeItem(this.key(key));
    }

    static clear(): void {
        const remove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(`${this.prefix}:`)) {
                remove.push(k);
            }
        }
        remove.forEach((k) => localStorage.removeItem(k));
    }
}
