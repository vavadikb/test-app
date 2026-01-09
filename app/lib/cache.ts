type CacheEntry<T> = {
  value: T;
  expires: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export function getFromCache<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expires < Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttlSeconds = 60): void {
  store.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}

export function buildCacheKey(parts: (string | number | undefined)[]): string {
  return parts.filter(Boolean).join(":");
}
