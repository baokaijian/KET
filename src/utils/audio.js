// Web Audio API synthesizer for child-friendly sound effects (zero-asset, works offline)

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Play correct answer chime (cheerful ascending notes)
export const playCorrectSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator and gain
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";

    // E5 -> G5 -> C6 ascending notes
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
    osc.frequency.setValueAtTime(1046.5, now + 0.2); // C6

    // Smooth volume fade
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    console.warn("AudioContext not supported or blocked:", e);
  }
};

// 2. Play incorrect answer buzzer (gentle sliding warning tone)
export const playIncorrectSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "triangle";

    // Slid down from 220Hz (A3) to 147Hz (D3)
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(147, now + 0.25);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn("AudioContext not supported or blocked:", e);
  }
};

// 3. Play victory fanfare (trumpet-like celebration)
export const playVictoryFanfare = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 523.25]; // C4, E4, G4, C5, G4, C5
    const durations = [0.1, 0.1, 0.1, 0.15, 0.1, 0.4];

    let currentStart = now;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, currentStart);

      gain.gain.setValueAtTime(0, currentStart);
      gain.gain.linearRampToValueAtTime(0.1, currentStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        currentStart + durations[idx] - 0.02,
      );

      osc.start(currentStart);
      osc.stop(currentStart + durations[idx]);

      currentStart += durations[idx] - 0.03;
    });
  } catch (e) {
    console.warn("AudioContext not supported or blocked:", e);
  }
};

// 4. Play soft click bubble sound
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    console.warn("AudioContext not supported or blocked:", e);
  }
};

// 5. Speech Synthesis wrapper for KET vocabulary and listening questions

function findBestVoice(lang) {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  if (lang === "zh-CN") {
    // Priority: Google zh-CN > Apple zh-CN (Tingting/Liting/Xiaoxiao) > any zh-CN voice > any zh voice
    return (
      voices.find((v) => {
        const l = v.lang.toLowerCase().replace("_", "-");
        return l === "zh-cn" && v.name.includes("Google");
      }) ||
      voices.find((v) => {
        const l = v.lang.toLowerCase().replace("_", "-");
        return (
          l === "zh-cn" &&
          (v.name.includes("Tingting") ||
            v.name.includes("Liting") ||
            v.name.includes("Xiaoxiao") ||
            v.name.includes("Huihui"))
        );
      }) ||
      voices.find((v) => {
        const l = v.lang.toLowerCase().replace("_", "-");
        return l === "zh-cn";
      }) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("zh")) ||
      null
    );
  }
  // English
  // Do not override the requested accent with an unrelated English voice.
  return (
    voices.find(
      (v) =>
        v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase() &&
        v.name.includes("Google"),
    ) ||
    voices.find(
      (v) => v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase(),
    ) ||
    null
  );
}

const activeUtterances = new Set();
let speechTimer = null;
let speechGeneration = 0;

export function stopSpeech() {
  clearTimeout(speechTimer);
  speechTimer = null;
  speechGeneration += 1;
  activeUtterances.clear();
  if (typeof window !== "undefined" && window.speechSynthesis)
    window.speechSynthesis.cancel();
}

export const speakText = (
  text,
  rate = 0.8,
  onEnd = null,
  lang = null,
  onError = null,
) => {
  if (!("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis API not supported in this browser.");
    return false;
  }
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return false;
  }

  try {
    clearTimeout(speechTimer);
    const generation = ++speechGeneration;
    if (
      window.speechSynthesis.speaking ||
      window.speechSynthesis.pending ||
      activeUtterances.size
    ) {
      window.speechSynthesis.cancel();
    }
    activeUtterances.clear();

    // Ensure speech synthesis is not stuck in a paused state
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Chrome has a known race condition: calling speak() immediately after cancel()
    // may silently swallow the new utterance. A 120ms delay fixes this reliably.
    speechTimer = setTimeout(() => {
      if (generation !== speechGeneration) return;
      speechTimer = null;
      try {
        const utterance = new SpeechSynthesisUtterance(text.trim());

        // Auto-detect Chinese if not explicitly specified
        utterance.lang =
          lang || (/[\u4e00-\u9fa5]/.test(text) ? "zh-CN" : "en-US");
        utterance.rate = Math.min(1.2, Math.max(0.5, Number(rate) || 0.8));

        const bestVoice = findBestVoice(utterance.lang);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        activeUtterances.add(utterance);
        utterance.onend = () => {
          activeUtterances.delete(utterance);
          if (generation === speechGeneration && onEnd) onEnd();
        };
        utterance.onerror = (event) => {
          activeUtterances.delete(utterance);
          // 'interrupted' is normal when cancel() is called, not a real error
          if (
            generation === speechGeneration &&
            !["interrupted", "canceled"].includes(event.error)
          ) {
            console.warn("Speech synthesis error:", event.error);
            onError?.(event.error);
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (innerErr) {
        console.error("Speech synthesis inner error:", innerErr);
        onError?.(innerErr);
      }
    }, 120);
    return true;
  } catch (e) {
    console.error("Speech synthesis failed:", e);
    onError?.(e);
    return false;
  }
};
