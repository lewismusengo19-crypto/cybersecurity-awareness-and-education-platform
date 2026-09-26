import { useState, useEffect, useCallback } from 'react';
import {
  CachedEducationalItem,
  getCachedMetadata,
  isItemCached as checkIsCached,
  cacheEducationalItem,
  autoCacheViewedItem,
  removeCachedItem,
  clearAllCachedContent,
  cacheAllEducationalContent,
  getStorageStats,
  purgeVideosAndPdfsFromOfflineCache
} from '../utils/offlineContentCache';

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [cachedItems, setCachedItems] = useState<CachedEducationalItem[]>(getCachedMetadata());
  const [cachedIds, setCachedIds] = useState<Set<string>>(
    new Set(getCachedMetadata().map(i => i.id))
  );
  const [isBatchCaching, setIsBatchCaching] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ progress: number; label: string }>({
    progress: 0,
    label: ''
  });
  const [storageStats, setStorageStats] = useState<{
    itemCount: number;
    byType: { videos: number; images: number; pdfs: number; quizzes: number };
    storageEstimateMb: string;
  }>({
    itemCount: 0,
    byType: { videos: 0, images: 0, pdfs: 0, quizzes: 0 },
    storageEstimateMb: '0 MB'
  });

  // Refresh cached metadata and storage stats
  const refreshCacheState = useCallback(() => {
    const items = getCachedMetadata();
    setCachedItems(items);
    setCachedIds(new Set(items.map(i => i.id)));
    getStorageStats().then(setStorageStats);
  }, []);

  useEffect(() => {
    // Initial purge of old video/pdf caches and stats load
    purgeVideosAndPdfsFromOfflineCache().then(() => {
      refreshCacheState();
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleCacheUpdated = () => refreshCacheState();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('cyber-cache-updated', handleCacheUpdated);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('cyber-cache-updated', handleCacheUpdated);
    };
  }, [refreshCacheState]);

  const isItemCached = useCallback(
    (id: string): boolean => {
      return cachedIds.has(id);
    },
    [cachedIds]
  );

  const cacheItem = useCallback(
    async (item: CachedEducationalItem): Promise<boolean> => {
      const ok = await cacheEducationalItem(item);
      if (ok) refreshCacheState();
      return ok;
    },
    [refreshCacheState]
  );

  const autoCache = useCallback((item: CachedEducationalItem) => {
    autoCacheViewedItem(item);
  }, []);

  const removeItem = useCallback(
    async (id: string): Promise<boolean> => {
      const ok = await removeCachedItem(id);
      if (ok) refreshCacheState();
      return ok;
    },
    [refreshCacheState]
  );

  const clearCache = useCallback(async (): Promise<boolean> => {
    const ok = await clearAllCachedContent();
    if (ok) refreshCacheState();
    return ok;
  }, [refreshCacheState]);

  const cacheAll = useCallback(
    async (videos: any[], images: any[], pdfs: any[], quizzes: any[]) => {
      setIsBatchCaching(true);
      setBatchProgress({ progress: 0, label: 'Starting offline sync...' });

      try {
        await cacheAllEducationalContent(videos, images, pdfs, quizzes, (progress, label) => {
          setBatchProgress({ progress, label });
        });
        refreshCacheState();
      } finally {
        setTimeout(() => {
          setIsBatchCaching(false);
          setBatchProgress({ progress: 100, label: 'All lessons cached for offline access!' });
        }, 800);
      }
    },
    [refreshCacheState]
  );

  return {
    isOnline,
    cachedItems,
    cachedIds,
    isItemCached,
    cacheItem,
    autoCache,
    removeItem,
    clearCache,
    cacheAll,
    isBatchCaching,
    batchProgress,
    storageStats,
    refreshCacheState
  };
}
