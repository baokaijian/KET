import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class FakeAudioParam {
  constructor() {
    this.setValueAtTime = vi.fn();
    this.linearRampToValueAtTime = vi.fn();
    this.exponentialRampToValueAtTime = vi.fn();
  }
}

class FakeAudioNode {
  constructor() {
    this.connect = vi.fn();
    this.start = vi.fn();
    this.stop = vi.fn();
    this.frequency = new FakeAudioParam();
    this.gain = new FakeAudioParam();
    this.type = "";
  }
}

function createFakeAudioContext() {
  return {
    currentTime: 10,
    destination: {},
    state: "running",
    resume: vi.fn(),
    createOscillator: vi.fn(() => new FakeAudioNode()),
    createGain: vi.fn(() => new FakeAudioNode()),
  };
}

async function loadAudioModule(fakeContext, speechSynthesis) {
  vi.resetModules();

  vi.stubGlobal("window", {
    AudioContext: vi.fn(function AudioContextMock() {
      return fakeContext;
    }),
    webkitAudioContext: vi.fn(function WebkitAudioContextMock() {
      return fakeContext;
    }),
    speechSynthesis,
  });

  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(text) {
        this.text = text;
        this.lang = "";
        this.rate = 1;
        this.voice = null;
        this.onend = null;
        this.onerror = null;
      }
    },
  );

  return import("../../src/utils/audio.js");
}

describe("audio effects", () => {
  let fakeContext;
  let speechSynthesis;

  beforeEach(() => {
    vi.useFakeTimers();
    fakeContext = createFakeAudioContext();
    speechSynthesis = {
      speaking: false,
      pending: false,
      paused: false,
      cancel: vi.fn(),
      resume: vi.fn(),
      speak: vi.fn((utterance) => utterance.onend?.()),
      getVoices: vi.fn(() => [
        { lang: "en-US", name: "Google US English" },
        { lang: "zh-CN", name: "Google 普通话" },
      ]),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("creates oscillator based sound effects without throwing", async () => {
    const {
      playClickSound,
      playCorrectSound,
      playIncorrectSound,
      playVictoryFanfare,
    } = await loadAudioModule(fakeContext, speechSynthesis);

    expect(() => playClickSound()).not.toThrow();
    expect(() => playCorrectSound()).not.toThrow();
    expect(() => playIncorrectSound()).not.toThrow();
    expect(() => playVictoryFanfare()).not.toThrow();

    expect(fakeContext.createOscillator).toHaveBeenCalledTimes(9);
    expect(fakeContext.createGain).toHaveBeenCalledTimes(9);
  });

  it("uses English TTS by default and respects rate", async () => {
    const { speakText } = await loadAudioModule(fakeContext, speechSynthesis);

    speakText("apple", 0.72);
    await vi.advanceTimersByTimeAsync(121);

    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1);
    const utterance = speechSynthesis.speak.mock.calls[0][0];
    expect(utterance.text).toBe("apple");
    expect(utterance.lang).toBe("en-US");
    expect(utterance.rate).toBe(0.72);
    expect(utterance.voice?.lang).toBe("en-US");
  });

  it("uses Chinese TTS for Chinese text or explicit zh-CN language", async () => {
    const { speakText } = await loadAudioModule(fakeContext, speechSynthesis);

    speakText("苹果", 0.8);
    await vi.advanceTimersByTimeAsync(121);
    speakText("apple meaning", 0.8, null, "zh-CN");
    await vi.advanceTimersByTimeAsync(121);

    expect(speechSynthesis.speak).toHaveBeenCalledTimes(2);
    expect(speechSynthesis.speak.mock.calls[0][0].lang).toBe("zh-CN");
    expect(speechSynthesis.speak.mock.calls[1][0].lang).toBe("zh-CN");
  });

  it("does not speak empty text", async () => {
    const { speakText } = await loadAudioModule(fakeContext, speechSynthesis);

    speakText("   ");
    await vi.advanceTimersByTimeAsync(200);

    expect(speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it.each([undefined, null, {}])("rejects an unavailable or incomplete speech API without throwing (%s)", async (api) => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { speakText } = await loadAudioModule(fakeContext, api);
    expect(speakText("今天先听一听。", 0.9, null, "zh-CN")).toBe(false);
    await vi.advanceTimersByTimeAsync(5000);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("honors explicit British English and does not replace it with a US voice", async () => {
    const { speakText } = await loadAudioModule(fakeContext, speechSynthesis);
    speakText("banana", 0.85, null, "en-GB");
    await vi.advanceTimersByTimeAsync(121);
    expect(speechSynthesis.speak.mock.calls[0][0].lang).toBe("en-GB");
    expect(speechSynthesis.speak.mock.calls[0][0].voice).toBeNull();
  });
  it("cancels superseded clicks and stops pending speech when leaving a page", async () => {
    const { speakText, stopSpeech } = await loadAudioModule(
      fakeContext,
      speechSynthesis,
    );
    speakText("apple");
    speakText("banana");
    await vi.advanceTimersByTimeAsync(121);
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1);
    expect(speechSynthesis.speak.mock.calls[0][0].text).toBe("banana");
    speakText("bread");
    stopSpeech();
    await vi.advanceTimersByTimeAsync(121);
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });
  it("reports speech failures to the caller without treating cancellation as failure", async () => {
    speechSynthesis.speak = vi.fn();
    const { speakText } = await loadAudioModule(fakeContext, speechSynthesis);
    const onError = vi.fn();
    speakText("milk", 0.85, null, "en-GB", onError);
    await vi.advanceTimersByTimeAsync(121);
    const utterance = speechSynthesis.speak.mock.calls[0][0];
    utterance.onerror({ error: "interrupted" });
    expect(onError).not.toHaveBeenCalled();
    utterance.onerror({ error: "synthesis-failed" });
    expect(onError).toHaveBeenCalledWith("synthesis-failed");
  });
  it("reports silent start and finish failures once, never as successful listening", async () => {
    speechSynthesis.speak = vi.fn();
    const { speakText } = await loadAudioModule(fakeContext, speechSynthesis);
    const onEnd = vi.fn();
    const onError = vi.fn();
    speakText("milk", 0.8, onEnd, "en-GB", onError);
    await vi.advanceTimersByTimeAsync(4121);
    expect(onError).toHaveBeenCalledExactlyOnceWith("speech-timeout");
    const first = speechSynthesis.speak.mock.calls[0][0];
    first.onend();
    expect(onEnd).not.toHaveBeenCalled();
    onError.mockClear();
    speakText("apple", 0.8, onEnd, "en-GB", onError);
    await vi.advanceTimersByTimeAsync(121);
    const second = speechSynthesis.speak.mock.calls[1][0];
    second.onstart();
    await vi.advanceTimersByTimeAsync(10001);
    expect(onError).toHaveBeenCalledExactlyOnceWith("speech-timeout");
    expect(onEnd).not.toHaveBeenCalled();
  });
  it("clears watchdogs on stop, replacement and thrown synthesis errors", async () => {
    speechSynthesis.speak = vi.fn();
    const { speakText, stopSpeech } = await loadAudioModule(fakeContext, speechSynthesis);
    const onError = vi.fn();
    speakText("milk", 0.8, null, "en-GB", onError);
    await vi.advanceTimersByTimeAsync(121);
    stopSpeech();
    await vi.advanceTimersByTimeAsync(5000);
    expect(onError).not.toHaveBeenCalled();
    speechSynthesis.speak = vi.fn(() => { throw new Error("broken device"); });
    speakText("milk", 0.8, null, "en-GB", onError);
    await vi.advanceTimersByTimeAsync(5121);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
