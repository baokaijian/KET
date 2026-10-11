import { useState, useEffect, Fragment } from 'react';
import { Volume2, Play, ChevronRight, Award, RefreshCw, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { quizzesData } from '../data/quizzes';
import { speakText, playCorrectSound, playIncorrectSound, playClickSound, playVictoryFanfare } from '../utils/audio';

export default function QuizArena({ 
  onMascotMessage, 
  setMascotStatus, 
  addStars, 
  logMistake, 
  unlockSticker, 
  speechRate,
  progress,
  mistakes = [],
  setMistakes
}) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  // Track wrong answers for logging mistakes
  const [tempWrongAnswers, setTempWrongAnswers] = useState([]);

  // Auto read audio text for listening questions
  useEffect(() => {
    if (activeQuiz && !isAnswered) {
      const question = activeQuiz.questions[currentIdx];
      if (question.type === 'listening') {
        setTimeout(() => {
          speakText(question.audioText, speechRate);
          onMascotMessage("🔈 Click the speaker to listen! 仔细听听 Sparks 在说什么。");
        }, 800);
      } else {
        onMascotMessage("Read carefully! 仔细阅读，选出正确的选项吧！");
      }
    }
  }, [activeQuiz, currentIdx, isAnswered, speechRate, onMascotMessage]);

  const selectQuiz = (quiz) => {
    playClickSound();
    setActiveQuiz(quiz);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
    setTempWrongAnswers([]);
    setMascotStatus('idle');
  };

  const startMistakeQuiz = () => {
    playClickSound();
    const mistakeQuiz = {
      id: 'mistake_review',
      title: '错题大作战 🛡️',
      description: '消灭你的所有错题！',
      questions: mistakes.map(m => ({
        id: m.questionId,
        type: m.type,
        questionText: m.questionText,
        signContent: m.signContent || null,
        gapSentence: m.gapSentence || null,
        audioText: m.audioText || null,
        questionQuery: m.questionQuery || null,
        options: m.options,
        correctAnswer: m.correctAnswer,
        explanation: m.explanation
      }))
    };
    setActiveQuiz(mistakeQuiz);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
    setTempWrongAnswers([]);
    setMascotStatus('idle');
    onMascotMessage("⚡ 错题大作战开始！认真回答，把它们消灭吧！");
  };

  const handleOptionSelect = (optionChar) => {
    if (isAnswered) return;
    playClickSound();
    setSelectedOption(optionChar);
  };

  const handleVerify = () => {
    if (!selectedOption || isAnswered) return;
    
    const question = activeQuiz.questions[currentIdx];
    const isCorrect = selectedOption === question.correctAnswer;
    setIsAnswered(true);

    if (isCorrect) {
      playCorrectSound();
      setMascotStatus('correct');
      setCorrectCount(prev => prev + 1);
    } else {
      playIncorrectSound();
      setMascotStatus('wrong');
      
      // Save details for local logging
      const wrongItem = {
        questionId: question.id,
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        questionText: question.questionText,
        signContent: question.signContent || null,
        gapSentence: question.gapSentence || null,
        audioText: question.audioText || null,
        questionQuery: question.questionQuery || null,
        type: question.type,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: selectedOption,
        explanation: question.explanation
      };
      
      setTempWrongAnswers(prev => [...prev, wrongItem]);
    }
  };

  const handleNext = () => {
    playClickSound();
    
    if (currentIdx + 1 < activeQuiz.questions.length) {
      // Go to next question
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setMascotStatus('idle');
    } else {
      // Finish quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    playVictoryFanfare();
    
    if (activeQuiz.id === 'mistake_review') {
      const wrongIds = tempWrongAnswers.map(t => t.questionId);
      const solvedCount = activeQuiz.questions.length - wrongIds.length;
      
      // Update mistakes database: keep only those that were got wrong *again*
      const updatedMistakes = mistakes.filter(m => wrongIds.includes(m.questionId));
      setMistakes(updatedMistakes);
      
      const starReward = solvedCount * 15;
      addStars(starReward);
      
      if (solvedCount > 0) {
        unlockSticker('mistake_conqueror');
      }

      if (solvedCount === activeQuiz.questions.length) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        onMascotMessage(`Congratulations! You solved all mistakes! 错题全部被消灭啦！获得 ${starReward} 颗星星 ⭐`);
      } else {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        onMascotMessage(`Great job! You solved some mistakes! 消灭了 ${solvedCount} 道错题，获得 ${starReward} 颗星星 ⭐`);
      }
    } else {
      const finalScore = Math.round((correctCount / activeQuiz.questions.length) * 100);
      const starReward = correctCount * 15;
      addStars(starReward);
      
      // Unlock achievements
      unlockSticker('first_quiz');
      if (finalScore === 100) {
        unlockSticker('perfect_score');
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }

      onMascotMessage(`Congratulations! You completed the quiz! 得分：${finalScore}分，获得 ${starReward} 颗星星 ⭐`);

      // Log wrong answers to Mistake Notebook
      tempWrongAnswers.forEach(item => {
        logMistake(item);
      });
    }
  };

  const exitQuiz = () => {
    playClickSound();
    setActiveQuiz(null);
    setMascotStatus('idle');
  };

  // Render question content based on type
  const renderQuestionBody = (question) => {
    switch (question.type) {
      case 'sign':
        return (
          <div className="quiz-signpost-card flex flex-col items-center justify-center gap-2">
            <span className="quiz-signpost-icon">📢</span>
            <div className="quiz-signpost-text select-none" style={{ fontFamily: 'var(--font-heading)' }}>
              {question.signContent}
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                speakText(question.signContent, speechRate);
              }}
              className="speak-btn"
              title="听告示牌内容"
            >
              <Volume2 size={14} />
            </button>
          </div>
        );
      case 'listening':
        return (
          <div className="quiz-listening-container">
            <button
              onClick={() => { playClickSound(); speakText(question.audioText, speechRate); }}
              className="quiz-listening-btn animate-pulse-slow"
            >
              <Volume2 size={44} />
            </button>
            <span className="text-sm font-bold text-muted">点击播放语音 (Listening Prompt)</span>
          </div>
        );
      case 'reading':
        return (
          <div className="quiz-reading-card">
            <div className="quiz-reading-title flex items-center justify-between">
              <span>📄 故事短文 Reading Passage:</span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  const textToRead = question.questionText.replace(/阅读这篇小短文，回答问题：\s*/g, '');
                  speakText(textToRead, speechRate);
                }}
                className="speak-btn"
                title="听短文"
              >
                <Volume2 size={14} />
              </button>
            </div>
            <p className="quiz-reading-text" style={{ whiteSpace: 'pre-line' }}>
              {question.questionText}
            </p>
            <div className="quiz-reading-query flex items-center justify-center gap-2">
              <span>❓ {question.questionQuery}</span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  speakText(question.questionQuery, speechRate);
                }}
                className="speak-btn"
                title="听提问"
              >
                <Volume2 size={14} />
              </button>
            </div>
          </div>
        );
      case 'gapfill':
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="quiz-gapfill-sentence">
              {question.gapSentence.split('________').map((part, index) => (
                <Fragment key={index}>
                  <span>{part}</span>
                  {index === 0 && (
                    <span className="quiz-gapfill-slot">
                      {selectedOption || ' ? '}
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                const textToRead = question.gapSentence.replace('________', 'blank');
                speakText(textToRead, speechRate);
              }}
              className="speak-btn"
              title="听填空句"
            >
              <Volume2 size={14} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // If no quiz is selected, show list of quizzes
  if (!activeQuiz) {
    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-4">
        <div className="glass-card rounded-3xl p-4 text-center max-w-xl mx-auto w-full shrink-0">
          <h2 className="text-2xl font-extrabold text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            KET 真题大闯关 🏆
          </h2>
          <p className="text-xs text-muted">
            亲爱的宝宝，让我们用有趣的测试题来验证学习成果吧！每完成一次测试都可以收获星星和贴纸奖励哦！
          </p>
        </div>

        {/* Mistake Review Mode Card for Children */}
        {mistakes.length > 0 && (
          <div className="glass-card rounded-3xl p-4 max-w-4xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-3 border-2 border-dashed border-rose-300 bg-rose-50/30 dark:bg-rose-950/10 shrink-0">
            <div className="flex items-center gap-3 text-left">
              <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl p-2.5 flex items-center justify-center shrink-0">
                <Shield size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400" style={{ fontFamily: 'var(--font-heading)' }}>
                  错题大作战 (Mistake Review Arena)
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  宝宝累计有 <strong>{mistakes.length}</strong> 道做错的题目。快来消灭它们，夺回星星吧！
                </p>
              </div>
            </div>
            <button onClick={startMistakeQuiz} className="btn-bubble danger py-2 px-5 text-sm flex items-center gap-2 shrink-0">
              ⚡ 开始消灭错题
            </button>
          </div>
        )}

        <div className="grid-responsive overflow-y-auto flex-1 min-h-0 pr-1 max-w-4xl mx-auto w-full pb-4">
          {quizzesData.map((quiz) => {
            const isRecommended = progress.currentLevel >= quiz.requiredLevel && progress.learnedWords.size >= quiz.requiredWords;

            return (
              <div 
                key={quiz.id} 
                className="glass-card rounded-3xl flex flex-col justify-between p-5 relative overflow-hidden transition-all duration-300" 
                style={{ 
                  borderBottom: '6px solid var(--primary)'
                }}
              >
                {!isRecommended && (
                  <div className="absolute top-3 right-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-full p-1.5 flex items-center justify-center border border-amber-200 dark:border-amber-900/40" title="建议先完成对应词汇学习，也可以直接挑战">
                    <Sparkles size={14} />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: quiz.difficulty }).map((_, i) => (
                      <span key={i} className="text-amber-400 text-sm">⭐</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-main" style={{ fontFamily: 'var(--font-heading)' }}>
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-muted mt-1.5 mb-3 leading-relaxed whitespace-pre-line">
                    {quiz.description}
                  </p>
                  
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-xl border border-amber-100 dark:border-amber-900/30 mb-3 text-left">
                    建议：学到第 {quiz.requiredLevel} 级，已学约 {quiz.requiredWords} 词后挑战（当前：第 {progress.currentLevel} 级，{progress.learnedWords.size} 词）。也可以直接开始练习。
                  </div>
                </div>
                
                <button onClick={() => selectQuiz(quiz)} className="btn-bubble secondary w-full">
                  <Play size={18} /> 开始大闯关
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz Finished Screen
  if (quizFinished) {
    if (activeQuiz.id === 'mistake_review') {
      const solvedCount = activeQuiz.questions.length - tempWrongAnswers.length;
      return (
        <div className="flex-1 min-h-0 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full text-center flex flex-col items-center gap-4 overflow-y-auto max-h-full">
            <Award size={64} className="text-amber-500 animate-bounce shrink-0" />
            <div>
              <h2 className="text-2xl font-extrabold text-main" style={{ fontFamily: 'var(--font-heading)' }}>
                错题大作战结束！
              </h2>
              <p className="text-xs text-muted mt-0.5">你在消灭错题上做得太棒了！</p>
            </div>

            <div className="w-full rounded-2xl p-3 flex flex-col gap-1.5 text-main bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-sm">
              <div className="flex justify-between items-center font-bold">
                <span>成功消灭:</span>
                <span style={{ color: '#10b981' }}>{solvedCount} / {activeQuiz.questions.length} 道错题</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>剩余错题:</span>
                <span className="text-rose-500">{tempWrongAnswers.length} 道</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>奖励星星:</span>
                <span style={{ color: 'var(--accent)' }}>+{solvedCount * 15} ⭐</span>
              </div>
            </div>

            {tempWrongAnswers.length > 0 ? (
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 p-3 rounded-2xl text-[11px] text-left w-full border border-rose-100 dark:border-rose-900/30">
                <strong>💡 温馨提示：</strong>还有 {tempWrongAnswers.length} 道错题需要继续加油哦，可以再次挑战或者请爸爸妈妈在“家长专区”辅导你！
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-2xl text-[11px] text-left w-full border border-emerald-100 dark:border-emerald-900/30">
                <strong>🏆 错题清空！</strong>太厉害了，所有的错题都被你消灭干净啦！你真是一个不怕困难的学习小勇士！
              </div>
            )}

            <div className="flex gap-3 w-full mt-1 shrink-0">
              {tempWrongAnswers.length > 0 && (
                <button onClick={startMistakeQuiz} className="btn-bubble danger py-2 text-sm flex-1">
                  <RefreshCw size={16} /> 再次挑战
                </button>
              )}
              <button onClick={exitQuiz} className="btn-bubble py-2 text-sm flex-1">
                退出复习
              </button>
            </div>
          </div>
        </div>
      );
    }

    const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-6 max-w-md w-full text-center flex flex-col items-center gap-4 overflow-y-auto max-h-full">
          <Award size={64} className="text-amber-500 animate-bounce shrink-0" />
          <div>
            <h2 className="text-2xl font-extrabold text-main" style={{ fontFamily: 'var(--font-heading)' }}>
              闯关圆满结束！
            </h2>
            <p className="text-xs text-muted mt-0.5">你完成得太出色了！</p>
          </div>

          <div className="w-full rounded-2xl p-3 flex flex-col gap-1.5 text-main text-sm" style={{ backgroundColor: 'var(--primary-bg)' }}>
            <div className="flex justify-between items-center font-bold">
              <span>答对题数:</span>
              <span style={{ color: '#10b981' }}>{correctCount} / {activeQuiz.questions.length}</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>最终成绩:</span>
              <span className="text-primary">{score} 分</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>奖励星星:</span>
              <span style={{ color: 'var(--accent)' }}>+{correctCount * 15} ⭐</span>
            </div>
          </div>

          {tempWrongAnswers.length > 0 ? (
            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 p-3 rounded-2xl text-[11px] text-left w-full border border-rose-100 dark:border-rose-900/30">
              <strong>💡 温馨提示：</strong>本次闯关中有 {tempWrongAnswers.length} 道错题，已自动记录在<strong>“家长专区 ➔ 错题本”</strong>中。爸爸妈妈可以去那里给宝宝讲题，并让宝宝再次尝试重新做对哟！
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-2xl text-[11px] text-left w-full border border-emerald-100 dark:border-emerald-900/30">
              <strong>🥇 满分成就：</strong>太不可思议了！本次测试全部正确，简直是英语小天才！
            </div>
          )}

          <div className="flex gap-3 w-full mt-1 shrink-0">
            <button onClick={() => selectQuiz(activeQuiz)} className="btn-bubble secondary py-2 text-sm flex-1">
              <RefreshCw size={16} /> 再战一次
            </button>
            <button onClick={exitQuiz} className="btn-bubble py-2 text-sm flex-1">
              退出关卡
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Playing Screen
  const question = activeQuiz.questions[currentIdx];

  return (
    <div className="flex-1 min-h-0 flex items-center justify-center py-2 px-4 w-full">
      <div className="glass-card rounded-3xl p-5 max-w-xl w-full flex flex-col min-h-0 max-h-full overflow-hidden relative">
        {/* Quiz Progress header */}
        <div className="flex justify-between items-center pb-3 border-b mb-3 shrink-0" style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}>
          <button onClick={exitQuiz} className="text-sm font-bold text-muted hover:text-main flex items-center gap-1" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            ❌ 退出
          </button>
          <span className="text-sm font-extrabold text-primary px-3 py-1 rounded-full" style={{ fontFamily: 'var(--font-heading)', backgroundColor: 'var(--primary-bg)' }}>
            第 {currentIdx + 1} 题 / 共 {activeQuiz.questions.length} 题
          </span>
        </div>

        {/* Progress visual footprints/bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden mb-4 shrink-0" style={{ backgroundColor: 'var(--primary-bg)' }}>
          <div 
            className="h-full transition-all duration-500" 
            style={{ 
              width: `${((currentIdx) / activeQuiz.questions.length) * 100}%`,
              backgroundColor: 'var(--primary)'
            }}
          />
        </div>

        {/* Scrollable question and options area */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col justify-start text-center">
          {question.type !== 'reading' && (
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center justify-center gap-2">
              <span>{question.questionText}</span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  speakText(question.questionText, speechRate);
                }}
                className="speak-btn shrink-0"
                title="听题目"
              >
                <Volume2 size={14} />
              </button>
            </h2>
          )}

          {/* Render question details according to its type */}
          <div className="shrink-0 mb-2">
            {renderQuestionBody(question)}
          </div>

          {/* Question Options */}
          <div className="flex flex-col gap-2.5 my-3">
            {question.options.map((option, idx) => {
              const optionChar = option.charAt(0); // A, B, or C
              const isSelected = selectedOption === optionChar;
              
              let stateClass = '';
              let iconBox = null;

              if (isAnswered) {
                if (optionChar === question.correctAnswer) {
                  stateClass = 'correct';
                  iconBox = <span style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 800 }}>✓</span>;
                } else if (isSelected) {
                  stateClass = 'incorrect';
                  iconBox = <span style={{ color: '#f43f5e', fontSize: '1.1rem', fontWeight: 800 }}>✗</span>;
                } else {
                  stateClass = 'faded';
                }
              } else if (isSelected) {
                stateClass = 'selected';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(optionChar)}
                  className={`quiz-option-btn py-2 px-3 text-sm min-h-11 ${stateClass} flex items-center justify-between`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <div className="flex items-center gap-2" style={{ flex: 1 }}>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        speakText(option, speechRate);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          playClickSound();
                          speakText(option, speechRate);
                        }
                      }}
                      className="speak-btn"
                      style={{ width: '22px', height: '22px', flexShrink: 0 }}
                      title="听选项"
                    >
                      <Volume2 size={12} />
                    </span>
                    <span className="text-left text-xs sm:text-sm">{option}</span>
                  </div>
                  {iconBox}
                </button>
              );
            })}
          </div>

          {/* Real-time kid explanation for mistakes */}
          {isAnswered && selectedOption !== question.correctAnswer && (
            <div className="mt-2 mb-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl text-left text-xs flex gap-2 shrink-0">
              <span className="text-lg">🦖</span>
              <div>
                <p className="text-amber-800 dark:text-amber-400 font-bold mb-0.5">
                  Sparks 的加油站：
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  哎呀没关系！正确答案是 <strong>{question.correctAnswer}</strong> 哟。这一题的秘密是：
                  <span className="italic block mt-0.5 flex items-center gap-1.5">
                    “{question.explanation.questionTranslation}”
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        speakText(question.explanation.questionTranslation, speechRate);
                      }}
                      className="speak-btn"
                      style={{ width: '18px', height: '18px' }}
                      title="听翻译"
                    >
                      <Volume2 size={10} />
                    </button>
                  </span>
                  不要心急，等一下让爸爸妈妈带我们去“家长专区”读读 Sparks 写的讲解，或者在上面的<strong>“错题大作战”</strong>里再挑战一次！
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Verify / Next actions */}
        <div className="flex gap-4 items-center justify-center mt-3 shrink-0">
          {!isAnswered ? (
            <button
              disabled={!selectedOption}
              onClick={handleVerify}
              className={`btn-bubble w-full py-2.5 ${!selectedOption ? 'opacity-50 cursor-not-allowed scale-95 shadow-none translate-y-0' : ''}`}
            >
              验证答案 (Verify)
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-bubble accent w-full py-2.5 flex justify-center items-center gap-1"
            >
              <span>{currentIdx + 1 === activeQuiz.questions.length ? '查看结果' : '下一题'}</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
