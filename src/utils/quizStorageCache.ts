// Local Storage Offline Caching Utility for Quiz Questions
// Enables learners to practice cybersecurity quizzes completely offline

import { Quiz, QuizAttempt } from '../types';

export const OFFLINE_QUIZZES_STORAGE_KEY = 'cyber_academy_offline_quiz_questions_v2';
export const OFFLINE_ATTEMPTS_QUEUE_KEY = 'cyber_academy_offline_attempts_queue';
export const OFFLINE_CACHE_EVENT = 'cyber-quiz-cache-updated';

export interface CachedQuizRecord {
  quiz: Quiz;
  questionCount: number;
  cachedAt: string;
  version: number;
}

export interface QuizCacheStats {
  totalQuizzes: number;
  totalQuestions: number;
  sizeBytes: number;
  sizeFormatted: string;
  lastCachedAt: string | null;
}

// Check if localStorage is accessible in current environment
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (_) {
    return false;
  }
};

// Retrieve all cached quizzes from localStorage
export const getCachedQuizzes = (): Quiz[] => {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUIZZES_STORAGE_KEY);
    if (!raw) return [];
    const records: CachedQuizRecord[] = JSON.parse(raw);
    return records.map(r => r.quiz);
  } catch (err) {
    console.warn('[QuizCache] Error reading cached quizzes from localStorage:', err);
    return [];
  }
};

// Check if a specific quiz is cached locally
export const isQuizCached = (quizId: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  try {
    const raw = localStorage.getItem(OFFLINE_QUIZZES_STORAGE_KEY);
    if (!raw) return false;
    const records: CachedQuizRecord[] = JSON.parse(raw);
    return records.some(r => r.quiz.id === quizId);
  } catch {
    return false;
  }
};

// Cache a single quiz with all its questions into localStorage
export const cacheSingleQuiz = (quiz: Quiz): boolean => {
  if (!isLocalStorageAvailable() || !quiz || !quiz.questions) return false;
  try {
    const raw = localStorage.getItem(OFFLINE_QUIZZES_STORAGE_KEY);
    let records: CachedQuizRecord[] = raw ? JSON.parse(raw) : [];

    // Remove existing if present
    records = records.filter(r => r.quiz.id !== quiz.id);

    // Add updated record
    records.push({
      quiz,
      questionCount: quiz.questions.length,
      cachedAt: new Date().toISOString(),
      version: 2
    });

    localStorage.setItem(OFFLINE_QUIZZES_STORAGE_KEY, JSON.stringify(records));
    
    // Sync with general offline educational storage registry
    try {
      const itemsRaw = localStorage.getItem('cyber_academy_offline_items');
      const items = itemsRaw ? JSON.parse(itemsRaw) : [];
      const filteredItems = items.filter((i: any) => i.id !== quiz.id);
      filteredItems.push({
        id: quiz.id,
        type: 'quiz',
        title_en: quiz.title_en,
        title_bm: quiz.title_bm,
        description_en: quiz.description_en,
        description_bm: quiz.description_bm,
        quizData: quiz,
        cachedAt: new Date().toISOString()
      });
      localStorage.setItem('cyber_academy_offline_items', JSON.stringify(filteredItems));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cyber-cache-updated', { detail: filteredItems }));
      }
    } catch (_) {}

    // Dispatch event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(OFFLINE_CACHE_EVENT, { 
        detail: { action: 'cache-single', quizId: quiz.id } 
      }));
    }

    return true;
  } catch (err) {
    console.error('[QuizCache] Failed to cache quiz to localStorage:', err);
    return false;
  }
};

// Batch cache all quizzes with all questions into localStorage
export const cacheAllQuizzes = (quizzes: Quiz[]): { success: number; total: number } => {
  if (!isLocalStorageAvailable() || !quizzes || quizzes.length === 0) {
    return { success: 0, total: 0 };
  }

  try {
    const raw = localStorage.getItem(OFFLINE_QUIZZES_STORAGE_KEY);
    const existing: CachedQuizRecord[] = raw ? JSON.parse(raw) : [];
    const existingMap = new Map<string, CachedQuizRecord>();
    existing.forEach(r => existingMap.set(r.quiz.id, r));

    let successCount = 0;
    quizzes.forEach(quiz => {
      if (quiz && quiz.questions && quiz.questions.length > 0) {
        existingMap.set(quiz.id, {
          quiz,
          questionCount: quiz.questions.length,
          cachedAt: new Date().toISOString(),
          version: 2
        });
        successCount++;
      }
    });

    const records = Array.from(existingMap.values());
    localStorage.setItem(OFFLINE_QUIZZES_STORAGE_KEY, JSON.stringify(records));

    // Sync with general offline educational storage registry
    try {
      const itemsRaw = localStorage.getItem('cyber_academy_offline_items');
      const items = itemsRaw ? JSON.parse(itemsRaw) : [];
      const nonQuizzes = items.filter((i: any) => i.type !== 'quiz');
      const quizItems = records.map(r => ({
        id: r.quiz.id,
        type: 'quiz',
        title_en: r.quiz.title_en,
        title_bm: r.quiz.title_bm,
        description_en: r.quiz.description_en,
        description_bm: r.quiz.description_bm,
        quizData: r.quiz,
        cachedAt: r.cachedAt
      }));
      const combined = [...nonQuizzes, ...quizItems];
      localStorage.setItem('cyber_academy_offline_items', JSON.stringify(combined));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cyber-cache-updated', { detail: combined }));
      }
    } catch (_) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(OFFLINE_CACHE_EVENT, { 
        detail: { action: 'cache-all', count: successCount } 
      }));
    }

    return { success: successCount, total: quizzes.length };
  } catch (err) {
    console.error('[QuizCache] Failed to batch cache quizzes:', err);
    return { success: 0, total: quizzes.length };
  }
};

