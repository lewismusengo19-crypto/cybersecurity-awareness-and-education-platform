// Offline Educational Content Caching Manager
// Uses browser Cache Storage API + LocalStorage metadata registry

export interface CachedEducationalItem {
  id: string;
  type: 'video' | 'image' | 'pdf' | 'quiz';
  title_en: string;
  title_bm: string;
  url?: string;
  thumbnailUrl?: string;
  description_en?: string;
  description_bm?: string;
  cachedAt: string;
  fileSizeEstimate?: string;
  quizData?: any;
}

const CACHE_NAME = 'cyber-academy-content-v1';
const STORAGE_KEY = 'cyber_academy_offline_items';

// Check browser support for Cache API
export const isCacheApiSupported = (): boolean => {
  return typeof window !== 'undefined' && 'caches' in window;
};

// Retrieve all cached items metadata from localStorage (excluding removed pdf type)
export const getCachedMetadata = (): CachedEducationalItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: CachedEducationalItem[] = JSON.parse(raw);
    return parsed.filter(item => item.type !== 'pdf');
  } catch (err) {
    console.warn('[CacheManager] Error reading offline items metadata:', err);
    return [];
  }
};

// Purge any residual PDFs from offline cache storage
export const purgeVideosAndPdfsFromOfflineCache = async (): Promise<void> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const items: CachedEducationalItem[] = JSON.parse(raw);
      const filtered = items.filter(i => i.type !== 'pdf');
      const removed = items.filter(i => i.type === 'pdf');
      if (removed.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        if (isCacheApiSupported()) {
          const cache = await caches.open(CACHE_NAME);
          for (const item of removed) {
            if (item.url) await cache.delete(item.url);
            if (item.thumbnailUrl) await cache.delete(item.thumbnailUrl);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[CacheManager] Error purging pdf cache:', err);
  }
};

// Save cached items metadata to localStorage
const saveCachedMetadata = (items: CachedEducationalItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cyber-cache-updated', { detail: items }));
    }
  } catch (err) {
    console.warn('[CacheManager] Error saving offline items metadata:', err);
  }
};

// Check if a specific educational item is cached
export const isItemCached = (id: string): boolean => {
  const items = getCachedMetadata();
  return items.some(item => item.id === id);
};

// Cache a single educational asset (video, image, pdf, or quiz)
export const cacheEducationalItem = async (item: CachedEducationalItem): Promise<boolean> => {
  if (!isCacheApiSupported()) {
    console.warn('[CacheManager] Cache API not supported in this browser.');
    return false;
  }

  try {
    const cache = await caches.open(CACHE_NAME);

    // 1. Fetch & cache primary URL if present
    if (item.url) {
      try {
        const response = await fetch(item.url, { mode: 'cors' });
        if (response.ok || response.type === 'opaque') {
          await cache.put(item.url, response.clone());
        }
      } catch (fetchErr) {
        console.warn(`[CacheManager] Failed to fetch primary asset for ${item.id}:`, fetchErr);
      }
    }

    // 2. Fetch & cache thumbnail URL if present
    if (item.thumbnailUrl) {
      try {
        const thumbResponse = await fetch(item.thumbnailUrl, { mode: 'cors' });
        if (thumbResponse.ok || thumbResponse.type === 'opaque') {
          await cache.put(item.thumbnailUrl, thumbResponse.clone());
        }
      } catch (fetchErr) {
        console.warn(`[CacheManager] Failed to fetch thumbnail for ${item.id}:`, fetchErr);
      }
    }

    // 3. Update metadata registry
    const existing = getCachedMetadata();
    const filtered = existing.filter(i => i.id !== item.id);
    const updated = [
      ...filtered,
      {
        ...item,
        cachedAt: new Date().toISOString()
      }
    ];
    saveCachedMetadata(updated);

    return true;
  } catch (err) {
    console.error('[CacheManager] Failed to cache item:', item.id, err);
    return false;
  }
};

// Auto-cache viewed content in background without blocking UI
export const autoCacheViewedItem = (item: CachedEducationalItem): void => {
  if (isItemCached(item.id)) return;
  
  // Cache in background
  setTimeout(() => {
    cacheEducationalItem(item).catch(err => {
      console.warn('[CacheManager] Auto-cache failed quietly:', err);
    });
  }, 100);
};

