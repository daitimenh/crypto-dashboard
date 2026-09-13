// Client-side cache service with in-memory and localStorage persistence (TTL 30-60s)

const memoryCache = new Map();
const DEFAULT_TTL_MS = 60 * 1000; // 60s

export const cacheService = {
  /**
   * Lưu dữ liệu vào cache
   */
  set(key, data, ttlMs = DEFAULT_TTL_MS) {
    const item = {
      data,
      expiry: Date.now() + ttlMs
    };
    memoryCache.set(key, item);
    try {
      localStorage.setItem(`coingecko_cache_${key}`, JSON.stringify(item));
    } catch (e) {
      console.warn("Storage quota exceeded or private mode", e);
    }
  },

  /**
   * Lấy dữ liệu từ cache nếu chưa hết hạn
   */
  get(key) {
    // 1. Kiểm tra In-Memory
    if (memoryCache.has(key)) {
      const item = memoryCache.get(key);
      if (Date.now() < item.expiry) {
        return item.data;
      }
      memoryCache.delete(key);
    }

    // 2. Kiểm tra LocalStorage
    try {
      const stored = localStorage.getItem(`coingecko_cache_${key}`);
      if (stored) {
        const item = JSON.parse(stored);
        if (Date.now() < item.expiry) {
          memoryCache.set(key, item); // Warm up memory cache
          return item.data;
        }
        localStorage.removeItem(`coingecko_cache_${key}`);
      }
    } catch (e) {
      // Fallback ignore
    }

    return null;
  },

  /**
   * Xóa toàn bộ cache khi người dùng chủ động bấm 'Refresh'
   */
  clear() {
    memoryCache.clear();
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('coingecko_cache_')) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {}
  }
};
