import { useState } from 'react';
import { Shield, BookOpen, CheckCircle, BarChart2, Plus, Volume2, Trash2, KeyRound, ChevronRight } from 'lucide-react';
import { speakText, playClickSound, playCorrectSound, playIncorrectSound } from '../utils/audio';
import { levels } from '../data/ket-words/levels';
import { allKetWords } from '../data/ket-words';
import { STICKER_COUNT } from '../data/stickers';

export default function ParentDashboard({ 
  mistakes = [], 
  setMistakes, 
  starsCount = 0, 
  unlockedStickers = [], 
  customWords = [], 
  setCustomWords,
  speechRate,
  setSpeechRate,
  onMascotMessage,
  setMascotStatus,
  addStars,
  unlockSticker,
  progress,
  getLevelProgress,
  resetProgress
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Active sub-sections: 'stats', 'mistakes', 'settings'
  const [subTab, setSubTab] = useState('mistakes');
  
  // Selected mistake for explanation modal/card
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [retryAnswer, setRetryAnswer] = useState(null);
  const [retrySuccess, setRetrySuccess] = useState(false);

  // Form states for adding custom words
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newSentence, setNewSentence] = useState('');
  const [newSentenceTrans, setNewSentenceTrans] = useState('');

  // Handle Passcode Unlock (Child lock is "1234" or simple math)
  const handleUnlock = (e) => {
    e.preventDefault();
    playClickSound();
    if (passcode === '1234' || parseInt(passcode) === 12) { // Allow either passcode 1234 or simple math (3 x 4 = 12)
      setIsUnlocked(true);
      setPasscodeError(false);
      onMascotMessage("Parent Mode unlocked! 欢迎家长！今天想辅导哪些错题呢？");
      setMascotStatus('idle');
    } else {
      setPasscodeError(true);
      setPasscode('');
      playIncorrectSound();
    }
  };

  const lockDashboard = () => {
    playClickSound();
    setIsUnlocked(false);
    setPasscode('');
    setSelectedMistake(null);
  };

  // Try again retry handler
  const handleRetrySelect = (optionChar) => {
    if (retrySuccess) return;
    playClickSound();
    setRetryAnswer(optionChar);
  };

  const handleVerifyRetry = () => {
    if (!retryAnswer || !selectedMistake) return;
    
    const isCorrect = retryAnswer === selectedMistake.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
      setMascotStatus('correct');
      setRetrySuccess(true);
      addStars(10);
      onMascotMessage(`Wow! You corrected your mistake! 太棒了，错题被消灭啦！⭐ +10 星星`);
      
      // Delete mistake from notebook after short delay
      setTimeout(() => {
        const updated = mistakes.filter(m => m.questionId !== selectedMistake.questionId);
        setMistakes(updated);
        setSelectedMistake(null);
        setRetryAnswer(null);
        setRetrySuccess(false);
        setMascotStatus('idle');
        
        // Trigger mistake conqueror achievement
        unlockSticker('mistake_conqueror');
      }, 1500);
    } else {
      playIncorrectSound();
      setMascotStatus('wrong');
      onMascotMessage("Almost! Let's review the tutoring tips again! 别急，再听爸爸妈妈讲一遍。");
      
      setTimeout(() => {
        setRetryAnswer(null);
        setMascotStatus('idle');
      }, 1500);
    }
  };

  // Custom Word Creation
  const handleAddWord = (e) => {
    e.preventDefault();
    playClickSound();
    
    if (!newWord || !newTranslation) return;

    const customItem = {
      id: `custom_${Date.now()}`,
      word: newWord.toLowerCase().trim(),
      phonetic: newPhonetic || '/.../',
      translation: newTranslation.trim(),
      category: 'animals', // Put in first category for simplicity
      icon: 'Sparkles',
      sentence: newSentence.trim() || 'This is a new word.',
      sentenceTranslation: newSentenceTrans.trim() || '这是一个新单词。'
    };

    setCustomWords([...customWords, customItem]);
    
    // Reset form
    setNewWord('');
    setNewTranslation('');
    setNewPhonetic('');
    setNewSentence('');
    setNewSentenceTrans('');

    onMascotMessage(`Word "${customItem.word}" added to flashcards! 单词添加成功！`);
    playCorrectSound();
  };

  const handleDeleteCustomWord = (id) => {
    playClickSound();
    setCustomWords(customWords.filter(w => w.id !== id));
  };

  // Locked child-proof view
  if (!isUnlocked) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="parent-lock-card">
          <div className="parent-lock-icon-wrap animate-pulse-slow">
            <Shield size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-main" style={{ fontFamily: 'var(--font-heading)' }}>
              家长防沉迷验证
            </h2>
            <p className="text-xs text-muted mt-2">
              此区域为家长辅导专区，包含错题解析与系统设置。请输入密码 <strong>1234</strong> 或回答下方的算术题进行解锁：
            </p>
          </div>

          <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
            <div className="parent-lock-math-challenge">
              ❓ 3 x 4 = ?
            </div>
            
            <input
              type="number"
              placeholder="请输入答案或密码..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="parent-passcode-field"
            />

            {passcodeError && (
              <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>❌ 验证答案错误，请重试！</p>
            )}

            <button type="submit" className="btn-bubble w-full flex justify-center items-center gap-2">
              <KeyRound size={18} /> 验证并解锁
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-3 w-full">
      {/* Header Parent controls */}
      <div className="glass-card rounded-3xl p-3 flex flex-wrap justify-between items-center gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👩‍🏫</span>
          <div>
            <h2 className="text-xl font-bold text-main">家长辅导控制台</h2>
            <p className="text-xs text-muted">规划学习周期，查看宝宝错题本进行辅导。</p>
          </div>
        </div>

        <div className="parent-dashboard-subtab-bar">
          <button 
            onClick={() => { playClickSound(); setSubTab('stats'); setSelectedMistake(null); }}
            className={`parent-subtab-btn ${subTab === 'stats' ? 'active' : 'inactive'}`}
          >
            📊 学习进度
          </button>
          <button 
            onClick={() => { playClickSound(); setSubTab('mistakes'); setSelectedMistake(null); }}
            className={`parent-subtab-btn ${subTab === 'mistakes' ? 'active' : 'inactive'}`}
          >
            📝 错题笔记本 ({mistakes.length})
          </button>
          <button 
            onClick={() => { playClickSound(); setSubTab('settings'); setSelectedMistake(null); }}
            className={`parent-subtab-btn ${subTab === 'settings' ? 'active' : 'inactive'}`}
          >
            ⚙️ 单词扩展与设置
          </button>
          <button onClick={lockDashboard} className="btn-bubble danger py-2 px-4 text-xs shadow-none translate-y-0">
            🔒 锁定控制台
          </button>
        </div>
      </div>

      {/* Stats Sub Tab */}
      {subTab === 'stats' && (
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
          <div className="parent-stats-grid">
            <div className="parent-stat-card">
              <BarChart2 size={36} className="mx-auto mb-2" style={{ color: 'var(--primary)' }} />
              <h3 className="parent-stat-number" style={{ color: 'var(--primary)' }}>{starsCount}</h3>
              <p className="text-sm font-bold text-muted mt-2">星星总数 Stars</p>
              <p className="text-xs text-muted mt-2">每次答对或拼写成功获得奖励。</p>
            </div>

            <div className="parent-stat-card">
              <CheckCircle size={36} className="mx-auto mb-2" style={{ color: 'var(--secondary)' }} />
              <h3 className="parent-stat-number" style={{ color: 'var(--secondary)' }}>{unlockedStickers.length} / {STICKER_COUNT}</h3>
              <p className="text-sm font-bold text-muted mt-2">贴纸解锁 Stickers</p>
              <p className="text-xs text-muted mt-2">解锁贴纸来装扮魔法画布。</p>
            </div>

            <div className="parent-stat-card">
              <BookOpen size={36} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
              <h3 className="parent-stat-number" style={{ color: 'var(--accent)' }}>{mistakes.length}</h3>
              <p className="text-sm font-bold text-muted mt-2">错题积累 Mistakes</p>
              <p className="text-xs text-muted mt-2">错题会在讲明白重新做对后消失。</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-main">12个学习等级进度详情 (KET Curriculum Progression)</h3>
              <button
                onClick={() => {
                  if (window.confirm("确定要重置所有学习进度吗？这会清除所有已学单词和掌握状态！")) {
                    playClickSound();
                    resetProgress();
                  }
                }}
                className="btn-bubble danger py-1.5 px-3 text-xs"
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                🔄 重置所有进度
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {levels.map((lvl) => {
                const lvlWords = allKetWords.filter(w => w.level === lvl.id);
                const { learned, mastered, total, percent } = getLevelProgress(lvlWords);
                const isUnlocked = lvl.id === 1 || progress.currentLevel >= lvl.id;
                
                return (
                  <div 
                    key={lvl.id}
                    className="p-4 rounded-2xl flex flex-col gap-3"
                    style={{ 
                      backgroundColor: 'var(--bg-card)', 
                      border: '1.5px solid var(--border-card)',
                      opacity: isUnlocked ? 1 : 0.6
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lvl.emoji}</span>
                        <div>
                          <h4 className="font-extrabold text-sm text-main">
                            L{lvl.id} - {lvl.name}
                          </h4>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {lvl.targetWeeks}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {isUnlocked ? (
                          <span 
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: percent >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: percent >= 70 ? 'var(--secondary)' : 'var(--primary)'
                            }}
                          >
                            掌握率 {percent}%
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-muted">
                            🔒 未解锁
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted leading-relaxed">
                      {lvl.description}
                    </p>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-muted">
                        <span>已学: {learned}/{total} 词</span>
                        <span>已掌握: {mastered}/{total} 词</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, Math.max(percent, learned > 0 ? 5 : 0))}%`,
                            backgroundColor: percent >= 70 ? 'var(--secondary)' : 'var(--primary)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mistakes notebook Sub Tab */}
      {subTab === 'mistakes' && (
        <div className="parent-layout-split">
          {/* Left Mistakes List */}
          <div className="glass-card rounded-3xl p-4 parent-sidebar-panel flex flex-col gap-3 min-h-0">
            <h3 className="text-lg font-bold text-main">错题清单</h3>
            
            {mistakes.length === 0 ? (
              <div className="text-center p-4 text-muted text-sm">
                🎉 宝宝目前没有错题记录！非常棒！
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
                {mistakes.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      setSelectedMistake(m);
                      setRetryAnswer(null);
                      setRetrySuccess(false);
                      onMascotMessage(`让我们一起来消灭这道题吧！`);
                    }}
                    className={`mistake-list-btn ${selectedMistake?.questionId === m.questionId ? 'active' : ''}`}
                  >
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, paddingRight: '8px' }}>
                      <span style={{ fontSize: '10px', backgroundColor: 'var(--primary-bg)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', marginRight: '6px' }}>
                        {m.type === 'listening' ? '听力' : m.type === 'sign' ? '标识' : '阅读'}
                      </span>
                      {m.questionText || m.gapSentence}
                    </div>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Tutoring & Retake Section */}
          <div className="parent-main-panel">
            {selectedMistake ? (
              <div className="glass-card rounded-3xl p-5 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
                {/* Tutor Card Header */}
                <div className="border-b pb-3 shrink-0">
                  <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', padding: '2px 8px', borderRadius: '99px' }}>
                    来源：{selectedMistake.quizTitle}
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-main">
                    错题讲解与重新测试
                  </h3>
                </div>

                {/* Scrollable tutoring contents */}
                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1 py-1">
                  {/* Question Info */}
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '16px', fontSize: '14px', border: '1px solid var(--border-card)' }}>
                  <div className="font-bold text-main mb-2 flex items-center justify-between">
                    <span>题目：</span>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        const textToRead = selectedMistake.questionText || selectedMistake.gapSentence;
                        speakText(textToRead, speechRate);
                      }}
                      className="speak-btn"
                      title="听题目"
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <p className="text-main font-medium">
                    {selectedMistake.questionText || selectedMistake.gapSentence}
                  </p>
                  
                  {selectedMistake.signContent && (
                    <div className="flex items-center gap-2" style={{ margin: '8px 0' }}>
                      <div style={{ padding: '12px', backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-dark)', maxWidth: '320px', flex: 1 }}>
                        {selectedMistake.signContent}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          speakText(selectedMistake.signContent, speechRate);
                        }}
                        className="speak-btn"
                        title="听告示牌内容"
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                  )}

                  {selectedMistake.audioText && (
                    <div className="my-2 flex items-center gap-2 text-xs font-bold text-muted">
                      <button 
                        onClick={() => speakText(selectedMistake.audioText, speechRate)}
                        style={{ border: '1.5px solid var(--primary-border)', backgroundColor: 'var(--bg-card)', color: 'var(--primary)', padding: '4px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Volume2 size={14} />
                      </button>
                      <span>听力原文: "{selectedMistake.audioText}"</span>
                    </div>
                  )}

                  <div className="mt-4 pt-2 border-t text-xs flex gap-4">
                    <span style={{ color: 'var(--accent)' }}>宝宝选了: <strong>{selectedMistake.userAnswer}</strong></span>
                    <span style={{ color: 'var(--secondary)' }}>正确答案: <strong>{selectedMistake.correctAnswer}</strong></span>
                  </div>
                </div>

                {/* Tutor Guidelines */}
                <div className="mistake-explanation-container">
                  <div>
                    <h4 className="text-sm font-extrabold text-main flex items-center gap-1.5">
                      <span>🔍 题目翻译:</span>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          speakText(selectedMistake.explanation.questionTranslation, speechRate);
                        }}
                        className="speak-btn"
                        style={{ width: '22px', height: '22px' }}
                        title="听翻译"
                      >
                        <Volume2 size={10} />
                      </button>
                    </h4>
                    <p className="text-xs text-muted mt-2 italic">
                      “ {selectedMistake.explanation.questionTranslation} ”
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-main">📚 重点词汇讲解:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedMistake.explanation.vocab.map((v, idx) => (
                        <button
                          key={idx}
                          onClick={() => { playClickSound(); speakText(v.word, speechRate); }}
                          className="flex items-center gap-1"
                          style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)', border: '1px solid var(--primary-border)', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          <Volume2 size={12} />
                          <span>{v.word} ({v.translation})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-main">💡 核心语法:</h4>
                    <p className="text-xs text-muted mt-2" style={{ lineHeight: '1.6' }}>
                      {selectedMistake.explanation.grammar}
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'var(--accent-light)', padding: '12px', borderRadius: '12px', border: '1px solid var(--accent)' }}>
                    <h4 className="text-xs font-extrabold" style={{ color: 'var(--accent-dark)' }}>👩‍👦 家长辅导指引:</h4>
                    <p className="text-xs mt-2" style={{ color: 'var(--accent-dark)', lineHeight: '1.6' }}>
                      {selectedMistake.explanation.parentTip}
                    </p>
                  </div>
                </div>
                </div>

                {/* Retake question box */}
                <div className="border-t pt-3 text-center shrink-0">
                  <h4 className="text-sm font-bold text-main mb-4">
                    💬 让宝宝再尝试一次吧：
                  </h4>
                  
                  <div className="flex flex-col gap-2 max-w-sm mx-auto">
                    {selectedMistake.options.map((option, idx) => {
                      const optionChar = option.charAt(0);
                      const isSelected = retryAnswer === optionChar;
                      
                      let style = {
                        border: '2px solid var(--border-card)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        textAlign: 'left',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        width: '100%'
                      };
                      
                      if (retrySuccess && optionChar === selectedMistake.correctAnswer) {
                        style.borderColor = 'var(--secondary)';
                        style.backgroundColor = 'var(--primary-bg)';
                        style.color = 'var(--secondary)';
                      } else if (isSelected) {
                        style.borderColor = 'var(--primary)';
                        style.backgroundColor = 'var(--primary-bg)';
                        style.color = 'var(--primary)';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={retrySuccess}
                          onClick={() => handleRetrySelect(optionChar)}
                          style={style}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                speakText(option, speechRate);
                              }}
                              className="speak-btn"
                              style={{ width: '24px', height: '24px', flexShrink: 0 }}
                              title="听选项"
                            >
                              <Volume2 size={12} />
                            </button>
                            <span className="text-left">{option}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {!retrySuccess && (
                    <button
                      disabled={!retryAnswer}
                      onClick={handleVerifyRetry}
                      className="btn-bubble text-xs py-2 px-6 mt-4"
                      style={{ opacity: !retryAnswer ? 0.5 : 1, cursor: !retryAnswer ? 'not-allowed' : 'pointer' }}
                    >
                      重新提交验证
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-8 text-center text-muted" style={{ border: '4px dashed var(--border-card)' }}>
                <BookOpen size={48} className="mx-auto mb-4 animate-pulse-slow" style={{ color: 'var(--primary)' }} />
                <h4 className="font-bold text-lg text-main">暂未选择错题</h4>
                <p className="text-xs mt-2 leading-relaxed">请从左侧列表选择一道错题，系统将展现专为 6 岁宝宝设计的辅导方案，并支持重新测试消灭错题！</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Sub Tab (Custom Word Builder) */}
      {subTab === 'settings' && (
        <div className="parent-layout-split">
          {/* Settings panel */}
          <div className="glass-card rounded-3xl p-4 flex flex-col gap-3 overflow-y-auto min-h-0" style={{ flex: 1 }}>
            <h3 className="text-lg font-bold text-main">系统设置</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-muted">
                🔊 语音朗读语速 Rate:
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => {
                    setSpeechRate(parseFloat(e.target.value));
                  }}
                  className="w-full"
                />
                <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{speechRate}x</span>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>6岁孩子建议将语速调在 0.7 - 0.85 之间以利于跟读模仿。</p>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-card)' }} />

            <h3 className="text-lg font-bold text-main">添加自定义卡片 (宝宝专属扩展)</h3>
            <form onSubmit={handleAddWord} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="英文单词 (e.g. rabbit)"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="settings-input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="中文翻译 (e.g. 兔子)"
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  className="settings-input-field"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="音标 (e.g. /ˈræbɪt/)"
                value={newPhonetic}
                onChange={(e) => setNewPhonetic(e.target.value)}
                className="settings-input-field"
              />
              <input
                type="text"
                placeholder="英文例句 (e.g. The rabbit eats a carrot.)"
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                className="settings-input-field"
              />
              <input
                type="text"
                placeholder="例句中文翻译 (e.g. 兔子正在吃胡萝卜。)"
                value={newSentenceTrans}
                onChange={(e) => setNewSentenceTrans(e.target.value)}
                className="settings-input-field"
              />
              
              <button type="submit" className="btn-bubble text-xs py-2 px-4 shadow-none translate-y-0 w-full flex justify-center items-center gap-1.5">
                <Plus size={14} /> 添加到“单词卡大作战”中
              </button>
            </form>
          </div>

          {/* Custom words list */}
          <div className="glass-card rounded-3xl p-4 flex flex-col gap-3 min-h-0" style={{ flex: 1 }}>
            <h3 className="text-lg font-bold text-main">已扩展单词 ({customWords.length})</h3>
            
            {customWords.length === 0 ? (
              <div className="text-center p-6 text-muted text-sm">
                还没有自定义单词卡。可以在左侧添加哦！
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
                {customWords.map((w) => (
                  <div key={w.id} className="flex justify-between items-center p-3 rounded-xl text-xs" style={{ backgroundColor: 'var(--primary-bg)', border: '1px solid var(--primary-border)' }}>
                    <div>
                      <div className="font-bold" style={{ color: 'var(--primary)' }}>{w.word} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{w.phonetic}</span></div>
                      <div className="text-main" style={{ marginTop: '2px' }}>{w.translation}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { playClickSound(); speakText(w.word, speechRate); }}
                        style={{ border: '1.5px solid var(--primary-border)', backgroundColor: 'var(--bg-card)', color: 'var(--primary)', padding: '4px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Volume2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomWord(w.id)}
                        style={{ border: '1.5px solid var(--accent)', backgroundColor: 'var(--bg-card)', color: 'var(--accent)', padding: '4px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
