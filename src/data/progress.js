// KET Learning Progress Tracker
// Manages learning/mastery state via localStorage for the progressive curriculum

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ket_progress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        learnedWords: new Set(parsed.learnedWords || []),
        masteredWords: new Set(parsed.masteredWords || []),
        currentLevel: parsed.currentLevel || 1,
        wordCorrectCounts: parsed.wordCorrectCounts || {}, // { wordId: count }
      };
    }
  } catch (e) {
    console.warn('Failed to load progress:', e);
  }
  return {
    learnedWords: new Set(),
    masteredWords: new Set(),
    currentLevel: 1,
    wordCorrectCounts: {},
  };
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      learnedWords: [...progress.learnedWords],
      masteredWords: [...progress.masteredWords],
      currentLevel: progress.currentLevel,
      wordCorrectCounts: progress.wordCorrectCounts,
    }));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

/**
 * React hook for KET learning progress management.
 * 
 * Returns:
 * - progress: { learnedWords: Set, masteredWords: Set, currentLevel: number }
 * - markLearned(wordId): Mark a word as seen/learned
 * - markCorrect(wordId): Record a correct answer (mastered after 2+ correct)
 * - getLevelProgress(levelWords): Get { learned, mastered, total, percent } for a level
 * - isLevelUnlocked(levelId, levelWordsMap): Check if a level is accessible
 * - resetProgress(): Clear all progress data
 */
export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  // Persist on every change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markLearned = useCallback((wordId) => {
    setProgress(prev => {
      if (prev.learnedWords.has(wordId)) return prev;
      const newLearned = new Set(prev.learnedWords);
      newLearned.add(wordId);
      return { ...prev, learnedWords: newLearned };
    });
  }, []);

  const markCorrect = useCallback((wordId) => {
    setProgress(prev => {
      const newCounts = { ...prev.wordCorrectCounts };
      newCounts[wordId] = (newCounts[wordId] || 0) + 1;

      const newMastered = new Set(prev.masteredWords);
      if (newCounts[wordId] >= 2) {
        newMastered.add(wordId);
      }

      // Also mark as learned
      const newLearned = new Set(prev.learnedWords);
      newLearned.add(wordId);

      return {
        ...prev,
        learnedWords: newLearned,
        masteredWords: newMastered,
        wordCorrectCounts: newCounts,
      };
    });
  }, []);

  // Calculate progress stats for a set of words belonging to a level
  const getLevelProgress = useCallback((levelWords) => {
    if (!levelWords || levelWords.length === 0) {
      return { learned: 0, mastered: 0, total: 0, percent: 0 };
    }
    const total = levelWords.length;
    let learned = 0;
    let mastered = 0;
    for (const w of levelWords) {
      if (progress.learnedWords.has(w.id)) learned++;
      if (progress.masteredWords.has(w.id)) mastered++;
    }
    const percent = Math.round((mastered / total) * 100);
    return { learned, mastered, total, percent };
  }, [progress]);

  // Check if a level is unlocked based on previous level mastery
  const isLevelUnlocked = useCallback((levelId, levels, allWords) => {
    if (levelId <= 1) return true;
    if (levelId <= progress.currentLevel) return true;

    // Check if previous level has >= 70% mastery
    const prevLevel = levels.find(l => l.id === levelId - 1);
    if (!prevLevel) return false;

    const prevLevelWords = allWords.filter(w => w.level === prevLevel.id);
    const { percent } = getLevelProgress(prevLevelWords);
    return percent >= 70;
  }, [progress, getLevelProgress]);

  // Auto-update currentLevel when progress allows
  const updateCurrentLevel = useCallback((levels, allWords) => {
    setProgress(prev => {
      let maxUnlocked = prev.currentLevel;
      for (const level of levels) {
        if (level.id <= maxUnlocked) continue;
        const prevLevelWords = allWords.filter(w => w.level === level.id - 1);
        if (prevLevelWords.length === 0) continue;
        
        let mastered = 0;
        for (const w of prevLevelWords) {
          if (prev.masteredWords.has(w.id)) mastered++;
        }
        const percent = Math.round((mastered / prevLevelWords.length) * 100);
        if (percent >= 70) {
          maxUnlocked = level.id;
        } else {
          break;
        }
      }
      if (maxUnlocked !== prev.currentLevel) {
        return { ...prev, currentLevel: maxUnlocked };
      }
      return prev;
    });
  }, []);

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem('ket_spelling_solved');
    } catch (e) {
      console.warn('Failed to remove spelling progress:', e);
    }
    setProgress({
      learnedWords: new Set(),
      masteredWords: new Set(),
      currentLevel: 1,
      wordCorrectCounts: {},
    });
  }, []);

  return {
    progress,
    markLearned,
    markCorrect,
    getLevelProgress,
    isLevelUnlocked,
    updateCurrentLevel,
    resetProgress,
  };
}
