import { useState, useEffect, useCallback } from 'react';
import { Quiz } from '../types';
import {
  getCachedQuizzes,
  isQuizCached,
  cacheSingleQuiz,
  cacheAllQuizzes,
  removeCachedQuiz,
  clearAllCachedQuizzes,
  getQuizCacheStats,
  QuizCacheStats,
  OFFLINE_CACHE_EVENT
} from '../utils/quizStorageCache';

export function useQuizOfflineCache(initialQuizzes?: Quiz[]) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [cachedQuizzes, setCachedQuizzes] = useState<Quiz[]>(getCachedQuizzes());
  const [cachedIds, setCachedIds] = useState<Set<string>>(
    new Set(getCachedQuizzes().map(q => q.id))
  );
  const [stats, setStats] = useState<QuizCacheStats>(getQuizCacheStats());
  const [justCachedId, setJustCachedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const list = getCachedQuizzes();
    setCachedQuizzes(list);
    setCachedIds(new Set(list.map(q => q.id)));
    setStats(getQuizCacheStats());
  }, []);

  // Sync initial quizzes to cache if cache is empty or new quizzes are available
  useEffect(() => {
    if (initialQuizzes && initialQuizzes.length > 0) {
      const currentCached = getCachedQuizzes();
      const currentCachedMap = new Map(currentCached.map(q => [q.id, q]));
      const needsSync = currentCached.length === 0 || initialQuizzes.some(
        q => !currentCachedMap.has(q.id) || (q.questions?.length !== currentCachedMap.get(q.id)?.questions?.length)
      );
      if (needsSync) {
        cacheAllQuizzes(initialQuizzes);
        refresh();
      }
    }
  }, [initialQuizzes, refresh]);

  // Network & storage listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleCustomUpdate = () => refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.includes('cyber_academy_offline_quiz')) {
        refresh();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener(OFFLINE_CACHE_EVENT, handleCustomUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener(OFFLINE_CACHE_EVENT, handleCustomUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  const checkIsCached = useCallback((quizId: string) => {
    return cachedIds.has(quizId);
  }, [cachedIds]);

  const cacheQuiz = useCallback((quiz: Quiz) => {
    const ok = cacheSingleQuiz(quiz);
    if (ok) {
      setJustCachedId(quiz.id);
      setTimeout(() => setJustCachedId(null), 2500);
      refresh();
    }
    return ok;
  }, [refresh]);

  const cacheAll = useCallback((quizzesToCache: Quiz[]) => {
    const res = cacheAllQuizzes(quizzesToCache);
    refresh();
    return res;
  }, [refresh]);

  const removeQuiz = useCallback((quizId: string) => {
    const ok = removeCachedQuiz(quizId);
    if (ok) refresh();
    return ok;
  }, [refresh]);

  const clearAll = useCallback(() => {
    const ok = clearAllCachedQuizzes();
    if (ok) refresh();
    return ok;
  }, [refresh]);

  return {
    isOnline,
    cachedQuizzes,
    cachedIds,
    stats,
    justCachedId,
    checkIsCached,
    cacheQuiz,
    cacheAll,
    removeQuiz,
    clearAll,
    refresh
  };
}