// Remove a cached item
export const removeCachedItem = async (id: string): Promise<boolean> => {
  const existing = getCachedMetadata();
  const target = existing.find(i => i.id === id);
  if (!target) return false;

  try {
    if (isCacheApiSupported()) {
      const cache = await caches.open(CACHE_NAME);
      if (target.url) await cache.delete(target.url);
      if (target.thumbnailUrl) await cache.delete(target.thumbnailUrl);
    }

    const updated = existing.filter(i => i.id !== id);
    saveCachedMetadata(updated);
    return true;
  } catch (err) {
    console.error('[CacheManager] Failed to remove item:', id, err);
    return false;
  }
};

// Clear all cached educational content
export const clearAllCachedContent = async (): Promise<boolean> => {
  try {
    if (isCacheApiSupported()) {
      await caches.delete(CACHE_NAME);
    }
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cyber-cache-updated', { detail: [] }));
    }
    return true;
  } catch (err) {
    console.error('[CacheManager] Failed to clear offline cache:', err);
    return false;
  }
};

// Batch cache all educational content (videos, images, pdfs, quizzes)
export const cacheAllEducationalContent = async (
  videos: any[],
  images: any[],
  pdfs: any[],
  quizzes: any[],
  onProgress?: (progress: number, label: string) => void
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;
  const total = videos.length + images.length + pdfs.length + quizzes.length;
  let completed = 0;

  const updateProgress = (label: string) => {
    completed++;
    if (onProgress) {
      const percentage = Math.round((completed / Math.max(total, 1)) * 100);
      onProgress(percentage, label);
    }
  };

  // 1. Cache Videos
  for (const v of videos) {
    const ok = await cacheEducationalItem({
      id: v.id,
      type: 'video',
      title_en: v.title_en,
      title_bm: v.title_bm,
      url: v.url,
      thumbnailUrl: v.thumbnailUrl,
      description_en: v.description_en,
      description_bm: v.description_bm,
      fileSizeEstimate: v.duration,
      cachedAt: new Date().toISOString()
    });
    if (ok) success++; else failed++;
    updateProgress(`Cached Video: ${v.title_en}`);
  }

  // 2. Cache Infographics
  for (const img of images) {
    const ok = await cacheEducationalItem({
      id: img.id,
      type: 'image',
      title_en: img.title_en,
      title_bm: img.title_bm,
      url: img.url,
      thumbnailUrl: img.url,
      description_en: img.description_en,
      description_bm: img.description_bm,
      cachedAt: new Date().toISOString()
    });
    if (ok) success++; else failed++;
    updateProgress(`Cached Infographic: ${img.title_en}`);
  }

  // 3. Cache PDFs
  for (const p of pdfs) {
    const ok = await cacheEducationalItem({
      id: p.id,
      type: 'pdf',
      title_en: p.title_en,
      title_bm: p.title_bm,
      url: p.url,
      description_en: p.description_en,
      description_bm: p.description_bm,
      cachedAt: new Date().toISOString()
    });
    if (ok) success++; else failed++;
    updateProgress(`Cached PDF: ${p.title_en}`);
  }

  // 4. Cache Quizzes
  for (const q of quizzes) {
    const ok = await cacheEducationalItem({
      id: q.id,
      type: 'quiz',
      title_en: q.title_en,
      title_bm: q.title_bm,
      description_en: q.description_en,
      description_bm: q.description_bm,
      quizData: q,
      cachedAt: new Date().toISOString()
    });
    if (ok) success++; else failed++;
    updateProgress(`Cached Quiz: ${q.title_en}`);
  }

  return { success, failed };
};

// Storage estimate helper
export const getStorageStats = async (): Promise<{
  itemCount: number;
  byType: { videos: number; images: number; pdfs: number; quizzes: number };
  storageEstimateMb: string;
}> => {
  const items = getCachedMetadata();
  const byType = {
    videos: items.filter(i => i.type === 'video').length,
    images: items.filter(i => i.type === 'image').length,
    pdfs: items.filter(i => i.type === 'pdf').length,
    quizzes: items.filter(i => i.type === 'quiz').length
  };

  let storageEstimateMb = 'Calculating...';
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usedBytes = estimate.usage || 0;
      storageEstimateMb = `${(usedBytes / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      storageEstimateMb = `${items.length * 1.5} MB (est.)`;
    }
  } else {
    storageEstimateMb = `${items.length * 1.5} MB (est.)`;
  }

  return {
    itemCount: items.length,
    byType,
    storageEstimateMb
  };
};