// Remove a specific quiz from localStorage cache
export const removeCachedQuiz = (quizId: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  try {
    const raw = localStorage.getItem(OFFLINE_QUIZZES_STORAGE_KEY);
    if (!raw) return false;
    let records: CachedQuizRecord[] = JSON.parse(raw);
    records = records.filter(r => r.quiz.id !== quizId);
    localStorage.setItem(OFFLINE_QUIZZES_STORAGE_KEY, JSON.stringify(records));

    try {
      const itemsRaw = localStorage.getItem('cyber_academy_offline_items');
      if (itemsRaw) {
        const items = JSON.parse(itemsRaw);
        const updatedItems = items.filter((i: any) => !(i.type === 'quiz' && i.id === quizId));
        localStorage.setItem('cyber_academy_offline_items', JSON.stringify(updatedItems));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cyber-cache-updated', { detail: updatedItems }));
        }
      }
    } catch (_) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(OFFLINE_CACHE_EVENT, { 
        detail: { action: 'remove-single', quizId } 
      }));
    }

    return true;
  } catch (err) {
    console.error('[QuizCache] Failed to remove cached quiz:', err);
    return false;
  }
};

// Clear all cached quizzes from localStorage
export const clearAllCachedQuizzes = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.removeItem(OFFLINE_QUIZZES_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(OFFLINE_CACHE_EVENT, { 
        detail: { action: 'clear-all' } 
      }));
    }
    return true;
  } catch (err) {
    console.error('[QuizCache] Failed to clear quiz cache:', err);
    return false;
  }
};

// Retrieve caching statistics
export const getQuizCacheStats = (): QuizCacheStats => {
  if (!isLocalStorageAvailable()) {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      sizeBytes: 0,
      sizeFormatted: '0 KB',
      lastCachedAt: null
    };
  }

  try {
    const raw = localStorage.getItem(OFFLINE_QUIZZES_STORAGE_KEY);
    if (!raw) {
      return {
        totalQuizzes: 0,
        totalQuestions: 0,
        sizeBytes: 0,
        sizeFormatted: '0 KB',
        lastCachedAt: null
      };
    }

    const records: CachedQuizRecord[] = JSON.parse(raw);
    const totalQuestions = records.reduce((acc, r) => acc + (r.questionCount || 0), 0);
    const sizeBytes = new Blob([raw]).size;
    const sizeFormatted = sizeBytes < 1024 
      ? `${sizeBytes} B` 
      : `${(sizeBytes / 1024).toFixed(1)} KB`;

    let latestTimestamp: string | null = null;
    records.forEach(r => {
      if (!latestTimestamp || new Date(r.cachedAt) > new Date(latestTimestamp)) {
        latestTimestamp = r.cachedAt;
      }
    });

    return {
      totalQuizzes: records.length,
      totalQuestions,
      sizeBytes,
      sizeFormatted,
      lastCachedAt: latestTimestamp
    };
  } catch {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      sizeBytes: 0,
      sizeFormatted: '0 KB',
      lastCachedAt: null
    };
  }
};

// Queue quiz attempt taken while offline
export const queueOfflineQuizAttempt = (attempt: QuizAttempt): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    const raw = localStorage.getItem(OFFLINE_ATTEMPTS_QUEUE_KEY);
    const queue: QuizAttempt[] = raw ? JSON.parse(raw) : [];
    queue.push({
      ...attempt,
      isOfflineAttempt: true
    } as any);
    localStorage.setItem(OFFLINE_ATTEMPTS_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn('[QuizCache] Error queueing offline quiz attempt:', err);
  }
};

// Retrieve queued offline quiz attempts
export const getQueuedOfflineQuizAttempts = (): QuizAttempt[] => {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(OFFLINE_ATTEMPTS_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Clear queued offline quiz attempts after sync
export const clearQueuedOfflineQuizAttempts = (): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(OFFLINE_ATTEMPTS_QUEUE_KEY);
  } catch (_) {}
};
