export class Storage {
    private static prefix = "stellar";

    private static key(key: string) {
        return `${this.prefix}:${key}`;
    }

    static set<T>(key: string, value: T): void {
        localStorage.setItem(this.key(key), JSON.stringify(value));
    }

    static get<T>(key: string, defaultValue?: T): T | null {
        const raw = localStorage.getItem(this.key(key));
        if (!raw) return defaultValue ?? null;

        try {
            return JSON.parse(raw) as T;
        } catch {
            return defaultValue ?? null;
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
