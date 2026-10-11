import { createElement, useState, useEffect, useMemo } from 'react';
import { CheckCircle2, ChevronLeft, Lock, Volume2 } from 'lucide-react';
import { categories, wordsData } from '../data/words';
import { levels } from '../data/ket-words';
import { speakText, playCorrectSound, playIncorrectSound, playClickSound } from '../utils/audio';
import { getDualPhonetics } from '../utils/phonetic';
import { getIllustrationIcon } from '../utils/wordIcons';
import { getSpeakableWordText } from '../utils/speechText';
import WordIllustration from './WordIllustration';

// Helper to dynamically render Lucide Icons by name
const IconRenderer = ({ name, size = 32, className = '' }) => {
  return createElement(getIllustrationIcon(name), { size, className });
};

export default function WordLearn({
  onMascotMessage,
  setMascotStatus,
  addStars,
  unlockSticker,
  customWords = [],
  speechRate,
  progress,
  markLearned,
  markCorrect,
  getLevelProgress,
  isLevelUnlocked,
  updateCurrentLevel
}) {
  // Navigation views: 'levels' (Level Grid), 'topics' (Topic selection), 'games' (Active Games)
  const [currentView, setCurrentView] = useState('levels');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('animals');
  const [activeMode, setActiveMode] = useState('learn'); // 'learn', 'spelling', 'matching'

  // Merge preloaded words with custom words
  // Map custom words to Level 1, Topic 'animals' by default
  const allWords = useMemo(() => [
    ...wordsData,
    ...customWords.map(w => ({
      ...w,
      level: w.level || 1,
      topic: w.topic || w.category || 'animals',
      category: w.category || w.topic || 'animals'
    }))
  ], [customWords]);

  // Current level topics list
  const levelTopics = selectedLevel ? categories.filter(c => selectedLevel.topics.includes(c.id)) : [];

  // Flashcard list for selected category/topic inside the selected level
  const categoryWords = selectedLevel 
    ? allWords.filter(w => w.level === selectedLevel.id && w.topic === selectedCategory)
    : [];

  // --- Spelling Game State ---
  const [spellIndex, setSpellIndex] = useState(0);
  const [currentWordObj, setCurrentWordObj] = useState(null);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [userLetters, setUserLetters] = useState([]);
  const [spellingSuccess, setSpellingSuccess] = useState(false);

  // --- Matching Game State ---
  const [matchCards, setMatchCards] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  // Auto-trigger level unlock checking on mount
  useEffect(() => {
    updateCurrentLevel(levels, allWords);
  }, [progress.masteredWords, allWords, updateCurrentLevel]);

  useEffect(() => {
    const levelStickerMap = {
      1: 'level_1_master',
      5: 'level_5_master',
      10: 'level_10_master',
      12: 'level_12_master'
    };

    Object.entries(levelStickerMap).forEach(([levelId, stickerId]) => {
      const levelWords = allWords.filter(w => w.level === Number(levelId));
      if (levelWords.length > 0 && levelWords.every(w => progress.masteredWords.has(w.id))) {
        unlockSticker(stickerId);
      }
    });
  }, [allWords, progress.masteredWords, unlockSticker]);

  // Filter spelling words
  const spellingWords = categoryWords.filter(w => w.spellingEnabled === true);
  const spellingDisabled = spellingWords.length === 0;

  const initSpellingWord = (index, spellList) => {
    if (!spellList || spellList.length === 0) return;
    const wordObj = spellList[index % spellList.length];
    setCurrentWordObj(wordObj);
    setUserLetters([]);
    setSpellingSuccess(false);

    // Shuffle letters
    const letters = wordObj.word.split('').map((char, i) => ({ char, key: i }));
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);

    // Pronounce word to prompt the child
    setTimeout(() => {
      speakText(getSpeakableWordText(wordObj), speechRate);
      onMascotMessage(`Can you spell "${wordObj.word}"? 点击字母泡泡拼出单词吧！`);
    }, 500);
  };

  // Initialize Spelling Game
  const startSpellingGame = () => {
    playClickSound();
    if (spellingDisabled) {
      onMascotMessage("🔒 拼写挑战 (仅限 L1-6 简单词)。这个主题太难啦，换一个试试吧！");
      return;
    }
    setActiveMode('spelling');
    
    // Load solved spelling word IDs to check memory
    let solvedIds = [];
    try {
      const stored = localStorage.getItem('ket_spelling_solved');
      if (stored) {
        solvedIds = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse ket_spelling_solved", e);
    }
    
    // Find the first index in spellingWords that is not in solvedIds
    let startIndex = spellingWords.findIndex(w => !solvedIds.includes(w.id));
    if (startIndex === -1) {
      // All words solved: restart from 0
      startIndex = 0;
      onMascotMessage("🎉 你已经拼对了本主题的所有单词！太棒了！重新温习一下吧！");
    }
    
    setSpellIndex(startIndex);
    initSpellingWord(startIndex, spellingWords);
  };

  const handleLetterClick = (letter) => {
    if (spellingSuccess) return;
    playClickSound();

    // Add to user spelling
    const newUserLetters = [...userLetters, letter];
    setUserLetters(newUserLetters);

    // Remove from shuffled pool
    setShuffledLetters(shuffledLetters.filter(l => l.key !== letter.key));

    // Check spelling status
    const currentSpelled = newUserLetters.map(l => l.char).join('');
    const targetWord = currentWordObj.word;

    if (currentSpelled.length === targetWord.length) {
      if (currentSpelled === targetWord) {
        // Correct spelling!
        setSpellingSuccess(true);
        setMascotStatus('correct');
        playCorrectSound();
        addStars(10);
        markCorrect(currentWordObj.id);
        updateCurrentLevel(levels, allWords);
        onMascotMessage(`Perfect! "${currentWordObj.word}" means "${currentWordObj.translation}"! +10 颗小星星 ⭐`);
        speakText(getSpeakableWordText(currentWordObj), speechRate);

        // Persist spelling game solved word ID
        try {
          const stored = localStorage.getItem('ket_spelling_solved');
          let solvedIds = stored ? JSON.parse(stored) : [];
          if (!solvedIds.includes(currentWordObj.id)) {
            solvedIds.push(currentWordObj.id);
            localStorage.setItem('ket_spelling_solved', JSON.stringify(solvedIds));
          }
        } catch (e) {
          console.error("Failed to save solved spelling word ID", e);
        }

        // Check achievements
        if (spellIndex === 4) {
          unlockSticker('spelling_star');
        }
      } else {
        // Incorrect spelling
        playIncorrectSound();
        setMascotStatus('wrong');
        onMascotMessage(`Oops! Let's try spelling it again! 不要灰心，重新写写看！`);
        // Reset after short delay
        setTimeout(() => {
          const letters = currentWordObj.word.split('').map((char, index) => ({ char, key: index }));
          setShuffledLetters([...letters].sort(() => Math.random() - 0.5));
          setUserLetters([]);
          setMascotStatus('idle');
        }, 1200);
      }
    }
  };

  const handleSpellingReset = () => {
    playClickSound();
    if (currentWordObj) {
      const letters = currentWordObj.word.split('').map((char, index) => ({ char, key: index }));
      setShuffledLetters([...letters].sort(() => Math.random() - 0.5));
      setUserLetters([]);
      setSpellingSuccess(false);
      setMascotStatus('idle');
    }
  };

  const handleNextSpellingWord = () => {
    playClickSound();
    const nextIndex = spellIndex + 1;
    setSpellIndex(nextIndex);
    setMascotStatus('idle');
    initSpellingWord(nextIndex, spellingWords);
  };

  // Initialize Matching Game
  const startMatchingGame = () => {
    playClickSound();
    setActiveMode('matching');
    setMatchedPairs([]);
    setSelectedMatchId(null);
    onMascotMessage("Let's play Matching Game! 连线配对，找到对应的单词和图片吧！");

    // Select 4 random words from category (or all if less than 4)
    const shuffledWords = [...categoryWords].sort(() => Math.random() - 0.5).slice(0, 4);

    // Create card structures
    const wordCards = shuffledWords.map(w => ({
      id: `w_${w.id}`,
      refId: w.id,
      text: w.word,
      type: 'english'
    }));

    const imageCards = shuffledWords.map(w => ({
      id: `i_${w.id}`,
      refId: w.id,
      wordObj: w,
      type: 'image'
    }));

    // Shuffle cards grid
    setMatchCards([...wordCards, ...imageCards].sort(() => Math.random() - 0.5));
  };

  const handleMatchSelect = (card) => {
    playClickSound();
    if (matchedPairs.includes(card.refId)) return; // Already matched

    if (!selectedMatchId) {
      // First card selection
      setSelectedMatchId(card);
      // Speak on selection
      if (card.type === 'english') {
          speakText(getSpeakableWordText(card.text), speechRate);
      } else if (card.type === 'image') {
        const matchedWord = allWords.find(w => w.id === card.refId);
        if (matchedWord) {
          speakText(matchedWord.translation, speechRate, null, 'zh-CN');
        }
      }
    } else {
      // Second card selection
      const prevCard = selectedMatchId;

      if (prevCard.id === card.id) {
        // Clicked the same card, deselect
        setSelectedMatchId(null);
        return;
      }

      if (prevCard.refId === card.refId && prevCard.type !== card.type) {
        // Match Success!
        const newMatched = [...matchedPairs, card.refId];
        setMatchedPairs(newMatched);
        setSelectedMatchId(null);
        playCorrectSound();
        addStars(5);
        markCorrect(card.refId);
        updateCurrentLevel(levels, allWords);

        const matchedWord = allWords.find(w => w.id === card.refId);
        if (matchedWord) {
          // Speak English word first, then Chinese translation after a short delay
          speakText(getSpeakableWordText(matchedWord), speechRate, () => {
            setTimeout(() => speakText(matchedWord.translation, speechRate, null, 'zh-CN'), 200);
          });
        }

        if (newMatched.length === matchCards.length / 2) {
          // All matched!
          setMascotStatus('correct');
          onMascotMessage("Awesome! You matched all the cards! +20 星星 ⭐");
          addStars(20);
          unlockSticker('word_master');
        }
      } else {
        // Match Failure!
        playIncorrectSound();
        setSelectedMatchId(null);
        onMascotMessage("Oops! Not a match! 没找对，再看看其他卡片吧！");
      }
    }
  };

  const speakWord = (wordObj) => {
    speakText(getSpeakableWordText(wordObj), speechRate);
    markLearned(wordObj.id);
    updateCurrentLevel(levels, allWords);
    setMascotStatus('idle');
    unlockSticker('first_step');
  };

  const handleLevelClick = (level) => {
    const unlocked = isLevelUnlocked(level.id, levels, allWords);
    if (unlocked) {
      playClickSound();
      setSelectedLevel(level);
      setCurrentView('topics');
      onMascotMessage(`Welcome to Level ${level.id} ${level.emoji}! 开始选择主题学习吧！`);
    } else {
      playIncorrectSound();
      onMascotMessage(`🔒 这是一个被锁定的关卡哦！把前一关掌握度提升到 70% 就能解锁啦！`);
    }
  };

  const handleTopicClick = (topicId) => {
    playClickSound();
    setSelectedCategory(topicId);
    setCurrentView('games');
    setActiveMode('learn');
    onMascotMessage(`Let's learn words! 让我们开始学习这个主题吧！`);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-3">
      {/* 1. LEVEL SELECTION VIEW */}
      {currentView === 'levels' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          <div className="text-center my-1">
            <h2 className="text-xl font-bold text-main" style={{ fontFamily: 'var(--font-heading)' }}>
              🎯 KET 词汇关卡挑战
            </h2>
            <p className="text-xs text-muted mt-0.5">每个关卡掌握度达到 70% 即可解锁下一关，加油哦！</p>
          </div>
          <div className="level-grid overflow-y-auto flex-1 min-h-0 pr-1">
            {levels.map((level) => {
              const unlocked = isLevelUnlocked(level.id, levels, allWords);
              const levelWordsList = allWords.filter(w => w.level === level.id);
              const { learned, mastered, total, percent } = getLevelProgress(levelWordsList);

              return (
                <div
                  key={level.id}
                  onClick={() => handleLevelClick(level)}
                  data-testid={`level-card-${level.id}`}
                  aria-label={`Level ${level.id} ${level.name}`}
                  className={`level-card ${unlocked ? '' : 'locked'}`}
                >
                  {!unlocked && (
                    <div className="level-lock-overlay">
                      <div className="level-lock-icon-wrap">
                        <Lock size={20} />
                      </div>
                      <span className="text-xs font-bold font-heading">需前一关掌握度 ≥70%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-3xl">{level.emoji}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
                      Level {level.id}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-main font-heading mb-1">
                      {level.name}
                    </h3>
                    <p className="text-xs text-muted mb-2 line-clamp-2">
                      {level.description}
                    </p>
                    <div className="text-xs font-bold text-primary">
                      学习周期：{level.targetWeeks}
                    </div>
                  </div>
                  <div className="mt-4 border-t pt-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <div className="flex justify-between text-xs text-muted font-bold mb-1">
                      <span>进度 (Progress): {percent}%</span>
                      <span>掌握: {mastered}/{total}</span>
                    </div>
                    <div className="level-progress-bar-container">
                      <div
                        className="level-progress-bar-fill"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: percent >= 70 ? '#10b981' : 'var(--primary)'
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-muted text-right mt-1 font-semibold">
                      已学 (Learned): {learned}/{total} 词
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TOPIC SELECTION VIEW */}
      {currentView === 'topics' && selectedLevel && (
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-4 border-b pb-2" style={{ borderColor: 'var(--primary-border)' }}>
            <button
              onClick={() => { playClickSound(); setCurrentView('levels'); }}
              className="speak-btn flex items-center justify-center"
              style={{ width: '32px', height: '32px' }}
              title="返回关卡"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-main flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <span>{selectedLevel.emoji} Level {selectedLevel.id}: {selectedLevel.name}</span>
              </h2>
              <p className="text-xs text-muted">选择一个主题开始快乐英语学习吧！</p>
            </div>
          </div>

          <div className="topic-grid overflow-y-auto flex-1 min-h-0 pr-1">
            {levelTopics.map((cat) => {
              const topicWords = allWords.filter(w => w.level === selectedLevel.id && w.topic === cat.id);
              const totalCount = topicWords.length;
              const masteredCount = topicWords.filter(w => progress.masteredWords.has(w.id)).length;
              const learnedCount = topicWords.filter(w => progress.learnedWords.has(w.id)).length;
              const percent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleTopicClick(cat.id)}
                  data-testid={`topic-card-${cat.id}`}
                  aria-label={`主题 ${cat.name}`}
                  className="topic-card"
                  style={{ borderTopColor: cat.color }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div 
                      className="p-2.5 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconRenderer name={cat.icon} size={20} />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}>
                      {totalCount} 词
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-main font-heading mb-2">
                      {cat.name}
                    </h3>
                    <div className="flex justify-between text-[11px] text-muted font-bold mb-1">
                      <span>掌握: {masteredCount}/{totalCount}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="level-progress-bar-container" style={{ height: '8px', marginTop: '4px' }}>
                      <div
                        className="level-progress-bar-fill"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-muted text-right mt-1 font-semibold">
                      已学习: {learnedCount} 词
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. GAMES & LEARNING VIEW */}
      {currentView === 'games' && selectedLevel && (
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--primary-border)' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { playClickSound(); setCurrentView('topics'); }}
                className="speak-btn flex items-center justify-center"
                style={{ width: '32px', height: '32px' }}
                title="返回主题"
              >
                <ChevronLeft size={18} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-main flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span>{categories.find(c => c.id === selectedCategory)?.name || selectedCategory}</span>
                </h2>
                <p className="text-xs text-muted">当前主题进度 — 掌握: {categoryWords.filter(w => progress.masteredWords.has(w.id)).length}/{categoryWords.length}</p>
              </div>
            </div>
          </div>

          {/* Mode Switches */}
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => { playClickSound(); setActiveMode('learn'); }}
              className={`btn-bubble ${activeMode === 'learn' ? '' : 'secondary'}`}
              style={{ padding: '8px 16px', fontSize: '0.9rem', transform: 'none', boxShadow: 'none' }}
            >
              📖 认读单词卡
            </button>
            <button
              onClick={startSpellingGame}
              disabled={spellingDisabled}
              className={`btn-bubble ${activeMode === 'spelling' ? '' : 'secondary'} ${spellingDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.9rem', transform: 'none', boxShadow: 'none' }}
            >
              {spellingDisabled ? '🔒 拼写挑战 (仅限 L1-6 简单词)' : '🎈 字母拼写游戏'}
            </button>
            <button
              onClick={startMatchingGame}
              className={`btn-bubble ${activeMode === 'matching' ? '' : 'secondary'}`}
              style={{ padding: '8px 16px', fontSize: '0.9rem', transform: 'none', boxShadow: 'none' }}
            >
              🧩 卡片配对游戏
            </button>
          </div>

          {/* Active Mode Screen */}
          {activeMode === 'learn' && (
            <div className="grid-responsive overflow-y-auto flex-1 min-h-0 pr-1">
              {categoryWords.map((wordObj) => {
                const isMastered = progress.masteredWords.has(wordObj.id);
                const isLearned = progress.learnedWords.has(wordObj.id);

                return (
                  <div
                    key={wordObj.id}
                    onClick={() => speakWord(wordObj)}
                    data-testid={`word-card-${wordObj.id}`}
                    aria-label={`单词卡 ${wordObj.word}`}
                    className="glass-card text-center cursor-pointer relative group flex flex-col items-center justify-between p-6 word-card-accent-border word-card"
                    style={{
                      borderColor: categories.find(c => c.id === selectedCategory)?.color || 'var(--primary)'
                    }}
                  >
                    {/* Category Color Tag */}
                    <div
                      className="absolute top-0 left-0 right-0"
                      style={{ backgroundColor: categories.find(c => c.id === selectedCategory)?.color, height: '8px' }}
                    />
                    
                    {/* Word status badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {isMastered ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm flex items-center gap-0.5">
                          ⭐ 已掌握
                        </span>
                      ) : isLearned ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm flex items-center gap-0.5">
                          ✓ 已学过
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm flex items-center gap-0.5">
                          🌱 新单词
                        </span>
                      )}
                    </div>

                    <div className="mt-6 group-hover:scale-110 transition-transform duration-300">
                      <WordIllustration word={wordObj} />
                    </div>

                    <div>
                      <h2 className="text-3xl font-extrabold text-primary transition-colors flex items-center justify-center gap-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
                        <span>{wordObj.word}</span>
                      </h2>
                      {(() => {
                        const phonetics = getDualPhonetics(wordObj);
                        if (!phonetics.uk && !phonetics.us) return null;
                        return (
                          <div className="flex justify-center gap-3 text-xs font-semibold text-muted my-1.5 flex-wrap">
                            {phonetics.uk && <span className="flex items-center gap-0.5" title="英式发音">🇬🇧 UK: {phonetics.uk}</span>}
                            {phonetics.us && <span className="flex items-center gap-0.5" title="美式发音">🇺🇸 US: {phonetics.us}</span>}
                          </div>
                        );
                      })()}
                      <p className="text-xl font-bold text-main flex items-center justify-center gap-1.5">
                        <span>{wordObj.translation}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClickSound();
                            speakText(wordObj.translation, speechRate, null, 'zh-CN');
                          }}
                          className="speak-btn"
                          title="听中文意"
                        >
                          <Volume2 size={12} />
                        </button>
                      </p>
                      {wordObj.scene && (
                        <div className="mt-2 flex flex-col items-center gap-1">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/80 border" style={{ color: categories.find(c => c.id === selectedCategory)?.color || 'var(--primary)', borderColor: 'rgba(0, 0, 0, 0.08)' }}>
                            {wordObj.scene}
                          </span>
                          {wordObj.scenePrompt && (
                            <p className="text-[11px] font-semibold text-muted leading-snug max-w-[220px]">
                              {wordObj.scenePrompt}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted border-t pt-2 w-full flex flex-col items-center justify-center gap-1.5" style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="italic">"{wordObj.sentence}"</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClickSound();
                            speakText(wordObj.sentence, speechRate);
                          }}
                          className="speak-btn"
                          style={{ width: '22px', height: '22px' }}
                          title="听英文场景句"
                        >
                          <Volume2 size={10} />
                        </button>
                      </div>
                      {wordObj.sentenceTranslation && (
                        <span className="text-[11px] leading-snug text-main/70">
                          {wordObj.sentenceTranslation}
                        </span>
                      )}
                    </div>

                    {/* Sound icon floating */}
                    <div className="absolute p-2 rounded-full text-primary" style={{ right: '12px', top: '12px', backgroundColor: 'var(--primary-bg)', opacity: 0.6 }}>
                      <Volume2 size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Spelling Game Mode */}
          {activeMode === 'spelling' && currentWordObj && (
            <div className="glass-card rounded-3xl p-4 flex flex-col items-center gap-3 max-w-xl mx-auto w-full text-center overflow-y-auto max-h-full min-h-0">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
                  拼写闯关 第 {spellIndex + 1} 关
                </span>
                <h2 className="text-xl font-bold mt-1 text-main font-heading">
                  请拼出下面的单词：
                </h2>
                <p className="text-lg font-extrabold text-primary my-1 flex items-center justify-center gap-1.5">
                  <span>「 {currentWordObj.translation} 」</span>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      speakText(currentWordObj.translation, speechRate, null, 'zh-CN');
                    }}
                    className="speak-btn"
                    style={{ width: '24px', height: '24px' }}
                    title="听中文意"
                  >
                    <Volume2 size={12} />
                  </button>
                </p>
                {(() => {
                  const phonetics = getDualPhonetics(currentWordObj);
                  if (!phonetics.uk && !phonetics.us) return null;
                  return (
                    <div className="flex justify-center gap-2 text-xs font-semibold text-muted my-0.5 flex-wrap">
                      {phonetics.uk && <span>🇬🇧 UK: {phonetics.uk}</span>}
                      {phonetics.us && <span>🇺🇸 US: {phonetics.us}</span>}
                    </div>
                  );
                })()}
              </div>

              {/* Target Word Slots */}
              <div className="flex gap-2 justify-center items-center my-2 flex-wrap" style={{ minHeight: '50px' }}>
                {currentWordObj.word.split('').map((char, index) => {
                  const letter = userLetters[index];
                  return (
                    <div
                      key={index}
                      className={`spelling-box-slot ${letter ? 'active' : ''}`}
                      style={{ fontFamily: 'var(--font-heading)', width: '44px', height: '44px', borderRadius: '12px', fontSize: '1.25rem' }}
                    >
                      {letter ? letter.char : ''}
                    </div>
                  );
                })}
              </div>

              {/* Letter Bubbles Pool */}
              <div className="flex gap-2 justify-center flex-wrap my-2">
                {shuffledLetters.map((letter) => (
                  <button
                    key={letter.key}
                    onClick={() => handleLetterClick(letter)}
                    aria-label={`选择字母 ${letter.char}`}
                    data-testid={`letter-${letter.char}-${letter.key}`}
                    className="letter-bubble-btn animate-bounce"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      animationDelay: `${letter.key * 0.05}s`,
                      animationDuration: '2s',
                      width: '44px',
                      height: '44px',
                      fontSize: '1.25rem'
                    }}
                  >
                    {letter.char}
                  </button>
                ))}
              </div>

              {/* Interaction panel */}
              <div className="flex justify-center gap-2 w-full flex-wrap">
                <button
                  type="button"
                  onClick={handleSpellingReset}
                  className="btn-bubble secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', transform: 'none', boxShadow: 'none' }}
                >
                  🔄 重新填入
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    speakText(getSpeakableWordText(currentWordObj), speechRate);
                  }}
                  className="btn-bubble"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', transform: 'none', boxShadow: 'none' }}
                >
                  🔊 听英文
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    speakText(currentWordObj.translation, speechRate, null, 'zh-CN');
                  }}
                  className="btn-bubble secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', transform: 'none', boxShadow: 'none' }}
                >
                  🔊 听中文
                </button>

                {spellingSuccess && (
                  <button
                    type="button"
                    onClick={handleNextSpellingWord}
                    className="btn-bubble accent"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', transform: 'none', boxShadow: 'none' }}
                  >
                    下一关 ➔
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Matching Game Mode */}
          {activeMode === 'matching' && (
            <div className="glass-card rounded-3xl p-4 max-w-2xl mx-auto w-full text-center overflow-y-auto max-h-full min-h-0">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-main font-heading">卡片配对连连看</h2>
                <p className="text-xs text-muted mt-0.5">点击一张英文卡片 and 一张图片，把它们配对吧！</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2">
                {matchCards.map((card) => {
                  const isSelected = selectedMatchId?.id === card.id;
                  const isMatched = matchedPairs.includes(card.refId);

                  return (
                    <button
                      key={card.id}
                      disabled={isMatched}
                      onClick={() => handleMatchSelect(card)}
                      aria-label={card.type === 'english' ? `英文卡片 ${card.text}` : `图片卡片 ${card.wordObj.word}`}
                      data-testid={card.type === 'english' ? `match-word-${card.refId}` : `match-image-${card.refId}`}
                      className={`match-card-btn ${isMatched ? 'matched' : isSelected ? 'selected' : ''}`}
                      style={{ fontFamily: 'var(--font-heading)', minHeight: '80px', padding: '8px' }}
                    >
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        {card.type === 'english' ? (
                          <span className="text-sm font-bold">{card.text}</span>
                        ) : (
                          <span 
                            className="flex items-center justify-center"
                          >
                            <WordIllustration word={card.wordObj} size="small" />
                          </span>
                        )}
                        {isMatched && <CheckCircle2 size={12} style={{ color: '#10b981', marginTop: '2px' }} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {matchedPairs.length === matchCards.length / 2 && (
                <div className="flex flex-col items-center gap-2 mt-2">
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 animate-pulse-slow">
                    🎉 太棒啦！配对成功！ 🎉
                  </p>
                  <button 
                    onClick={startMatchingGame} 
                    className="btn-bubble accent"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', transform: 'none', boxShadow: 'none' }}
                  >
                    🔄 再玩一次
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
