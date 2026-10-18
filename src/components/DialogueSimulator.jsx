import { useState } from "react";
import { MessageCircle, Volume2, CheckCircle2, RotateCcw, ArrowRight, X } from "lucide-react";
import { COMMUNICATION_DIALOGUES } from "../data/communication-dialogues.js";
import { playClickSound, playCorrectSound, playIncorrectSound } from "../utils/audio.js";

export default function DialogueSimulator({ say, progress, onCompleteDialogue }) {
  const [dialogueId, setDialogueId] = useState(COMMUNICATION_DIALOGUES[0].id);
  const [turnIndex, setTurnIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [finished, setFinished] = useState(false);

  const currentDialogue =
    COMMUNICATION_DIALOGUES.find((d) => d.id === dialogueId) || COMMUNICATION_DIALOGUES[0];
  const currentTurn = currentDialogue.turns[turnIndex] || currentDialogue.turns[0];
  const completedDialogues = (progress?.completed || []).filter((id) =>
    id.startsWith("dialogue-"),
  );

  function selectScene(id) {
    playClickSound();
    setDialogueId(id);
    setTurnIndex(0);
    setSelectedOption(null);
    setFinished(false);
  }

  function handleChooseOption(idx) {
    if (selectedOption !== null) return;
    const isCorrect = idx === currentTurn.answer;
    setSelectedOption({ idx, isCorrect });
    if (isCorrect) {
      playCorrectSound();
      say?.(currentTurn.options[idx], 0.88);
    } else {
      playIncorrectSound();
    }
  }

  function handleNextTurn() {
    playClickSound();
    if (turnIndex + 1 < currentDialogue.turns.length) {
      setTurnIndex(turnIndex + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
      onCompleteDialogue?.(currentDialogue.id);
    }
  }

  function handleRestart() {
    playClickSound();
    setTurnIndex(0);
    setSelectedOption(null);
    setFinished(false);
  }

  return (
    <section
      id="dialogue-simulator-section"
      className="dialogue-simulator-section"
      aria-label="自然情景交际对话舱"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">STAGE 2 · NATURAL COMMUNICATION SIMULATOR</span>
          <h2>
            <MessageCircle size={20} /> 自然情景交际对话舱（听懂语境 · 礼貌回应）
          </h2>
        </div>
        <span className="muted">
          已通关 {completedDialogues.length} / {COMMUNICATION_DIALOGUES.length} 个交际场景
        </span>
      </div>

      <div className="dialogue-scene-tabs" role="group" aria-label="选择交际对话场景">
        {COMMUNICATION_DIALOGUES.map((scene) => {
          const isDone = completedDialogues.includes(scene.id);
          return (
            <button
              type="button"
              key={scene.id}
              aria-pressed={currentDialogue.id === scene.id}
              className={`quiet-button ${currentDialogue.id === scene.id ? "active-dialogue-tab" : ""}`}
              onClick={() => selectScene(scene.id)}
            >
              <div>
                <strong>{scene.title}</strong>
                <small>{scene.level}</small>
              </div>
              {isDone && <CheckCircle2 size={16} className="positive" />}
            </button>
          );
        })}
      </div>

      <article className="dialogue-stage-card">
        <div className="dialogue-meta-bar">
          <div>
            <h3 lang="en">{currentDialogue.englishTitle}</h3>
            <p className="tiny">{currentDialogue.scene}</p>
          </div>
          <span className="tag">
            第 {turnIndex + 1} / {currentDialogue.turns.length} 轮对话
          </span>
        </div>

        <div className="dialogue-key-phrases">
          {currentDialogue.keyExpressions.map(([en, zh]) => (
            <button
              type="button"
              key={en}
              className="dialogue-phrase-chip"
              onClick={() => say?.(en, 0.85)}
              title={`点击听表达：${en}`}
            >
              <Volume2 size={14} />
              <strong lang="en">{en}</strong>
              <span>{zh}</span>
            </button>
          ))}
        </div>

        {!finished ? (
          <div className="dialogue-turn-box">
            <div className="speaker-bubble">
              <div className="speaker-header">
                <strong>伙伴 {currentTurn.speaker} 说：</strong>
                <button
                  type="button"
                  className="quiet-button"
                  onClick={() => say?.(currentTurn.speakerLine, 0.85)}
                  aria-label={`听 ${currentTurn.speaker} 的对话语音`}
                >
                  <Volume2 size={16} /> 听对方说
                </button>
              </div>
              <p className="speaker-en" lang="en">
                “{currentTurn.speakerLine}”
              </p>
              <p className="speaker-zh">{currentTurn.speakerTranslation}</p>
            </div>

            <h4 className="dialogue-prompt-title">{currentTurn.prompt}</h4>

            <div className="dialogue-options-list">
              {currentTurn.options.map((opt, idx) => {
                const isPicked = selectedOption?.idx === idx;
                const showCorrect = selectedOption !== null && idx === currentTurn.answer;
                return (
                  <button
                    type="button"
                    key={opt}
                    className={`answer-option ${
                      isPicked
                        ? selectedOption.isCorrect
                          ? "correct"
                          : "incorrect"
                        : showCorrect
                          ? "correct"
                          : ""
                    }`}
                    onClick={() => handleChooseOption(idx)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span lang="en">{opt}</span>
                    {isPicked &&
                      (selectedOption.isCorrect ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <X size={20} />
                      ))}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div
                className={`answer-feedback ${selectedOption.isCorrect ? "success" : "try-again"}`}
                role="status"
              >
                <h4>
                  {selectedOption.isCorrect
                    ? "回答得自然又得体！"
                    : "再看一看语境，选最贴切的一句吧！"}
                </h4>
                <p>
                  <strong>地道回应中文：</strong>
                  {currentTurn.replyTranslation}
                </p>
                <p>{currentTurn.explanation}</p>
                <div className="feedback-actions">
                  {!selectedOption.isCorrect && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => setSelectedOption(null)}
                    >
                      <RotateCcw size={16} /> 重新选择本轮回应
                    </button>
                  )}
                  <button type="button" className="primary" onClick={handleNextTurn}>
                    {turnIndex + 1 < currentDialogue.turns.length
                      ? "继续下一轮对话"
                      : "完成本场景交际"}{" "}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="dialogue-complete-box" role="status">
            <CheckCircle2 size={40} className="positive" />
            <h3>太棒了！你已完成“{currentDialogue.title}”全部三轮真实英语交际！</h3>
            <p>试着自己把刚才的三句英文回应大声连起来读一遍，下次遇到真实场景就能脱口而出啦。</p>
            <div className="feedback-actions">
              <button type="button" className="secondary" onClick={handleRestart}>
                <RotateCcw size={16} /> 再练一次本对话
              </button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
