import { useState } from "react";
import { Sparkles, Volume2, RotateCcw, CheckCircle2 } from "lucide-react";
import { buildPhonicsPuzzle } from "../data/phonics.js";
import { playClickSound, playCorrectSound } from "../utils/audio.js";
import { getSpeakableWordText } from "../utils/speechText.js";

const KIND_LABELS = {
  vowel: "元音积木",
  "r-vowel": "卷舌元音",
  digraph: "组合发音",
  consonant: "辅音积木",
  silent: "魔法静音",
};

export default function PhonicsBreakdown({
  word,
  say,
  interactive = false,
  compact = false,
  onBlendComplete,
}) {
  const puzzle = buildPhonicsPuzzle(word);
  const { breakdown, target, pool } = puzzle;
  const [activeChunk, setActiveChunk] = useState(null);
  const [pickedIds, setPickedIds] = useState([]);
  const [puzzleOpen, setPuzzleOpen] = useState(false);

  if (!breakdown || !breakdown.chunks.length) return null;

  const pickedChunks = pickedIds
    .map((id) => target.find((item) => item.id === id))
    .filter(Boolean);
  const isSolved = target.length > 1 && pickedChunks.length === target.length;

  function speakChunk(chunk, index) {
    setActiveChunk(index);
    if (chunk.kind === "silent" && chunk.text.toLowerCase() === "e") {
      playClickSound();
      return;
    }
    say?.(chunk.text.toLowerCase(), 0.7);
  }

  function handlePickBlock(block) {
    const expectedIndex = pickedIds.length;
    const expectedChunk = target[expectedIndex];
    if (!expectedChunk) return;

    // Accept if the chunk text matches the next expected chunk
    if (block.text.toLowerCase() === expectedChunk.text.toLowerCase()) {
      const nextPicked = [...pickedIds, block.id];
      setPickedIds(nextPicked);
      if (nextPicked.length === target.length) {
        playCorrectSound();
        say?.(getSpeakableWordText(word), 0.85);
        onBlendComplete?.(word);
      } else {
        playClickSound();
        if (!(block.kind === "silent" && block.text.toLowerCase() === "e")) {
          say?.(block.text.toLowerCase(), 0.75);
        }
      }
    } else {
      playClickSound();
      setActiveChunk(block.index);
    }
  }

  function resetPuzzle() {
    playClickSound();
    setPickedIds([]);
  }

  return (
    <div
      className={`phonics-card ${compact ? "phonics-compact" : ""}`}
      aria-label={`${breakdown.word} 自然拼读拆解`}
    >
      <div className="phonics-header">
        <span className="phonics-badge">
          <Sparkles size={14} /> 自然拼读积木
        </span>
        <span className="phonics-legend-hint">点积木听拆音 · 记规律不死背</span>
      </div>

      <div className="phonics-chunks" role="group" aria-label="发音积木块">
        {breakdown.chunks.map((chunk, index) => (
          <button
            type="button"
            key={`${chunk.text}-${index}`}
            className={`phonics-chunk kind-${chunk.kind} ${activeChunk === index ? "active" : ""}`}
            onClick={() => speakChunk(chunk, index)}
            title={`${chunk.text}：${chunk.hint}`}
            aria-label={`拼读积木 ${chunk.text}，${chunk.hint}`}
          >
            <strong lang="en">{chunk.text}</strong>
            <small>{KIND_LABELS[chunk.kind] || "积木"}</small>
          </button>
        ))}
        <button
          type="button"
          className="phonics-blend-btn"
          onClick={() => say?.(getSpeakableWordText(word), 0.72)}
          aria-label={`连读拼出 ${breakdown.word}`}
          title="慢速连读整个词"
        >
          <Volume2 size={17} />
          <span>连读合体</span>
        </button>
      </div>

      {activeChunk !== null && breakdown.chunks[activeChunk] && (
        <p className="phonics-chunk-detail" role="status">
          <strong lang="en">{breakdown.chunks[activeChunk].text}</strong>：
          {breakdown.chunks[activeChunk].hint}
        </p>
      )}

      <p className="phonics-rule">{breakdown.rule}</p>

      {interactive && target.length > 1 && (
        <div className="phonics-puzzle-box">
          <div className="phonics-puzzle-top">
            <strong>
              {isSolved ? "太棒啦！积木合体成功 🎉" : "小挑战：按声音顺序点积木拼一拼"}
            </strong>
            <button
              type="button"
              className="quiet-button phonics-toggle-btn"
              onClick={() => {
                playClickSound();
                setPuzzleOpen((prev) => !prev);
                setPickedIds([]);
              }}
            >
              {puzzleOpen ? "收起拼积木" : "玩拼积木"}
            </button>
          </div>

          {puzzleOpen && (
            <div className="phonics-puzzle-body">
              <div className="phonics-slots" aria-label="已拼好的积木槽">
                {target.map((slot, idx) => {
                  const filled = pickedChunks[idx];
                  return (
                    <span
                      key={slot.id}
                      className={`phonics-slot ${filled ? `filled kind-${filled.kind}` : ""}`}
                      lang="en"
                    >
                      {filled ? filled.text : "?"}
                    </span>
                  );
                })}
                {isSolved && <CheckCircle2 size={20} className="positive" />}
              </div>

              {!isSolved ? (
                <div className="phonics-pool" role="group" aria-label="待选发音积木">
                  {pool.map((block) => {
                    const used = pickedIds.includes(block.id);
                    return (
                      <button
                        type="button"
                        key={block.id}
                        disabled={used}
                        className={`phonics-pool-btn kind-${block.kind}`}
                        onClick={() => handlePickBlock(block)}
                        aria-label={`选择积木 ${block.text}`}
                      >
                        <span lang="en">{block.text}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="phonics-solved-actions">
                  <button
                    type="button"
                    className="quiet-button"
                    onClick={resetPuzzle}
                  >
                    <RotateCcw size={15} /> 再拼一次
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!compact && breakdown.family?.words?.length > 0 && (
        <div className="phonics-family">
          <span className="phonics-family-label">
            发音好朋友（{breakdown.family.pattern}）：
          </span>
          <div className="phonics-family-list">
            {breakdown.family.words.map((friend) => (
              <button
                type="button"
                key={friend}
                className="phonics-family-chip"
                onClick={() => say?.(friend, 0.8)}
                aria-label={`听同家族词 ${friend}`}
                title={`点击听 ${friend} 的发音`}
              >
                <Volume2 size={14} />
                <span lang="en">{friend}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
