import { useState } from "react";
import { BookOpen, Headphones, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { GRADED_LONG_PASSAGES } from "../data/long-passages.js";
import StoryReader from "./StoryReader.jsx";
import { playClickSound, playCorrectSound, playIncorrectSound } from "../utils/audio.js";

export default function LongReadingHub({ say, wordLookup, progress, onCompletePassage }) {
  const [passageId, setPassageId] = useState(GRADED_LONG_PASSAGES[0].id);
  const [showTranslation, setShowTranslation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentPassage =
    GRADED_LONG_PASSAGES.find((p) => p.id === passageId) || GRADED_LONG_PASSAGES[0];
  const completedPassages = (progress?.completed || []).filter((id) =>
    id.startsWith("long-passage-"),
  );

  function selectPassage(id) {
    playClickSound();
    setPassageId(id);
    setAnswers({});
    setSubmitted(false);
    setShowTranslation(false);
  }

  function handleOptionClick(qIndex, optIndex) {
    if (submitted) return;
    playClickSound();
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  const allAnswered = currentPassage.questions.every(
    (_, idx) => answers[idx] !== undefined,
  );
  const correctCount = currentPassage.questions.filter(
    (q, idx) => answers[idx] === q.answer,
  ).length;

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    if (correctCount === currentPassage.questions.length) {
      playCorrectSound();
      onCompletePassage?.(currentPassage.id);
    } else {
      playIncorrectSound();
    }
  }

  return (
    <section
      id="long-reading-section"
      className="long-reading-section"
      aria-label="分级长文深度阅读馆"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">STAGE 4 · GRADED LONG-PASSAGE READING</span>
          <h2>
            <BookOpen size={20} /> 分级长文深度阅读馆（150–250 词多段落精读）
          </h2>
        </div>
        <span className="muted">
          已精读 {completedPassages.length} / {GRADED_LONG_PASSAGES.length} 篇跨学科长文
        </span>
      </div>

      <div className="long-reading-tabs" role="group" aria-label="选择分级长文">
        {GRADED_LONG_PASSAGES.map((item) => {
          const isDone = completedPassages.includes(item.id);
          return (
            <button
              type="button"
              key={item.id}
              aria-pressed={currentPassage.id === item.id}
              className={`quiet-button ${currentPassage.id === item.id ? "active-long-tab" : ""}`}
              onClick={() => selectPassage(item.id)}
            >
              <div>
                <strong>{item.title}</strong>
                <small>
                  {item.tier} · {item.wordCount} 词
                </small>
              </div>
              {isDone && <CheckCircle2 size={16} className="positive" />}
            </button>
          );
        })}
      </div>

      <article className="long-reading-card">
        <div className="long-reading-header">
          <div>
            <span className="tag">
              {currentPassage.tier} · {currentPassage.wordCount} Words
            </span>
            <h3 lang="en">{currentPassage.englishTitle}</h3>
            <p className="muted">{currentPassage.title}</p>
          </div>
          <div className="long-reading-controls">
            <button
              type="button"
              className="secondary"
              onClick={() => say?.(currentPassage.passage, 0.86)}
            >
              <Headphones size={18} /> 朗读完整长文
            </button>
            <button
              type="button"
              className="quiet-button"
              onClick={() => setShowTranslation((prev) => !prev)}
            >
              {showTranslation ? "收起中文译文" : "查看分段译文"}
            </button>
          </div>
        </div>

        <div className="reading-strategy-banner">
          <div>
            <strong>
              <Sparkles size={15} /> 阅读策略锦囊：{currentPassage.readingStrategy.name}
            </strong>
            <p>{currentPassage.readingStrategy.tip}</p>
          </div>
          <div className="discourse-markers-box">
            <small>本文逻辑路标词：</small>
            <div>
              {currentPassage.discourseMarkers.map((marker) => (
                <span key={marker} className="marker-badge" lang="en">
                  {marker}
                </span>
              ))}
            </div>
          </div>
        </div>

        <StoryReader
          passage={currentPassage.passage}
          wordLookup={wordLookup}
          highlightWords={currentPassage.highlightWords}
          say={say}
        />

        {showTranslation && (
          <div className="long-reading-translation">
            <h4>分段参考译文</h4>
            <p>{currentPassage.translation}</p>
          </div>
        )}

        <div className="long-comprehension-box">
          <h4>长文深度理解训练（主旨 · 细节 · 推断）</h4>
          <div className="long-questions-grid">
            {currentPassage.questions.map((q, qIdx) => (
              <div key={q.id} className="long-question-item">
                <p className="long-question-prompt">
                  <strong>Q{qIdx + 1}.</strong> <span lang="en">{q.prompt}</span>
                </p>
                <div className="answer-options">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[qIdx] === optIdx;
                    const isRight = optIdx === q.answer;
                    let statusClass = "";
                    if (submitted) {
                      if (isRight) statusClass = "correct";
                      else if (isSelected) statusClass = "incorrect";
                    } else if (isSelected) {
                      statusClass = "selected-pending";
                    }
                    return (
                      <button
                        type="button"
                        key={opt}
                        className={`answer-option ${statusClass}`}
                        onClick={() => handleOptionClick(qIdx, optIdx)}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span lang="en">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <p className="long-question-explanation">
                    <strong>解析：</strong>
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="long-submit-row">
            {!submitted ? (
              <button
                type="button"
                className="primary"
                disabled={!allAnswered}
                onClick={handleSubmit}
              >
                提交长文理解答案
              </button>
            ) : (
              <div className="long-result-summary" role="status">
                <strong>
                  本次长文理解得分：{correctCount} / {currentPassage.questions.length}
                </strong>
                <span>
                  {correctCount === currentPassage.questions.length
                    ? "🎉 全部答对！你已经具备出色的长文主旨与细节把握能力！"
                    : "请结合上方题目解析回读对应段落，再挑战一次吧！"}
                </span>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                  }}
                >
                  <RotateCcw size={16} /> 重新作答本篇
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
