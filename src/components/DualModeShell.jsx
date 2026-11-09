import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Headphones,
  Home,
  Pause,
  Play,
  RotateCcw,
  Shield,
  SkipForward,
  Sparkles,
  Star,
  Users,
  Volume2,
} from "lucide-react";
import WordIllustration from "./WordIllustration.jsx";
import StickerBook from "./StickerBook.jsx";
import { getSpeakableWordText } from "../utils/speechText.js";
import { getPhonicsBreakdown } from "../data/phonics.js";
import {
  playClickSound,
  playCorrectSound,
  playGentlePromptSound,
  playVictoryFanfare,
  stopSpeech,
} from "../utils/audio.js";
import { buildDailyPlan, planReadingLessons } from "../utils/dailyPlan.js";
import {
  evaluateModeRecommendation,
  localDay,
  recordAnswer,
  recordEncounter,
  recordModeSession,
  updateProfile,
} from "../utils/learningProgress.js";
import { getColearnScriptForStage, THEME_COLEARN_GUIDES } from "../data/colearn-scripts.js";

const THEME_EMOJIS = {
  breakfast: "🍎",
  animals: "🐾",
  school: "🏫",
  family: "👨‍👩‍👧",
  home: "🏠",
  park: "🌳",
  clothes: "👕",
  body: "🖐️",
  weather: "🌤️",
  shopping: "🛒",
  travel: "🚌",
  day: "🌙",
};

export function ModeSelectorCard({ onSelectMode, say }) {
  function speakModeIntro() {
    say?.(
      "自己学，小恐龙会告诉你每一步。一起学，爸爸妈妈会拿到小提示。",
      0.9,
      undefined,
      undefined,
      "zh-CN",
    );
  }

  return (
    <section className="mode-selector-card" aria-label="学习模式选择">
      <div className="mode-selector-mascot">
        <svg viewBox="0 0 100 100" className="mascot-svg waving-dino" aria-hidden="true">
          <ellipse cx="50" cy="90" rx="28" ry="7" fill="rgba(0,0,0,0.1)" />
          <path d="M 25,75 Q 10,75 12,60 Q 15,50 25,60 Z" fill="#2f8f5b" />
          <polygon points="28,45 22,50 30,55" fill="#f59e0b" />
          <polygon points="34,35 28,40 36,45" fill="#f59e0b" />
          <polygon points="42,25 36,30 44,35" fill="#f59e0b" />
          <rect x="25" y="40" width="45" height="42" rx="20" fill="#2f8f5b" />
          <path d="M 50,50 L 50,25 Q 50,15 65,15 Q 80,15 80,30 Q 80,45 68,45 Z" fill="#2f8f5b" />
          <ellipse cx="50" cy="62" rx="15" ry="17" fill="#fef08a" />
          <circle cx="66" cy="25" r="4" fill="white" />
          <circle cx="67" cy="24" r="2.2" fill="#1e293b" />
          <circle cx="76" cy="25" r="4" fill="white" />
          <circle cx="77" cy="24" r="2.2" fill="#1e293b" />
          <path d="M 71,35 Q 75,39 78,35" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <rect x="36" y="80" width="8" height="11" rx="4" fill="#2f8f5b" />
          <rect x="56" y="80" width="8" height="11" rx="4" fill="#2f8f5b" />
        </svg>
        <div>
          <span className="eyebrow">ZERO-LITERACY DUAL MODE · 6 岁启蒙双模式</span>
          <h2>今天想怎么玩英语？</h2>
        </div>
      </div>

      <div className="mode-selector-buttons">
        <button
          type="button"
          className="mode-choice-btn solo-choice"
          aria-label="我自己学"
          onClick={() => onSelectMode("solo")}
        >
          <span className="mode-emoji" aria-hidden="true">🧒</span>
          <strong>我自己学</strong>
          <small>小恐龙语音带学 · 零识字大图标</small>
        </button>

        <button
          type="button"
          className="mode-choice-btn colearn-choice"
          aria-label="一起学"
          onClick={() => onSelectMode("colearn")}
        >
          <span className="mode-emoji" aria-hidden="true">👨‍👦</span>
          <strong>一起学</strong>
          <small>和爸爸妈妈一起 · 附带家长台词卡</small>
        </button>
      </div>

      <div className="mode-selector-footer">
        <button
          type="button"
          className="quiet-button mode-listen-btn"
          aria-label="听一听模式说明"
          onClick={speakModeIntro}
        >
          <Volume2 size={20} /> 听一听
        </button>
      </div>
    </section>
  );
}

