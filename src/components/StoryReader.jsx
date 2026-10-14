import { useState } from "react";
import { Headphones, Volume2, X, Sparkles } from "lucide-react";
import WordIllustration from "./WordIllustration.jsx";
import { getPhonicsBreakdown } from "../data/phonics.js";
import { getSpeakableWordText } from "../utils/speechText.js";

/**
 * Interactive Picture-Book Story Reader for 6-year-old learners.
 *
 * Crucial invariant: `.reading-passage` textContent MUST exactly equal `passage`
 * so existing E2E assertions (`expect(page.locator(".reading-passage")).toHaveText(...)`)
 * remain 100% satisfied, while every vocabulary word inside `.reading-passage`
 * can be tapped to pop up a Tap-to-Peek card (real photo + phonics chunks + meaning + audio)
 * below the blockquote!
 */
export default function StoryReader({
  passage,
  wordLookup = {},
  highlightWords = [],
  say,
  onAudioHint,
  showFullControls = false,
}) {
  const [peekWord, setPeekWord] = useState(null);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(null);

  if (!passage) return null;

  const highlightSet = new Set(
    highlightWords.map((w) => (typeof w === "string" ? w.toLowerCase() : w?.word?.toLowerCase())).filter(Boolean),
  );

  function resolveWord(rawToken) {
    const clean = rawToken.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (!clean) return null;
    if (wordLookup[clean]) return wordLookup[clean];
    if (clean.endsWith("es") && wordLookup[clean.slice(0, -2)]) {
      return wordLookup[clean.slice(0, -2)];
    }
    if (clean.endsWith("s") && wordLookup[clean.slice(0, -1)]) {
      return wordLookup[clean.slice(0, -1)];
    }
    return null;
  }

  // Split passage preserving exact whitespace and punctuation so `.reading-passage` textContent is identical
  const tokens = passage.split(/([a-zA-Z]+)/);
  const sentences = passage.match(/[^.!?]+[.!?]+/g) || [passage];
  const peekPhonics = peekWord ? getPhonicsBreakdown(peekWord) : null;

  return (
    <div className="story-reader-wrap">
      <blockquote className="reading-passage" lang="en">
        {tokens.map((token, idx) => {
          if (!/^[a-zA-Z]+$/.test(token)) {
            return <span key={idx}>{token}</span>;
          }
          const matched = resolveWord(token);
          const isTarget =
            matched &&
            (highlightSet.has(matched.word.toLowerCase()) ||
              highlightSet.has(token.toLowerCase()));
          if (!matched) {
            return <span key={idx}>{token}</span>;
          }
          return (
            <span
              key={idx}
              className={`story-tap-word ${isTarget ? "target-word" : ""} ${peekWord?.id === matched.id ? "active-peek" : ""}`}
              onClick={() => {
                setPeekWord(matched);
                onAudioHint?.();
                say?.(getSpeakableWordText(matched));
              }}
              title={`点击查看 ${matched.word}（${matched.translation}）`}
            >
              {token}
            </span>
          );
        })}
      </blockquote>

      <p className="story-tap-hint tiny">
        <Sparkles size={13} /> 绘本点读提示：点一点故事里带下划线的单词，就能看图和自然拼读积木！
      </p>

      {peekWord && peekPhonics && (
        <aside className="story-word-peek" aria-label={`${peekWord.word} 点读卡片`}>
          <div className="story-peek-main">
            {peekWord.image && <WordIllustration word={peekWord} size="small" />}
            <div className="story-peek-info">
              <div className="story-peek-title">
                <strong lang="en">{peekWord.word}</strong>
                {peekWord.partOfSpeechLabel && (
                  <small className="part-of-speech">{peekWord.partOfSpeechLabel}</small>
                )}
                <span>{peekWord.translation}</span>
              </div>
              <div className="preview-phonics">
                {peekPhonics.chunks.map((chunk, i) => (
                  <span
                    key={`${chunk.text}-${i}`}
                    className={`phonics-mini-chunk kind-${chunk.kind}`}
                    lang="en"
                  >
                    {chunk.text}
                  </span>
                ))}
              </div>
              <p className="tiny">{peekPhonics.rule}</p>
            </div>
          </div>
          <div className="story-peek-actions">
            <button
              type="button"
              className="icon-button"
              aria-label={`听点读词 ${peekWord.word}`}
              onClick={() => {
                onAudioHint?.();
                say?.(getSpeakableWordText(peekWord));
              }}
            >
              <Volume2 size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="关闭点读卡片"
              onClick={() => setPeekWord(null)}
            >
              <X size={18} />
            </button>
          </div>
        </aside>
      )}

      {showFullControls && (
        <>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              onAudioHint?.();
              say?.(passage);
            }}
          >
            <Headphones size={19} /> 听完整故事
          </button>
          <div className="story-sentences">
            {sentences.map((sentence, n) => (
              <button
                type="button"
                className={`quiet-button ${activeSentenceIdx === n ? "active-sentence" : ""}`}
                key={n}
                onClick={() => {
                  setActiveSentenceIdx(n);
                  onAudioHint?.();
                  say?.(sentence.trim());
                }}
                aria-label={`听故事第 ${n + 1} 句`}
              >
                <Volume2 size={16} />
                <span lang="en">{sentence.trim()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
