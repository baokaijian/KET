import { useState, useEffect, useRef } from 'react';
import { playClickSound } from '../utils/audio';

const ENCOURAGING_PHRASES = [
  "Wow! You are doing great! 🌟",
  "English is so much fun! Let's keep going! 🦖",
  "You are a super English learner! 👍",
  "Sparks is so proud of you! ❤️",
  "Double click me to hear me roar! Rawr! 🦕",
  "You've got this! One step at a time! 👣"
];

export default function Mascot({ status = 'idle', customMessage = '', speechRate = 0.85 }) {
  const [message, setMessage] = useState("Hi there! I am Sparks! Let's learn English together! 🦖");
  const [animationClass, setAnimationClass] = useState('animate-float');
  const [blinking, setBlinking] = useState(false);

  const speechRateRef = useRef(speechRate);
  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  // Auto-blink eyes
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // React to status changes
  useEffect(() => {
    if (status === 'correct') {
      const positivePhrases = [
        "Bingo! You are correct! 🎉",
        "Super job! Keep it up! ⭐",
        "Amazing! You got it right! 🏆",
        "You are so smart! 💡"
      ];
      const randomMsg = positivePhrases[Math.floor(Math.random() * positivePhrases.length)];
      
      // Async state update to prevent cascading render warnings
      setTimeout(() => {
        setMessage(randomMsg);
        setAnimationClass('animate-bounce');
      }, 0);
      
      const timer = setTimeout(() => {
        setAnimationClass('animate-float');
      }, 1500);
      return () => clearTimeout(timer);
    } else if (status === 'wrong') {
      const comfortPhrases = [
        "It's okay! Let's try again! 💪",
        "Don't worry, mistakes help us learn! 🚀",
        "Almost! Let's look at this together! 🧐",
        "Let's ask Mum or Dad to help us check! ❤️"
      ];
      const randomMsg = comfortPhrases[Math.floor(Math.random() * comfortPhrases.length)];
      
      // Async state update to prevent cascading render warnings
      setTimeout(() => {
        setMessage(randomMsg);
        setAnimationClass('animate-wiggle');
      }, 0);
      
      const timer = setTimeout(() => {
        setAnimationClass('animate-float');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Handle custom messages passed from parent
  useEffect(() => {
    if (customMessage) {
      // Async state update to prevent cascading render warnings
      setTimeout(() => {
        setMessage(customMessage);
      }, 0);
    }
  }, [customMessage]);

  const handleMascotClick = () => {
    playClickSound();
    const randomIdx = Math.floor(Math.random() * ENCOURAGING_PHRASES.length);
    const text = ENCOURAGING_PHRASES[randomIdx];
    setMessage(text);
    setAnimationClass('animate-bounce');

    setTimeout(() => {
      setAnimationClass('animate-float');
    }, 1500);
  };

  return (
    <div className="flex items-center gap-4 my-1.5 max-w-2xl mx-auto w-full px-4" style={{ zIndex: 10 }}>
      {/* Mascot Graphic (SVG Cute Dinosaur) */}
      <div 
        onClick={handleMascotClick}
        className={`w-14 h-14 shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${animationClass}`}
        title="点击 Sparks 和我聊天吧！"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Shadows */}
          <ellipse cx="50" cy="90" rx="30" ry="8" fill="rgba(0,0,0,0.15)" />

          {/* Tail */}
          <path d="M 25,75 Q 10,75 12,60 Q 15,50 25,60 Z" fill="var(--mascot-color-main)" />
          <path d="M 18,65 Q 12,65 14,58 Q 16,52 18,58 Z" fill="var(--mascot-color-spots)" />

          {/* Spikes on Back */}
          <polygon points="28,45 22,50 30,55" fill="var(--accent)" />
          <polygon points="34,35 28,40 36,45" fill="var(--accent)" />
          <polygon points="42,25 36,30 44,35" fill="var(--accent)" />

          {/* Main Body */}
          <rect x="25" y="40" width="45" height="42" rx="20" fill="var(--mascot-color-main)" />

          {/* Neck & Head */}
          <path d="M 50,50 L 50,25 Q 50,15 65,15 Q 80,15 80,30 Q 80,45 68,45 Z" fill="var(--mascot-color-main)" />

          {/* Yellow Belly */}
          <ellipse cx="50" cy="62" rx="16" ry="18" fill="var(--mascot-color-belly)" />

          {/* Spots on Body */}
          <circle cx="34" cy="55" r="4" fill="var(--mascot-color-spots)" />
          <circle cx="38" cy="70" r="3" fill="var(--mascot-color-spots)" />
          <circle cx="62" cy="72" r="3" fill="var(--mascot-color-spots)" />

          {/* Cute Wings (Fluttering style) */}
          <path 
            d="M 27,55 C 20,50 20,40 27,45 C 29,46 31,50 30,55 Z" 
            fill="var(--accent)"
            transform={status === 'correct' ? 'rotate(-10 27 50)' : 'none'}
            style={{ transformOrigin: '27px 50px', transition: 'transform 0.2s' }}
          />

          {/* Face Elements */}
          {/* Eyes */}
          {status === 'correct' ? (
            // Happy closed smile eyes
            <>
              <path d="M 62,25 Q 66,21 70,25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 72,25 Q 76,21 80,25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : status === 'wrong' ? (
            // Sympathetic curved downward eyes
            <>
              <path d="M 62,24 Q 66,28 70,24" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 72,24 Q 76,28 80,24" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Little teardrop */}
              <circle cx="60" cy="30" r="1.5" fill="#60a5fa" />
            </>
          ) : blinking ? (
            // Blinking closed line eyes
            <>
              <line x1="62" y1="25" x2="70" y2="25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="72" y1="25" x2="80" y2="25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            // Big open cartoon eyes
            <>
              {/* Left Eye */}
              <circle cx="66" cy="25" r="4.5" fill="white" />
              <circle cx="67" cy="24" r="2.5" fill="#1e293b" />
              <circle cx="68.5" cy="22.5" r="1" fill="white" />
              {/* Right Eye */}
              <circle cx="76" cy="25" r="4.5" fill="white" />
              <circle cx="77" cy="24" r="2.5" fill="#1e293b" />
              <circle cx="78.5" cy="22.5" r="1" fill="white" />
            </>
          )}

          {/* Blush Cheeks */}
          <ellipse cx="60" cy="30" rx="3.5" ry="2" fill="#fda4af" opacity="0.8" />
          <ellipse cx="80" cy="30" rx="3.5" ry="2" fill="#fda4af" opacity="0.8" />

          {/* Snout and Smile */}
          <path d="M 70,32 Q 78,32 78,35 Q 78,40 70,40 Z" fill="var(--mascot-color-main)" />
          {status === 'wrong' ? (
            // Sad straight mouth
            <line x1="71" y1="36" x2="77" y2="36" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          ) : (
            // Happy smile mouth
            <path d="M 72,35 Q 75,39 77,35" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Feet */}
          <rect x="36" y="80" width="8" height="12" rx="4" fill="var(--mascot-color-main)" />
          <rect x="56" y="80" width="8" height="12" rx="4" fill="var(--mascot-color-main)" />
          <circle cx="40" cy="91" r="4" fill="var(--mascot-color-spots)" />
          <circle cx="60" cy="91" r="4" fill="var(--mascot-color-spots)" />
        </svg>
      </div>

      {/* Speech Bubble */}
      <div className="speech-bubble-left animate-pulse-slow">
        {message}
        {/* Triangle arrow for bubble */}
        <div className="speech-bubble-left-arrow">
          <div className="speech-bubble-left-arrow-inner"></div>
        </div>
      </div>
    </div>
  );
}