export default function DualModeShell({
  mode,
  progress,
  update,
  curriculum,
  say,
  onOpenParentCenter,
  onSwitchMode,
  customStuckWords,
  onClearCustomStuckWords,
}) {
  const isColearn = mode === "colearn";
  const hideChinese = Boolean(progress.profile?.hideChinese);

  // Session tracking for modeSessions
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "ms-initial",
  );
  const [sessionStartedAt] = useState(() => new Date().toISOString());
  const sessionStartMs = useRef(0);
  useEffect(() => {
    sessionStartMs.current = new Date().getTime();
  }, []);
  const [tasksCompletedInSession, setTasksCompletedInSession] = useState(0);
  const [wordsSeenInSession, setWordsSeenInSession] = useState(0);
  const [parentPromptsShown, setParentPromptsShown] = useState(isColearn ? 1 : 0);
  const [interventions, setInterventions] = useState(0);
  const [childUtterances, setChildUtterances] = useState(0);
  const [interruptions, setInterruptions] = useState(0);

  // Co-learn specific states
  const [colearnPhase, setColearnPhase] = useState(isColearn ? "intro" : "active");
  const [simplerMode, setSimplerMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [parentDrawerOpen, setParentDrawerOpen] = useState(true);
  const [peekAnswerVisible, setPeekAnswerVisible] = useState(false);
  const [peekAnswerCount, setPeekAnswerCount] = useState(0);
  const [overInterventionWarning, setOverInterventionWarning] = useState(false);
  const [waitFiveSecPrompt, setWaitFiveSecPrompt] = useState(false);

  // Child view navigation: "home" | "task" | "album" | "stickers" | "mode_picker"
  const [view, setView] = useState(customStuckWords?.length ? "task" : "home");
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);

  // Task internal states: "learn" | "sentences" | "story" | "quiz" | "result"
  const [taskStage, setTaskStage] = useState("learn");
  const [itemIndex, setItemIndex] = useState(0);
  const [meaningRevealed, setMeaningRevealed] = useState(false);
  const [bouncingLetters, setBouncingLetters] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [reducedOptions, setReducedOptions] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null); // null | "correct" | "retry1" | "retry2" | "reveal"
  const [sentencePage, setSentencePage] = useState(0);
  const [storyPeekWord, setStoryPeekWord] = useState(null);
  const [idlePulse, setIdlePulse] = useState(false);
  const [sessionMistakes, setSessionMistakes] = useState([]);
  const [lockedWords, setLockedWords] = useState(null);

  // Long press home icon for 2s to switch mode
  const homePressTimer = useRef(null);
  const questionPressTimer = useRef(null);
  const announcedRef = useRef(false);

  const plan = curriculum?.childThemes ? buildDailyPlan(progress, curriculum, new Date()) : null;
  const theme =
    curriculum?.childThemes?.find((item) => item.id === plan?.themeId) ||
    curriculum?.childThemes?.[0];

  // Filter words strictly to verified images (G5/M2 gate: 无图词不得进入儿童端)
  const rawPlanWords = customStuckWords?.length
    ? customStuckWords
    : (plan?.newWords || [])
        .map((id) => curriculum?.courseWordById?.[id])
        .filter(Boolean);
  const verifiedThemeWords = (theme?.vocabulary?.words || []).filter((w) => w?.image);
  const baseWords = (rawPlanWords.length ? rawPlanWords : verifiedThemeWords).filter((w) => w?.image);
  const computedWords = simplerMode ? baseWords.slice(0, 4) : baseWords.slice(0, 8);
  const activeWords = view === "task" && lockedWords?.length ? lockedWords : computedWords;

  const lessonById = Object.fromEntries(
    (curriculum?.childLessons || []).map((lesson) => [lesson.id, lesson]),
  );
  const readingPlan =
    plan && theme ? planReadingLessons(plan, theme, lessonById) : { sentences: null, story: null };
  const sentencesLesson = readingPlan.sentences || theme?.sentences;
  const storyLesson = readingPlan.story || theme?.story;

  // Build 4 daily tasks for the 4 bottom dots
  const dailyTasks = [
    {
      id: "new-words",
      shortTitle: "认识新词",
      voiceIntro: `今天我们认识 ${activeWords.length} 个新朋友。`,
      voiceStep: "看图，听一听这个词。",
      type: "vocabulary",
      done: activeWords.length > 0 && activeWords.every((w) => progress.seen.includes(w.id)),
    },
    {
      id: "sentences",
      shortTitle: "听读句子",
      voiceIntro: "听一听短句，点小喇叭跟读。",
      voiceStep: "点小喇叭，听句子。",
      type: "sentences",
      done: Boolean(sentencesLesson && progress.completed.includes(sentencesLesson.id)),
    },
    {
      id: "story",
      shortTitle: "阅读故事",
      voiceIntro: "一起来听今天的小故事。",
      voiceStep: "点单词可以看图和听发音。",
      type: "story",
      done: Boolean(storyLesson && progress.completed.includes(storyLesson.id)),
    },
    {
      id: "review",
      shortTitle: "找一找",
      voiceIntro: "听声音，把认识的朋友找出来。",
      voiceStep: "听一听，点正确的图片。",
      type: "quiz_only",
      done: tasksCompletedInSession >= 1,
    },
  ];

  const currentTask = dailyTasks[activeTaskIndex] || dailyTasks[0];
  const currentWord = activeWords[itemIndex] || activeWords[0];

  // Build 3-choice picture/word questions for activeWords
  const quizQuestions = activeWords.map((word, idx) => {
    const pool = verifiedThemeWords.filter((w) => w.id !== word.id);
    const d1 = pool[idx % Math.max(1, pool.length)] || activeWords[(idx + 1) % activeWords.length] || word;
    const d2 =
      pool[(idx + 1) % Math.max(1, pool.length)] ||
      activeWords[(idx + 2) % activeWords.length] ||
      word;
    const rawChoices = [word, d1, d2].filter(
      (item, pos, self) => item && self.findIndex((x) => x.id === item.id) === pos,
    );
    const ordered = [
      ...rawChoices.slice(idx % rawChoices.length),
      ...rawChoices.slice(0, idx % rawChoices.length),
    ];
    return {
      id: `child-quiz-${word.id}`,
      wordId: word.id,
      targetWord: word,
      options: ordered,
      answerIndex: ordered.findIndex((o) => o.id === word.id),
    };
  });

  const currentQuiz = quizQuestions[itemIndex] || quizQuestions[0];

  // 1.5s initial auto-broadcast in Solo mode (once per session, M1 rule 1)
  useEffect(() => {
    if (announcedRef.current || isColearn || view !== "home" || !activeWords.length) return undefined;
    const timer = setTimeout(() => {
      announcedRef.current = true;
      say?.(`今天我们认识 ${activeWords.length} 个新朋友。`, 0.9, undefined, undefined, "zh-CN");
    }, 400);
    return () => clearTimeout(timer);
  }, [isColearn, view, activeWords.length, say]);

  // 10s / 45s / 90s inactivity guidance in Solo/Colearn child shell (5.2 & 5.3)
  useEffect(() => {
    if (paused || colearnPhase !== "active" || !["home", "task"].includes(view)) return undefined;
    const tReset = setTimeout(() => setIdlePulse(false), 0);
    const t10 = setTimeout(() => {
      setIdlePulse(true);
      if (!isColearn) {
        say?.("点下面的大按钮。", 0.9, undefined, undefined, "zh-CN");
      }
    }, 10_000);
    const t45 = setTimeout(() => {
      if (view === "home") {
        say?.("点下面的大按钮。", 0.9, undefined, undefined, "zh-CN");
      }
    }, 45_000);
    const t90 = setTimeout(() => {
      stopSpeech();
    }, 90_000);
    return () => {
      clearTimeout(tReset);
      clearTimeout(t10);
      clearTimeout(t45);
      clearTimeout(t90);
    };
  }, [paused, colearnPhase, view, taskStage, itemIndex, isColearn, say]);

  function persistCurrentModeSession(endedBy = "child", extra = {}) {
    const nowMs = new Date().getTime();
    const durationSec = Math.max(1, Math.round((nowMs - (sessionStartMs.current || nowMs)) / 1000));
    update((p) =>
      recordModeSession(p, {
        id: sessionId,
        day: localDay(),
        mode: isColearn ? "colearn" : "solo",
        startedAt: sessionStartedAt,
        durationSec,
        tasksCompleted: extra.tasksCompleted ?? tasksCompletedInSession,
        wordsSeen: extra.wordsSeen ?? wordsSeenInSession,
        parentPromptsShown,
        interventions: extra.interventions ?? interventions,
        childUtterances: extra.childUtterances ?? childUtterances,
        interruptions: extra.interruptions ?? interruptions,
        endedBy,
      }),
    );
  }

  function startSelectedTask(taskIdx = activeTaskIndex) {
    if (paused) return;
    playClickSound();
    const task = dailyTasks[taskIdx] || dailyTasks[0];
    setLockedWords(computedWords);
    setActiveTaskIndex(taskIdx);
    setItemIndex(0);
    setMeaningRevealed(false);
    setWrongCount(0);
    setReducedOptions(false);
    setFeedbackState(null);
    setSentencePage(0);
    setStoryPeekWord(null);
    setPeekAnswerVisible(false);
    setWaitFiveSecPrompt(false);

    if (task.type === "vocabulary") {
      setTaskStage("learn");
      setView("task");
      const firstWord = activeWords[0];
      if (firstWord) {
        if (!isColearn) {
          say?.("看图，听一听这个词。", 0.9, () => {
            say?.(getSpeakableWordText(firstWord), 0.85);
          }, undefined, "zh-CN");
        } else {
          say?.(getSpeakableWordText(firstWord), 0.8);
        }
      }
    } else if (task.type === "sentences") {
      setTaskStage("sentences");
      setView("task");
      const firstSentence = sentencesLesson?.guide?.sentences?.[0]?.[0];
      if (firstSentence) say?.(firstSentence, 0.8);
    } else if (task.type === "story") {
      setTaskStage("story");
      setView("task");
    } else {
      setTaskStage("quiz");
      setView("task");
      const firstQuiz = quizQuestions[0];
      if (firstQuiz) say?.(getSpeakableWordText(firstQuiz.targetWord), 0.8);
    }
    if (isColearn) setParentPromptsShown((c) => c + 1);
  }

  function handleListenWordSlow() {
    if (paused || !currentWord) return;
    setBouncingLetters(true);
    setMeaningRevealed(true);
    say?.(
      getSpeakableWordText(currentWord),
      0.65,
      () => setBouncingLetters(false),
      () => setBouncingLetters(false),
    );
    setTimeout(() => setBouncingLetters(false), 1800);
  }

  function handleNextLearnCard() {
    if (paused || !currentWord) return;
    playClickSound();
    stopSpeech();
    update((p) => recordEncounter(p, currentWord.id));
    setWordsSeenInSession((c) => c + 1);
    setMeaningRevealed(false);
    setPeekAnswerVisible(false);
    if (isColearn) setParentPromptsShown((c) => c + 1);

    if (itemIndex + 1 < activeWords.length) {
      const nextWord = activeWords[itemIndex + 1];
      setItemIndex(itemIndex + 1);
      if (nextWord) say?.(getSpeakableWordText(nextWord), 0.85);
    } else {
      // Automatically enter 3-choice "找一找" quiz (M2 flow)
      setTaskStage("quiz");
      setItemIndex(0);
      setWrongCount(0);
      setReducedOptions(false);
      setFeedbackState(null);
      const firstQ = quizQuestions[0];
      if (firstQ) say?.(getSpeakableWordText(firstQ.targetWord), 0.85);
    }
  }

  function handlePrevLearnCard() {
    if (paused || itemIndex <= 0) return;
    playClickSound();
    stopSpeech();
    setMeaningRevealed(false);
    setItemIndex(itemIndex - 1);
  }

  function advanceQuizOrComplete() {
    setWrongCount(0);
    setReducedOptions(false);
    setFeedbackState(null);
    setPeekAnswerVisible(false);
    setWaitFiveSecPrompt(false);

    if (itemIndex + 1 < quizQuestions.length) {
      const nextQ = quizQuestions[itemIndex + 1];
      setItemIndex(itemIndex + 1);
      if (nextQ) say?.(getSpeakableWordText(nextQ.targetWord), 0.85);
    } else {
      finishTask();
    }
  }

  function finishTask() {
    const nextCompletedCount = tasksCompletedInSession + 1;
    setTasksCompletedInSession(nextCompletedCount);
    setTaskStage("result");
    playVictoryFanfare();
    try {
      confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
    } catch {
      // Ignore canvas error in headless environment
    }
    if (!isColearn) {
      say?.(
        nextCompletedCount >= 2 ? "完成啦！要不要休息一下？" : "完成啦！你收集了新朋友。",
        0.9,
        undefined,
        undefined,
        "zh-CN",
      );
    }
    persistCurrentModeSession("child", { tasksCompleted: nextCompletedCount });
  }

  function handleQuizChoice(optionWord) {
    if (paused || !currentQuiz || feedbackState === "correct" || feedbackState === "reveal") return;
    const isCorrect = optionWord.id === currentQuiz.targetWord.id;

    if (isCorrect) {
      playCorrectSound();
      setFeedbackState("correct");
      setWaitFiveSecPrompt(false);
      update((p) =>
        recordAnswer(p, currentQuiz.wordId, true, new Date(), {
          skill: "listening",
          hinted: wrongCount > 0 || reducedOptions || peekAnswerVisible,
        }),
      );
      say?.("Great!", 0.9);
      setTimeout(() => {
        advanceQuizOrComplete();
      }, 900);
      return;
    }

    // Wrong answer degradation strategy (M2 & B7):
    // 1st wrong -> keep 3 options, gentle chime, glow correct card, speak "再听一次。"
    // 2nd wrong -> reduce to 2 options (2 选 1), speak "我们一起看。" + read target word
    // 3rd wrong -> directly show correct answer + read it, mark needsReview
    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    playGentlePromptSound();
    if (!sessionMistakes.some((w) => w.id === currentQuiz.targetWord.id)) {
      setSessionMistakes((prev) => [...prev, currentQuiz.targetWord]);
    }

    if (nextWrong === 1) {
      setFeedbackState("retry1");
      if (isColearn) setWaitFiveSecPrompt(true);
      say?.("再听一次。", 0.9, () => {
        say?.(getSpeakableWordText(currentQuiz.targetWord), 0.75);
      }, undefined, "zh-CN");
    } else if (nextWrong === 2) {
      setFeedbackState("retry2");
      setReducedOptions(true);
      say?.("我们一起看。", 0.9, () => {
        say?.(getSpeakableWordText(currentQuiz.targetWord), 0.7);
      }, undefined, "zh-CN");
    } else {
      setFeedbackState("reveal");
      update((p) =>
        recordAnswer(p, currentQuiz.wordId, false, new Date(), {
          skill: "listening",
          hinted: true,
        }),
      );
      say?.(getSpeakableWordText(currentQuiz.targetWord), 0.75);
    }
  }

  // Parent permission handlers (A4 & M5)
  function handleParentPauseToggle() {
    const nextPaused = !paused;
    setPaused(nextPaused);
    const nextInterventions = interventions + 1;
    setInterventions(nextInterventions);
    if (nextPaused) stopSpeech();
    persistCurrentModeSession("parent", { interventions: nextInterventions });
  }

  function handleParentSkipStep() {
    stopSpeech();
    const nextInterventions = interventions + 1;
    setInterventions(nextInterventions);
    persistCurrentModeSession("parent", { interventions: nextInterventions });
    if (view !== "task") {
      startSelectedTask(activeTaskIndex);
      return;
    }
    if (taskStage === "learn") {
      if (itemIndex + 1 < activeWords.length) {
        setItemIndex(itemIndex + 1);
      } else {
        setTaskStage("quiz");
        setItemIndex(0);
      }
    } else if (taskStage === "quiz") {
      advanceQuizOrComplete();
    } else {
      finishTask();
    }
  }

  function handleParentReduceDifficulty() {
    const nextInterventions = interventions + 1;
    setInterventions(nextInterventions);
    setReducedOptions(true);
    if (view !== "task") {
      setSimplerMode(true);
    }
    persistCurrentModeSession("parent", { interventions: nextInterventions });
  }

  function handleParentPeekAnswer() {
    const nextInterventions = interventions + 1;
    const nextPeekCount = peekAnswerCount + 1;
    setInterventions(nextInterventions);
    setPeekAnswerCount(nextPeekCount);
    setPeekAnswerVisible(true);
    if (nextPeekCount >= 3) {
      setOverInterventionWarning(true);
    }
    persistCurrentModeSession("parent", { interventions: nextInterventions });
  }

  function handleParentEndSession() {
    stopSpeech();
    persistCurrentModeSession("parent");
    setColearnPhase("wrapup");
  }

  // Current co-learn script card synchronized with stage (A3)
  const scriptStageKey =
    taskStage === "learn"
      ? meaningRevealed
        ? "repeat"
        : "watch_listen"
      : taskStage === "quiz"
        ? "quiz_choice"
        : taskStage === "sentences"
          ? "sentences"
          : taskStage === "story"
            ? "story"
            : "wrapup";
  const currentScript = getColearnScriptForStage(
    scriptStageKey,
    theme?.id || "breakfast",
    taskStage === "quiz" ? currentQuiz?.targetWord : currentWord,
  );
  const themeGuide = THEME_COLEARN_GUIDES[theme?.id || "breakfast"] || THEME_COLEARN_GUIDES.breakfast;

  // Co-learn Step 1: 30s Parent Intro Card (Section 5.4 ①)
  if (isColearn && colearnPhase === "intro") {
    return (
      <section className="colearn-intro-card" aria-label="家长陪学开场卡">
        <div className="colearn-intro-badge">
          <Users size={20} /> 陪学模式 · 家长 30 秒开场卡
        </div>
        <h1>今天 {progress.profile?.dailyMinutes || 10} 分钟，重点是 {activeWords.length} 个「{theme?.title || "早餐"}」词。</h1>
        <p className="colearn-reassure">你不需要会英语。小恐龙负责标准发音，你只需要按屏幕下方的中文台词回应孩子。</p>
        <div className="colearn-intro-preview">
          <div>
            <strong>今日目标：</strong>
            <span>{themeGuide.wordFocus}</span>
          </div>
          <div>
            <strong>核心原则：</strong>
            <span>多等 5 秒让孩子自己点；只夸具体动作，不纠结发音细节。</span>
          </div>
        </div>
        <div className="colearn-intro-actions">
          <button
            type="button"
            className="primary child-primary-btn"
            onClick={() => {
              setColearnPhase("active");
              persistCurrentModeSession("parent");
            }}
          >
            <Play size={22} /> 开始
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setSimplerMode(true);
              setColearnPhase("active");
              persistCurrentModeSession("parent");
            }}
          >
            换一个更简单的（仅 4 词）
          </button>
        </div>
      </section>
    );
  }

  // Co-learn Step 5: Parent Wrap-up Card (Section 5.4 ⑤)
  if (isColearn && colearnPhase === "wrapup") {
    const fadeRecommendation = evaluateModeRecommendation(progress);
    const stuckWord = sessionMistakes[0];
    return (
      <section className="colearn-wrapup-card" aria-label="家长陪学收尾卡">
        <span className="eyebrow">CO-LEARN SUMMARY · 陪学收尾小结</span>
        <h1>今天陪伴完成啦！</h1>
        <div className="wrapup-triad">
          <article className="wrapup-box praise">
            <strong>👏 今天可以夸他的一句话</strong>
            <p>
              “今天你自己听懂并找到了 {Math.max(1, wordsSeenInSession || activeWords.length)} 个英文新朋友
              {childUtterances > 0 ? `，还主动开口说了 ${childUtterances} 次` : ""}，耳朵真灵！”
            </p>
          </article>
          <article className="wrapup-box stuck">
            <strong>🔍 今天发现的 1 个卡点</strong>
            <p>
              {stuckWord
                ? `单词 ${stuckWord.word}（${stuckWord.translation}）听辨时犹豫了一下，系统已自动放进明天复习。`
                : "今天所有图片和声音连接都很顺畅，没有明显卡点。"}
            </p>
          </article>
          <article className="wrapup-box tomorrow">
            <strong>🌱 明天建议（只做 1 件事）</strong>
            <p>{themeGuide.dailyAction}</p>
          </article>
        </div>

        {fadeRecommendation?.suggestMode === "solo" && (
          <aside className="scaffolding-fade-alert" role="status">
            <Sparkles size={20} />
            <div>
              <strong>撤除支持建议：</strong>
              <p>{fadeRecommendation.message}</p>
            </div>
            <button
              type="button"
              className="primary"
              onClick={() => {
                update((p) => updateProfile(p, { modePreference: "solo" }));
                onSwitchMode?.("solo");
              }}
            >
              试试自学模式
            </button>
          </aside>
        )}

        <div className="colearn-intro-actions">
          <button
            type="button"
            className="primary"
            onClick={() => {
              setColearnPhase("active");
              setView("home");
              onClearCustomStuckWords?.();
            }}
          >
            返回儿童首页
          </button>
          <button type="button" className="secondary" onClick={onOpenParentCenter}>
            查看家长中心完整报告
          </button>
        </div>
      </section>
    );
  }

  // Filter quiz options when reducedOptions (2 选 1) is active
  const visibleQuizOptions = currentQuiz
    ? reducedOptions
      ? currentQuiz.options.filter(
          (opt, idx) =>
            opt.id === currentQuiz.targetWord.id ||
            idx === (currentQuiz.answerIndex + 1) % currentQuiz.options.length,
        )
      : currentQuiz.options
    : [];

  // Sentences pagination (max 3 sentences per page, M3 rule 4)
  const allSentences = sentencesLesson?.guide?.sentences || [];
  const sentencesPageCount = Math.max(1, Math.ceil(allSentences.length / 3));
  const pagedSentences = allSentences.slice(sentencePage * 3, sentencePage * 3 + 3);

  // Story pagination (max 3 sentences per page, M3 rule 4)
  const storyPassage = storyLesson?.guide?.passage || "";
  const storySentences = storyPassage.match(/[^.!?]+[.!?]+/g) || (storyPassage ? [storyPassage] : []);
  const storyPageCount = Math.max(1, Math.ceil(storySentences.length / 3));
  const pagedStorySentences = storySentences.slice(sentencePage * 3, sentencePage * 3 + 3);

  // Weekly stars count for M5
  const weeklyStarCount = Math.min(5, Math.max(1, Object.keys(progress.days || {}).length));

  return (
    <div className={`dual-mode-layout ${isColearn ? "mode-colearn-split" : "mode-solo-full"} ${hideChinese ? "zero-chinese-mask" : ""}`}>
      {/* 儿童主交互区（Solo 100% / Co-learn 70%） */}
      <section className="child-stage-area" aria-label={isColearn ? "陪学儿童互动区" : "自学儿童互动区"}>
        {/* 顶栏：仅 64×64px 图标（🏠 回首页/长按2秒切模式，🔊 读提示，⭐ 图鉴，🛡️ 家长中心） */}
        <header className="child-topbar">
          <button
            type="button"
            className="child-icon-btn"
            aria-label="回家"
            title="点一下回家 · 长按 2 秒切换模式"
            onMouseDown={() => {
              clearTimeout(homePressTimer.current);
              homePressTimer.current = setTimeout(() => setView("mode_picker"), 1800);
            }}
            onMouseUp={() => clearTimeout(homePressTimer.current)}
            onTouchStart={() => {
              clearTimeout(homePressTimer.current);
              homePressTimer.current = setTimeout(() => setView("mode_picker"), 1800);
            }}
            onTouchEnd={() => clearTimeout(homePressTimer.current)}
            onClick={() => {
              stopSpeech();
              if (view === "task" && taskStage !== "result") {
                const nextInterruptions = interruptions + 1;
                setInterruptions(nextInterruptions);
                persistCurrentModeSession("child", { interruptions: nextInterruptions });
              }
              setView("home");
              onClearCustomStuckWords?.();
            }}
          >
            <Home size={28} />
          </button>

          <div className="child-topbar-right">
            {isColearn && (
              <button
                type="button"
                className="child-icon-btn"
                aria-label={paused ? "继续学习" : "暂停学习"}
                title={paused ? "继续学习" : "暂停学习"}
                onClick={handleParentPauseToggle}
              >
                {paused ? <Play size={26} /> : <Pause size={26} />}
              </button>
            )}
            <button
              type="button"
              className="child-icon-btn"
              aria-label="听提示"
              title="听本步语音说明"
              onClick={() =>
                say?.(
                  view === "home" ? currentTask.voiceIntro : currentTask.voiceStep,
                  0.9,
                  undefined,
                  undefined,
                  "zh-CN",
                )
              }
            >
              <Volume2 size={28} />
            </button>
            <button
              type="button"
              className="child-icon-btn"
              aria-label="我的图鉴"
              title="我的图鉴与贴纸"
              onClick={() => {
                playClickSound();
                setView(view === "album" ? "home" : "album");
              }}
            >
              <Star size={28} />
            </button>
            <button
              type="button"
              className="child-icon-btn parent-entry-btn"
              aria-label="家长中心"
              title="家长中心"
              onClick={onOpenParentCenter}
            >
              <Shield size={24} />
            </button>
          </div>
        </header>

        {paused && (
          <div className="child-pause-Banner" role="status">
            <Pause size={24} />
            <span className="child-zh-text">休息一下</span>
            <button type="button" className="child-primary-btn primary" onClick={handleParentPauseToggle}>
              <Play size={22} /> <span className="child-zh-text">继续</span>
            </button>
          </div>
        )}

        {/* 长按 🏠 弹出的模式切换面板 */}
        {view === "mode_picker" && (
          <ModeSelectorCard
            say={say}
            onSelectMode={(nextMode) => {
              update((p) => updateProfile(p, { modePreference: nextMode }));
              onSwitchMode?.(nextMode);
              setView("home");
            }}
          />
        )}

        {/* M1 首页：一张“现在做这个”主卡 + 底部 4 个小圆点 */}
        {view === "home" && (
          <div className="child-home-stage">
            <article className="child-hero-card" aria-label="现在做这个">
              <div
                className="child-hero-image-wrap"
                onClick={() => say?.(currentTask.voiceIntro, 0.9, undefined, undefined, "zh-CN")}
              >
                {activeWords[0] && <WordIllustration word={activeWords[0]} />}
              </div>

              <button
                type="button"
                className="child-speakable-title"
                aria-label={`朗读标题：${currentTask.shortTitle}`}
                onClick={() => say?.(currentTask.shortTitle, 0.9, undefined, undefined, "zh-CN")}
              >
                <Volume2 size={22} />
                <span className="child-zh-text">{currentTask.shortTitle}</span>
              </button>

              {/* 底部 4 个进度小圆点（灰=未开始，黄=当前，绿=已完成） */}
              <div className="child-task-dots" role="tablist" aria-label="今日四项任务">
                {dailyTasks.map((t, idx) => {
                  const stateClass = t.done
                    ? "dot-done"
                    : idx === activeTaskIndex
                      ? "dot-active"
                      : "dot-pending";
                  return (
                    <button
                      type="button"
                      role="tab"
                      key={t.id}
                      aria-selected={idx === activeTaskIndex}
                      aria-label={t.shortTitle}
                      className={`child-dot-btn ${stateClass}`}
                      onClick={() => {
                        playClickSound();
                        setActiveTaskIndex(idx);
                        say?.(t.voiceIntro, 0.9, undefined, undefined, "zh-CN");
                      }}
                    >
                      <span className="dot-circle" />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className={`primary child-primary-btn ${idlePulse ? "pulse-guide" : ""}`}
                aria-label="开始"
                onClick={() => startSelectedTask(activeTaskIndex)}
              >
                <Play size={26} />
                <span className="child-zh-text">开始</span>
              </button>

              <button
                type="button"
                className="child-ear-btn quiet-button"
                aria-label="重听指令"
                onClick={() => say?.(currentTask.voiceIntro, 0.9, undefined, undefined, "zh-CN")}
              >
                <Headphones size={22} />
                <span className="child-zh-text">听提示</span>
              </button>
            </article>
          </div>
        )}

        {/* M2 词汇（图词卡） */}
        {view === "task" && taskStage === "learn" && currentWord && (
          <article className="child-vocab-card" aria-label="图词卡">
            <div
              className="child-vocab-photo"
              onClick={() => say?.(getSpeakableWordText(currentWord), 0.85)}
            >
              <WordIllustration word={currentWord} />
            </div>

            <button
              type="button"
              className={`child-english-word ${bouncingLetters ? "bouncing" : ""}`}
              lang="en"
              aria-label={`朗读单词 ${currentWord.word}`}
              onClick={() => say?.(getSpeakableWordText(currentWord), 0.85)}
            >
              {getPhonicsBreakdown(currentWord).chunks.map((chunk, i) => (
                <span
                  key={`${chunk.text}-${i}`}
                  className={`child-word-chunk kind-${chunk.kind}`}
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  {chunk.text}
                </span>
              ))}
            </button>

            {/* 中文义默认隐藏，点眼睛或听语音后出现 */}
            <div className="child-meaning-row">
              {meaningRevealed && !hideChinese ? (
                <button
                  type="button"
                  className="child-meaning-pill"
                  onClick={() => say?.(currentWord.translation, 0.9, undefined, undefined, "zh-CN")}
                >
                  <span className="child-zh-text">{currentWord.translation.slice(0, 6)}</span>
                </button>
              ) : null}
              <button
                type="button"
                className="child-icon-btn eye-toggle-btn"
                aria-label={meaningRevealed ? "隐藏中文意思" : "看中文意思"}
                onClick={() => {
                  const next = !meaningRevealed;
                  setMeaningRevealed(next);
                  if (next) {
                    say?.(currentWord.translation, 0.9, undefined, undefined, "zh-CN");
                  }
                }}
              >
                {meaningRevealed ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>

            <div className="child-step-dots" aria-label="卡片进度">
              {activeWords.map((w, idx) => (
                <span
                  key={w.id}
                  className={`step-dot ${idx < itemIndex ? "done" : idx === itemIndex ? "current" : ""}`}
                />
              ))}
            </div>

            {/* 主按钮：听一听 (h>=72px, w>=70%) */}
            <button
              type="button"
              className={`primary child-primary-btn ${idlePulse ? "pulse-guide" : ""}`}
              aria-label="听一听"
              onClick={handleListenWordSlow}
            >
              <Volume2 size={26} />
              <span className="child-zh-text">听一听</span>
            </button>

            {/* 次按钮：左“上一个” 右“下一个”，圆形 ≥64px */}
            <div className="child-nav-circles">
              <button
                type="button"
                className="child-circle-btn"
                aria-label="上一个"
                disabled={itemIndex === 0}
                onClick={handlePrevLearnCard}
              >
                <ArrowLeft size={26} />
              </button>
              <button
                type="button"
                className="child-circle-btn next-circle-btn"
                aria-label="下一个"
                onClick={handleNextLearnCard}
              >
                <ArrowRight size={26} />
              </button>
            </div>
          </article>
        )}

        {/* M2 & M4 找一找（3选1 -> 2选1 -> 展示答案 降级答题） */}
        {view === "task" && taskStage === "quiz" && currentQuiz && (
          <article
            className="child-quiz-card"
            aria-label="找一找练习"
            onMouseDown={() => {
              if (!isColearn) return;
              clearTimeout(questionPressTimer.current);
              questionPressTimer.current = setTimeout(handleParentPeekAnswer, 1800);
            }}
            onMouseUp={() => clearTimeout(questionPressTimer.current)}
          >
            <div className="child-quiz-header">
              <button
                type="button"
                className="child-audio-prompt-btn"
                aria-label="播放题目声音"
                onClick={() => say?.(getSpeakableWordText(currentQuiz.targetWord), 0.8)}
              >
                <Headphones size={32} />
                <span className="child-zh-text">找一找</span>
              </button>
            </div>

            <div className="child-quiz-grid" role="group" aria-label="选择正确的图片">
              {visibleQuizOptions.map((opt) => {
                const isTarget = opt.id === currentQuiz.targetWord.id;
                const glowHint =
                  (feedbackState === "retry1" || feedbackState === "retry2" || feedbackState === "reveal") &&
                  isTarget;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    aria-label={`选择 ${opt.word}`}
                    className={`child-quiz-option ${glowHint ? "correct-glow-hint" : ""} ${feedbackState === "correct" && isTarget ? "option-celebrate" : ""}`}
                    onClick={() => handleQuizChoice(opt)}
                  >
                    <WordIllustration word={opt} />
                    <strong lang="en">{opt.word}</strong>
                  </button>
                );
              })}
            </div>

            {feedbackState && (
              <div className={`child-feedback-pill state-${feedbackState}`} role="status">
                <button
                  type="button"
                  className="child-speakable-feedback"
                  onClick={() =>
                    say?.(
                      feedbackState === "correct"
                        ? "找到啦！"
                        : feedbackState === "retry1"
                          ? "再听一次。"
                          : "我们一起看。",
                      0.9,
                      undefined,
                      undefined,
                      "zh-CN",
                    )
                  }
                >
                  <Volume2 size={20} />
                  <span className="child-zh-text">
                    {feedbackState === "correct"
                      ? "找到啦！"
                      : feedbackState === "retry1"
                        ? "再听一次"
                        : "我们一起看"}
                  </span>
                </button>
                {feedbackState === "reveal" && (
                  <button
                    type="button"
                    className="primary child-primary-btn"
                    aria-label="下一个"
                    onClick={advanceQuizOrComplete}
                  >
                    <ArrowRight size={24} />
                    <span className="child-zh-text">下一个</span>
                  </button>
                )}
              </div>
            )}
          </article>
        )}

        {/* M3 听读句子（一页最多 3 句，自动分页，默认不显整段中文） */}
        {view === "task" && taskStage === "sentences" && (
          <article className="child-reading-card" aria-label="听读句子">
            <div className="child-reading-top">
              <button
                type="button"
                className="secondary child-slow-all-btn"
                aria-label="慢速全文"
                onClick={() =>
                  say?.(
                    pagedSentences.map(([en]) => en).join(" "),
                    0.65,
                  )
                }
              >
                <Headphones size={22} />
                <span className="child-zh-text">慢速听</span>
              </button>
              <span className="tiny">
                {sentencePage + 1} / {sentencesPageCount}
              </span>
            </div>

            <div className="child-sentences-page">
              {pagedSentences.map(([en], idx) => (
                <div key={en} className="child-sentence-row">
                  <p lang="en" className="child-sentence-en">
                    {en.split(/(\s+)/).map((tok, tIdx) => {
                      const clean = tok.replace(/[^a-zA-Z]/g, "").toLowerCase();
                      const matched = curriculum?.wordLookup?.[clean];
                      if (!matched) return <span key={tIdx}>{tok}</span>;
                      return (
                        <span
                          key={tIdx}
                          className="child-tap-word"
                          onClick={() => {
                            setStoryPeekWord(matched);
                            say?.(getSpeakableWordText(matched), 0.85);
                          }}
                        >
                          {tok}
                        </span>
                      );
                    })}
                  </p>
                  <button
                    type="button"
                    className="child-circle-btn"
                    aria-label={`朗读第 ${sentencePage * 3 + idx + 1} 句`}
                    onClick={() => {
                      playClickSound();
                      say?.(en, 0.8);
                    }}
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
              ))}
            </div>

            {storyPeekWord && (
              <aside className="child-word-peek-floating" aria-label="点词看义">
                {storyPeekWord.image && <WordIllustration word={storyPeekWord} size="small" />}
                <div>
                  <strong lang="en">{storyPeekWord.word}</strong>
                  {!hideChinese && <p className="child-zh-text">{storyPeekWord.translation}</p>}
                </div>
              </aside>
            )}

            <div className="child-nav-circles">
              <button
                type="button"
                className="child-circle-btn"
                aria-label="上一页"
                disabled={sentencePage === 0}
                onClick={() => setSentencePage(sentencePage - 1)}
              >
                <ArrowLeft size={26} />
              </button>
              {sentencePage + 1 < sentencesPageCount ? (
                <button
                  type="button"
                  className="primary child-primary-btn"
                  aria-label="下一页"
                  onClick={() => {
                    playClickSound();
                    setSentencePage(sentencePage + 1);
                  }}
                >
                  <ArrowRight size={24} />
                  <span className="child-zh-text">下一页</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="primary child-primary-btn"
                  aria-label="完成啦"
                  onClick={finishTask}
                >
                  <Check size={24} />
                  <span className="child-zh-text">完成啦</span>
                </button>
              )}
            </div>
          </article>
        )}

        {/* M3 短故事（一页最多 3 句，点词查义响应 <100ms，无整段中文翻译） */}
        {view === "task" && taskStage === "story" && (
          <article className="child-reading-card" aria-label="绘本故事点读">
            <div className="child-reading-top">
              <button
                type="button"
                className="secondary child-slow-all-btn"
                aria-label="慢速全文"
                onClick={() => say?.(storyPassage, 0.68)}
              >
                <BookOpen size={22} />
                <span className="child-zh-text">慢速读</span>
              </button>
              <span className="tiny">
                {sentencePage + 1} / {storyPageCount}
              </span>
            </div>

            <div className="child-sentences-page">
              {pagedStorySentences.map((sentence, idx) => (
                <div key={idx} className="child-sentence-row">
                  <p lang="en" className="child-sentence-en">
                    {sentence.split(/(\s+)/).map((tok, tIdx) => {
                      const clean = tok.replace(/[^a-zA-Z]/g, "").toLowerCase();
                      const matched =
                        curriculum?.wordLookup?.[clean] ||
                        (clean.endsWith("s") ? curriculum?.wordLookup?.[clean.slice(0, -1)] : null);
                      if (!matched) return <span key={tIdx}>{tok}</span>;
                      return (
                        <span
                          key={tIdx}
                          className="child-tap-word"
                          onClick={() => {
                            setStoryPeekWord(matched);
                            say?.(getSpeakableWordText(matched), 0.85);
                          }}
                        >
                          {tok}
                        </span>
                      );
                    })}
                  </p>
                  <button
                    type="button"
                    className="child-circle-btn"
                    aria-label={`朗读故事第 ${sentencePage * 3 + idx + 1} 句`}
                    onClick={() => {
                      playClickSound();
                      say?.(sentence.trim(), 0.8);
                    }}
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
              ))}
            </div>

            {storyPeekWord && (
              <aside className="child-word-peek-floating" aria-label="点词看义">
                {storyPeekWord.image && <WordIllustration word={storyPeekWord} size="small" />}
                <div>
                  <strong lang="en">{storyPeekWord.word}</strong>
                  {!hideChinese && <p className="child-zh-text">{storyPeekWord.translation}</p>}
                </div>
              </aside>
            )}

            <div className="child-nav-circles">
              <button
                type="button"
                className="child-circle-btn"
                aria-label="上一页"
                disabled={sentencePage === 0}
                onClick={() => setSentencePage(sentencePage - 1)}
              >
                <ArrowLeft size={26} />
              </button>
              {sentencePage + 1 < storyPageCount ? (
                <button
                  type="button"
                  className="primary child-primary-btn"
                  aria-label="下一页"
                  onClick={() => {
                    playClickSound();
                    setSentencePage(sentencePage + 1);
                  }}
                >
                  <ArrowRight size={24} />
                  <span className="child-zh-text">下一页</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="primary child-primary-btn"
                  aria-label="完成啦"
                  onClick={finishTask}
                >
                  <Check size={24} />
                  <span className="child-zh-text">完成啦</span>
                </button>
              )}
            </div>
          </article>
        )}

        {/* 结果页：≤8 汉字，无百分比/分数，满 2 任务提示“休息一下” */}
        {view === "task" && taskStage === "result" && (
          <article className="child-result-card" aria-label="完成庆祝">
            <div className="child-result-badge">🎉</div>
            <button
              type="button"
              className="child-speakable-title"
              onClick={() => say?.("完成啦！", 0.9, undefined, undefined, "zh-CN")}
            >
              <Volume2 size={24} />
              <h1 className="child-zh-text">完成啦！</h1>
            </button>

            {tasksCompletedInSession >= 2 && (
              <div className="child-rest-prompt" role="status">
                <button
                  type="button"
                  className="quiet-button"
                  onClick={() => say?.("要不要休息一下？", 0.9, undefined, undefined, "zh-CN")}
                >
                  <Volume2 size={20} />
                  <span className="child-zh-text">休息一下</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className="primary child-primary-btn"
              aria-label="回家"
              onClick={() => {
                if (isColearn) {
                  setColearnPhase("wrapup");
                } else {
                  setView("home");
                  onClearCustomStuckWords?.();
                }
              }}
            >
              <Home size={24} />
              <span className="child-zh-text">回家</span>
            </button>
          </article>
        )}

        {/* M5 我的图鉴（收集格 + 本周星星 + 去贴纸屋） */}
        {view === "album" && (
          <section className="child-album-view" aria-label="我的图鉴">
            <div className="child-album-head">
              <button
                type="button"
                className="child-speakable-title"
                onClick={() => say?.("我的图鉴", 0.9, undefined, undefined, "zh-CN")}
              >
                <span aria-hidden="true">🐣</span>
                <h2 className="child-zh-text">我的图鉴</h2>
                <Volume2 size={22} />
              </button>
            </div>

            <div className="child-album-grid" role="list" aria-label="12主题收集格">
              {(curriculum?.childThemes || []).map((t) => {
                const words = t.vocabulary?.words || [];
                const collected = words.filter(
                  (w) => progress.seen.includes(w.id) || progress.mastered.includes(w.id),
                ).length;
                return (
                  <button
                    type="button"
                    key={t.id}
                    role="listitem"
                    className={`album-theme-cell ${collected > 0 ? "collected" : ""}`}
                    aria-label={`${t.title} ${collected}/${words.length}`}
                    onClick={() =>
                      say?.(
                        `${t.title}，已收集 ${collected} 个`,
                        0.9,
                        undefined,
                        undefined,
                        "zh-CN",
                      )
                    }
                  >
                    <span className="album-emoji">{THEME_EMOJIS[t.id] || "🌟"}</span>
                    <strong>
                      {collected} / {words.length}
                    </strong>
                  </button>
                );
              })}
            </div>

            <div className="child-weekly-stars" aria-label="本周星星">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < weeklyStarCount ? "star-lit" : "star-dim"}>
                  {i < weeklyStarCount ? "⭐" : "☆"}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="primary child-primary-btn"
              aria-label="去贴纸屋"
              onClick={() => setView("stickers")}
            >
              <Sparkles size={24} />
              <span className="child-zh-text">去贴纸屋</span>
            </button>
          </section>
        )}

        {view === "stickers" && (
          <div className="child-sticker-wrapper">
            <StickerBook progress={progress} />
            <button
              type="button"
              className="primary child-primary-btn"
              onClick={() => setView("album")}
            >
              <ArrowLeft size={22} />
              <span className="child-zh-text">返回</span>
            </button>
          </div>
        )}
      </section>

      {/* 陪学模式：家长提示条（手机底部可折叠 30% / 平板右侧分栏 30%，Section 5.4 & A3 & A4） */}
      {isColearn && (
        <aside
          className={`parent-prompt-bar ${parentDrawerOpen ? "expanded" : "collapsed"}`}
          aria-label="家长陪学提示条"
        >
          <div className="parent-bar-header">
            <strong>👨‍👦 家长提示 · {currentScript.label}</strong>
            <button
              type="button"
              className="quiet-button drawer-toggle-btn"
              aria-expanded={parentDrawerOpen}
              aria-label={parentDrawerOpen ? "折叠家长提示" : "展开家长提示"}
              onClick={() => setParentDrawerOpen(!parentDrawerOpen)}
            >
              {parentDrawerOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              {parentDrawerOpen ? "收起" : "展开"}
            </button>
          </div>

          {parentDrawerOpen && (
            <div className="parent-bar-body">
              {waitFiveSecPrompt && (
                <div className="parent-wait-alert" role="status">
                  ⏳ 现在轮到他了，先别说话，等 5 秒。
                </div>
              )}

              {overInterventionWarning && (
                <div className="parent-over-intervention-alert" role="alert">
                  💡 让他自己试一次（过多查看答案会减少孩子独立探索的机会）
                </div>
              )}

              <div className="parent-script-lines">
                <p>
                  <strong>目标：</strong>
                  <span>{currentScript.goal}</span>
                </p>
                <p>
                  <strong>你可以说：</strong>
                  <span>{currentScript.say.join(" / ")}</span>
                </p>
                <p>
                  <strong>你可以做：</strong>
                  <span>{currentScript.action}</span>
                </p>
                <p className="parent-script-caution">
                  <strong>注意：</strong>
                  <span>{currentScript.caution}</span>
                </p>
              </div>

              {peekAnswerVisible && (
                <div className="parent-peek-answer-box" role="status">
                  🔑 本题答案：
                  <strong>
                    {taskStage === "quiz"
                      ? `${currentQuiz?.targetWord?.word}（${currentQuiz?.targetWord?.translation}）`
                      : `${currentWord?.word || ""}（${currentWord?.translation || ""}）`}
                  </strong>
                  {currentWord?.phonetic ? ` · ${currentWord.phonetic}` : ""}
                </div>
              )}

              {/* 家长四权限 + 开口记录 + 结束会话 (A4) */}
              <div className="parent-permissions-bar" role="group" aria-label="家长陪学控制项">
                <button
                  type="button"
                  className="quiet-button"
                  aria-label="跳过本环节"
                  onClick={handleParentSkipStep}
                >
                  <SkipForward size={16} /> 跳过本环节
                </button>
                <button
                  type="button"
                  className="quiet-button"
                  aria-label="降低难度"
                  onClick={handleParentReduceDifficulty}
                >
                  <RotateCcw size={16} /> 降低难度
                </button>
                <button
                  type="button"
                  className="quiet-button"
                  aria-label="看答案"
                  onClick={handleParentPeekAnswer}
                >
                  <Eye size={16} /> 看答案
                </button>
                <button
                  type="button"
                  className="quiet-button"
                  aria-label="记录孩子主动开口"
                  onClick={() => setChildUtterances((c) => c + 1)}
                >
                  🗣️ 开口 +{childUtterances}
                </button>
                <button
                  type="button"
                  className="secondary"
                  aria-label="结束陪学会话"
                  onClick={handleParentEndSession}
                >
                  结束会话
                </button>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
