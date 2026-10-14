import { useState } from "react";
import { Volume2 } from "lucide-react";
import { playClickSound } from "../utils/audio.js";

const ENCOURAGING_PHRASES = [
  {
    en: "You are doing great!",
    zh: "嗨！我是小恐龙 Sparks，今天一起快乐玩拼读、读故事吧！",
  },
  {
    en: "Listen first, then blend the blocks!",
    zh: "不用死记硬背字母，先听声音，再点彩色积木就能拼出单词啦！",
  },
  {
    en: "Every story is an adventure!",
    zh: "读故事遇到不认识的词？用小手点一下单词，我来读给你听！",
  },
  {
    en: "One small step every day!",
    zh: "每完成一个小练习，都有机会去成长记录里解锁新的魔法贴纸哦！",
  },
];

const STATUS_MESSAGES = {
  correct: "答对啦！Sparks 为你欢呼，继续往前探索吧！🎉",
  wrong: "没关系，犯错也是学习的一部分，我们听一听再试一次！💪",
};

export default function Mascot({ status = "idle", customMessage = "", say }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const current = ENCOURAGING_PHRASES[phraseIndex % ENCOURAGING_PHRASES.length];
  const displayMessage =
    customMessage || STATUS_MESSAGES[status] || current.zh;

  function handleMascotClick() {
    playClickSound();
    const nextIdx = (phraseIndex + 1) % ENCOURAGING_PHRASES.length;
    setPhraseIndex(nextIdx);
  }

  return (
    <aside className={`mascot-banner status-${status}`} aria-label="小恐龙学习伙伴 Sparks">
      <button
        type="button"
        onClick={handleMascotClick}
        className="mascot-avatar-btn"
        aria-label="和小恐龙 Sparks 互动换一句鼓励"
        title="点击小恐龙换一句贴心鼓励"
      >
        <svg viewBox="0 0 100 100" className="mascot-svg" aria-hidden="true">
          <ellipse cx="50" cy="90" rx="28" ry="7" fill="rgba(0,0,0,0.1)" />
          <path d="M 25,75 Q 10,75 12,60 Q 15,50 25,60 Z" fill="#2f8f5b" />
          <polygon points="28,45 22,50 30,55" fill="#f59e0b" />
          <polygon points="34,35 28,40 36,45" fill="#f59e0b" />
          <polygon points="42,25 36,30 44,35" fill="#f59e0b" />
          <rect x="25" y="40" width="45" height="42" rx="20" fill="#2f8f5b" />
          <path d="M 50,50 L 50,25 Q 50,15 65,15 Q 80,15 80,30 Q 80,45 68,45 Z" fill="#2f8f5b" />
          <ellipse cx="50" cy="62" rx="15" ry="17" fill="#fef08a" />
          <circle cx="35" cy="56" r="3.5" fill="#86efac" />
          <circle cx="39" cy="70" r="2.8" fill="#86efac" />
          {status === "correct" ? (
            <>
              <path d="M 62,25 Q 66,21 70,25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 72,25 Q 76,21 80,25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="66" cy="25" r="4" fill="white" />
              <circle cx="67" cy="24" r="2.2" fill="#1e293b" />
              <circle cx="76" cy="25" r="4" fill="white" />
              <circle cx="77" cy="24" r="2.2" fill="#1e293b" />
            </>
          )}
          <ellipse cx="60" cy="30" rx="3" ry="1.8" fill="#fda4af" opacity="0.85" />
          <ellipse cx="80" cy="30" rx="3" ry="1.8" fill="#fda4af" opacity="0.85" />
          <path d="M 71,35 Q 75,39 78,35" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <rect x="36" y="80" width="8" height="11" rx="4" fill="#2f8f5b" />
          <rect x="56" y="80" width="8" height="11" rx="4" fill="#2f8f5b" />
        </svg>
      </button>
      <div className="mascot-bubble">
        <p className="mascot-text">{displayMessage}</p>
        <span className="mascot-en" lang="en">{current.en}</span>
      </div>
      {say && (
        <button
          type="button"
          className="icon-button"
          aria-label="听小恐龙英文鼓励"
          title="听小恐龙英文鼓励"
          onClick={() => say(current.en, 0.85)}
        >
          <Volume2 size={18} />
        </button>
      )}
    </aside>
  );
}
