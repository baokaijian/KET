import { useState } from "react";
import { Sparkles, Volume2, CheckCircle2 } from "lucide-react";
import {
  ALPHABET_PHONEMES,
  CORE_GRAPHEMES,
  CVC_ONSETS,
  CVC_VOWELS,
  CVC_CODAS,
  MAGIC_E_PAIRS,
  blendCvcWord,
} from "../data/phonics-workshop.js";
import { playClickSound, playCorrectSound } from "../utils/audio.js";

export default function PhonicsWorkshop({ say, progress, onRecordComplete }) {
  const [mode, setMode] = useState("alphabet");
  const [onset, setOnset] = useState("c");
  const [vowel, setVowel] = useState("a");
  const [coda, setCoda] = useState("t");
  const [activePairId, setActivePairId] = useState(MAGIC_E_PAIRS[0].id);

  const blended = blendCvcWord(onset, vowel, coda);
  const activePair =
    MAGIC_E_PAIRS.find((item) => item.id === activePairId) || MAGIC_E_PAIRS[0];
  const blendedCount = (progress?.completed || []).filter((id) =>
    id.startsWith("phonics-cvc-"),
  ).length;

  function handleBlendSpeak() {
    if (blended.isRealWord) {
      playCorrectSound();
      onRecordComplete?.(`phonics-cvc-${blended.word}`);
    } else {
      playClickSound();
    }
    say?.(`${onset}... ${vowel}... ${coda}... ${blended.word}!`, 0.8);
  }

  return (
    <section
      id="phonics-workshop-section"
      className="phonics-workshop-section"
      aria-label="自然拼读交互工坊"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">STAGE 1 · INTERACTIVE PHONICS LAB</span>
          <h2>
            <Sparkles size={20} /> 自然拼读交互工坊（见词能读 · 听音能拼）
          </h2>
        </div>
        <span className="muted">已拼出 {blendedCount} 个 CVC 单词</span>
      </div>

      <div className="workshop-mode-tabs" role="group" aria-label="选择自然拼读训练模式">
        <button
          type="button"
          aria-pressed={mode === "alphabet"}
          className={`quiet-button ${mode === "alphabet" ? "active-workshop-tab" : ""}`}
          onClick={() => {
            playClickSound();
            setMode("alphabet");
          }}
        >
          1. 字母音素与核心组合
        </button>
        <button
          type="button"
          aria-pressed={mode === "cvc"}
          className={`quiet-button ${mode === "cvc" ? "active-workshop-tab" : ""}`}
          onClick={() => {
            playClickSound();
            setMode("cvc");
          }}
        >
          2. CVC 三明治动态拼词机
        </button>
        <button
          type="button"
          aria-pressed={mode === "magic-e"}
          className={`quiet-button ${mode === "magic-e" ? "active-workshop-tab" : ""}`}
          onClick={() => {
            playClickSound();
            setMode("magic-e");
          }}
        >
          3. Magic E 魔法静音 e 实验室
        </button>
      </div>

      {mode === "alphabet" && (
        <div className="workshop-panel">
          <p className="tiny">
            点击任意字母或组合积木，先听它在单词里的自然拼读发音，再听代表词：
          </p>
          <h3 className="workshop-sub-heading">26 个英文字母基础音素 (Letter Sounds)</h3>
          <div className="alphabet-phoneme-grid" role="list" aria-label="26个英文字母音素">
            {ALPHABET_PHONEMES.map((item) => (
              <button
                type="button"
                key={item.letter}
                className="alphabet-phoneme-card"
                onClick={() => say?.(`${item.word}`, 0.8)}
                title={item.tip}
                aria-label={`字母 ${item.letter}，音素 ${item.sound}，例词 ${item.word} ${item.cn}`}
              >
                <strong lang="en">{item.letter}</strong>
                <span className="phoneme-ipa">{item.sound}</span>
                <small lang="en">{item.word}</small>
                <small className="muted">{item.cn}</small>
              </button>
            ))}
          </div>

          <h3 className="workshop-sub-heading">12 组高频辅音与元音黄金组合 (Core Digraphs & Vowel Teams)</h3>
          <div className="core-grapheme-grid" role="list" aria-label="高频字母组合">
            {CORE_GRAPHEMES.map((item) => (
              <button
                type="button"
                key={item.pattern}
                className="core-grapheme-card"
                onClick={() => say?.(`${item.word}`, 0.8)}
                aria-label={`组合 ${item.pattern}，发音 ${item.sound}，例词 ${item.word}`}
              >
                <div className="grapheme-top">
                  <strong lang="en">{item.pattern}</strong>
                  <span className="phoneme-ipa">{item.sound}</span>
                </div>
                <p className="grapheme-word">
                  例词：<strong lang="en">{item.word}</strong>（{item.cn}）
                </p>
                <small className="tiny">{item.tip}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "cvc" && (
        <div className="workshop-panel cvc-blender-panel">
          <p className="tiny">
            分别点击选择<strong>首辅音 (Onset)</strong>、<strong>中间短元音 (Vowel)</strong> 和
            <strong>尾辅音 (Coda)</strong>，看看能组合出什么单词！
          </p>

          <div className="cvc-selector-grid">
            <div className="cvc-column">
              <h4>① 首辅音 (Onset)</h4>
              <div className="cvc-chip-group" role="group" aria-label="选择首辅音">
                {CVC_ONSETS.map((ch) => (
                  <button
                    type="button"
                    key={ch}
                    aria-pressed={onset === ch}
                    className={`cvc-letter-btn onset-btn ${onset === ch ? "selected" : ""}`}
                    onClick={() => {
                      playClickSound();
                      setOnset(ch);
                      say?.(ch, 0.75);
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="cvc-column">
              <h4>② 短元音 (Short Vowel)</h4>
              <div className="cvc-chip-group" role="group" aria-label="选择短元音">
                {CVC_VOWELS.map((ch) => (
                  <button
                    type="button"
                    key={ch}
                    aria-pressed={vowel === ch}
                    className={`cvc-letter-btn vowel-btn ${vowel === ch ? "selected" : ""}`}
                    onClick={() => {
                      playClickSound();
                      setVowel(ch);
                      say?.(ch, 0.75);
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="cvc-column">
              <h4>③ 尾辅音 (Coda)</h4>
              <div className="cvc-chip-group" role="group" aria-label="选择尾辅音">
                {CVC_CODAS.map((ch) => (
                  <button
                    type="button"
                    key={ch}
                    aria-pressed={coda === ch}
                    className={`cvc-letter-btn coda-btn ${coda === ch ? "selected" : ""}`}
                    onClick={() => {
                      playClickSound();
                      setCoda(ch);
                      say?.(ch, 0.75);
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="cvc-result-banner" role="status">
            <div className="cvc-result-word">
              <div className="cvc-slots-display" lang="en">
                <span className="cvc-part onset">{onset}</span>
                <span className="cvc-plus">+</span>
                <span className="cvc-part vowel">{vowel}</span>
                <span className="cvc-plus">+</span>
                <span className="cvc-part coda">{coda}</span>
                <span className="cvc-plus">=</span>
                <strong className="cvc-whole">{blended.word}</strong>
              </div>
              <p className="cvc-meaning">
                {blended.isRealWord ? (
                  <>
                    <CheckCircle2 size={16} className="positive" /> 真词解锁：
                    <strong>{blended.cn}</strong> <span className="phoneme-ipa">{blended.ipa}</span>
                  </>
                ) : (
                  <span>{blended.cn}</span>
                )}
              </p>
              <p className="tiny">{blended.tip}</p>
              {blended.isRealWord && (
                <p className="cvc-example" lang="en">
                  例句：{blended.sentence}
                </p>
              )}
            </div>

            <div className="cvc-result-actions">
              <button
                type="button"
                className="primary"
                onClick={handleBlendSpeak}
              >
                <Volume2 size={18} /> 拼读发音合并
              </button>
              {blended.isRealWord && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => say?.(blended.sentence, 0.85)}
                >
                  <Volume2 size={17} /> 听拼读例句
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === "magic-e" && (
        <div className="workshop-panel magic-e-panel">
          <p className="tiny">
            当词尾加上不发音的<strong>魔法 e (Silent E)</strong>，前面的短元音就会变成读<strong>字母本身的名字（长元音）</strong>！点击下方词对听听看：
          </p>

          <div className="magic-e-grid" role="list" aria-label="Magic E 长短元音对比卡">
            {MAGIC_E_PAIRS.map((pair) => (
              <div
                key={pair.id}
                role="listitem"
                className={`magic-e-card ${activePair.id === pair.id ? "active" : ""}`}
                onClick={() => setActivePairId(pair.id)}
              >
                <span className="magic-e-pattern">{pair.vowelPattern}</span>
                <div className="magic-e-compare">
                  <button
                    type="button"
                    className="magic-word-btn short"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePairId(pair.id);
                      say?.(pair.shortWord, 0.8);
                    }}
                    aria-label={`听短元音词 ${pair.shortWord} ${pair.shortCn}`}
                  >
                    <strong lang="en">{pair.shortWord}</strong>
                    <span className="phoneme-ipa">{pair.shortIpa}</span>
                    <small>{pair.shortCn}</small>
                  </button>

                  <span className="magic-arrow">→ +e →</span>

                  <button
                    type="button"
                    className="magic-word-btn long"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePairId(pair.id);
                      onRecordComplete?.(`phonics-magic-${pair.id}`);
                      say?.(pair.longWord, 0.8);
                    }}
                    aria-label={`听魔法e长元音词 ${pair.longWord} ${pair.longCn}`}
                  >
                    <strong lang="en">{pair.longWord}</strong>
                    <span className="phoneme-ipa">{pair.longIpa}</span>
                    <small>{pair.longCn}</small>
                  </button>
                </div>
                <p className="tiny">{pair.rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
