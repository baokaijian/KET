import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Headphones,
  Home,
  Mic,
  Play,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  Square,
  Target,
  TrendingUp,
  Volume2,
  X,
  PenLine,
} from "lucide-react";
import {
  abilityQuestions,
  dictionaryEntry,
  learningWords,
  lessons,
  speakingPrompts,
  wordById,
  writingTask,
} from "./data/learning.js";
import {
  countEnglishWords,
  emptyProgress,
  localDay,
  normalizeProgress,
  recordAnswer,
} from "./utils/learningProgress.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import {
  playCorrectSound,
  playIncorrectSound,
  playVictoryFanfare,
  speakText,
  stopSpeech,
} from "./utils/audio.js";
import { getSpeakableWordText } from "./utils/speechText.js";
import WordIllustration from "./components/WordIllustration.jsx";

const navigation = [
  ["today", "今天", Home],
  ["learn", "学习天地", BookOpen],
  ["assessment", "KET 小测", Target],
  ["progress", "成长记录", TrendingUp],
];
const skills = [
  ["listening", "听力", Headphones, "听懂生活中的英语"],
  ["reading", "阅读", BookOpen, "读懂告示、邮件和短文"],
  ["writing", "写作", PenLine, "用英语分享你的周末"],
  ["speaking", "口语", Mic, "说说你自己的故事"],
];
const titles = {
  today: ["Hello, little explorer.", "今天，也发现一点新东西。"],
  learn: ["Explore your world.", "学习天地"],
  assessment: ["A little challenge.", "看看自己进步了多少。"],
  progress: ["Growing, day by day.", "每一步，都算数。"],
};

function SoundButton({ text, say, label = "播放发音", slow = false }) {
  return (
    <button
      className={slow ? "quiet-button" : "icon-button"}
      title={label}
      aria-label={label}
      onClick={() => say(text, slow ? 0.65 : null)}
    >
      <Volume2 size={19} />
      {slow && "慢速"}
    </button>
  );
}

function LessonTile({ lesson, completed, start }) {
  return (
    <article className={`lesson-tile ${lesson.accent}`}>
      <WordIllustration word={lesson.words[0]} size="small" />
      <div>
        <span className="eyebrow">{lesson.english}</span>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
        <span className="tiny">
          <Clock size={13} /> {lesson.minutes} 分钟 · {lesson.words.length}{" "}
          个单词
        </span>
      </div>
      <button
        className="icon-button"
        aria-label={`学习${lesson.title}`}
        title={`学习${lesson.title}`}
        onClick={() => start(lesson)}
      >
        {completed ? <RotateCcw size={20} /> : <ArrowRight size={20} />}
      </button>
    </article>
  );
}

function Today({ progress, start, navigate, say }) {
  const next =
    lessons.find((lesson) => !progress.completed.includes(lesson.id)) ||
    lessons[0];
  const todayCount = Number(progress.days[localDay()]) || 0;
  return (
    <>
      <div className="section-heading">
        <h2>今天的小目标</h2>
        <span className="muted">每天 5 分钟，就很好</span>
      </div>
      <section className="daily-layout">
        <div className="daily-lesson">
          <div>
            <span className="tag">
              {progress.completed.includes(next.id)
                ? "再巩固一次"
                : "为你准备的下一课"}
            </span>
            <h2>{next.title}</h2>
            <p>{next.description}</p>
            <div className="lesson-meta">
              <span>
                <Clock size={15} /> 5 分钟
              </span>
              <span>
                <BookOpen size={15} /> 4 个单词
              </span>
            </div>
            <button className="primary" onClick={() => start(next)}>
              开始学习 <ArrowRight size={18} />
            </button>
          </div>
          <WordIllustration word={next.words[0]} />
        </div>
        <div className="daily-goal">
          <div className="goal-top">
            <span className="icon-tint">
              <Sparkles size={22} />
            </span>
            <span className="tiny">TODAY</span>
          </div>
          <h3>{todayCount >= 4 ? "今天的目标完成啦" : "小小练习，大大进步"}</h3>
          <p>完成 4 道练习，给今天添一颗星。</p>
          <div
            className="goal-dots"
            aria-label={`今天已完成 ${Math.min(todayCount, 4)} / 4 道练习`}
          >
            {[0, 1, 2, 3].map((n) => (
              <span key={n} className={n < todayCount ? "filled" : ""}>
                {n < todayCount ? <Check size={17} /> : n + 1}
              </span>
            ))}
          </div>
          <button className="text-button" onClick={() => navigate("progress")}>
            看看我的成长 <ChevronRight size={16} />
          </button>
        </div>
      </section>
      <div className="section-heading">
        <h2>先认识这几个词</h2>
        <button className="text-button" onClick={() => navigate("learn")}>
          探索更多 <ChevronRight size={16} />
        </button>
      </div>
      <section className="word-grid">
        {next.words.map((word) => (
          <article className="preview-word" key={word.id}>
            <WordIllustration word={word} />
            <div className="word-caption">
              <div>
                <h3 lang="en">{word.word}</h3>
                <span>{word.translation}</span>
              </div>
              <SoundButton
                text={word.word}
                say={say}
                label={`听 ${word.word} 的发音`}
              />
            </div>
          </article>
        ))}
      </section>
      <div className="section-heading">
        <h2>我的探索路线</h2>
        <span className="muted">从生活出发，慢慢走向 KET</span>
      </div>
      <section className="lesson-list">
        {lessons.map((lesson) => (
          <LessonTile
            key={lesson.id}
            lesson={lesson}
            start={start}
            completed={progress.completed.includes(lesson.id)}
          />
        ))}
      </section>
      <section className="review-banner">
        <div>
          <RotateCcw size={22} />
          <div>
            <h3>再见一次，就记得更牢</h3>
            <p>
              {progress.review.length
                ? `${progress.review.length} 道练习等你回来。`
                : "没有待复习的题目，继续探索吧。"}
            </p>
          </div>
        </div>
        <button className="secondary" onClick={() => navigate("progress")}>
          我的复习
        </button>
      </section>
    </>
  );
}

function Library({ progress, start, say }) {
  const [dictionary, setDictionary] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const dialogOpener = useRef(null);
  useEffect(() => {
    if (!selected) return;
    const opener = dialogOpener.current;
    return () => opener?.focus();
  }, [selected]);
  useEffect(() => {
    let active = true;
    import("./data/ket-words/index.js")
      .then((data) => {
        if (active) setDictionary(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const allKetWords = dictionary?.allKetWords || [];
  const topicCategories = dictionary?.topicCategories || [];
  const results = allKetWords
    .map(dictionaryEntry)
    .filter(
      (word) =>
        (topic === "all" || word.topic === topic) &&
        `${word.word} ${word.translation}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
  return (
    <>
      <section className="lesson-list">
        {lessons.map((lesson) => (
          <LessonTile
            key={lesson.id}
            lesson={lesson}
            start={start}
            completed={progress.completed.includes(lesson.id)}
          />
        ))}
      </section>
      <div className="section-heading">
        <h2>随手查一个词</h2>
        <span className="muted">{allKetWords.length} 个词条</span>
      </div>
      <div className="library-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="搜索单词或中文"
            aria-label="搜索单词或中文"
          />
        </label>
        <select
          aria-label="选择词汇主题"
          value={topic}
          onChange={(event) => {
            setTopic(event.target.value);
            setPage(0);
          }}
        >
          <option value="all">所有主题</option>
          {topicCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.scene}
            </option>
          ))}
        </select>
      </div>
      <p className="tiny library-note">
        照片课程已逐项复核。扩展词库正在校对，未核实的图片和音标不展示；释义标注为待复核时，请先查词典。
      </p>
      <div className="dictionary-grid">
        {results.slice(page * 36, (page + 1) * 36).map((word) => (
          <div className="dictionary-row" key={word.id}>
            <button
              className="dictionary-word"
              onClick={(event) => {
                dialogOpener.current = event.currentTarget;
                setSelected(word);
              }}
            >
              <strong lang="en">{word.word}</strong>
              <span>{word.translation}</span>
            </button>
            <SoundButton
              text={getSpeakableWordText(word)}
              say={say}
              label={`听 ${word.word} 的发音`}
            />
          </div>
        ))}
      </div>
      {!dictionary && (
        <p role="status">
          {loadError ? "词库加载失败，请刷新页面再试。" : "正在打开词库…"}
        </p>
      )}
      {dictionary && !results.length && (
        <div className="empty-state">
          <Search size={28} />
          <h3>还没找到这个词</h3>
          <p>试试英文单词，或换一个主题。</p>
        </div>
      )}
      {results.length > 36 && (
        <div className="pagination">
          <button
            className="quiet-button"
            disabled={!page}
            onClick={() => setPage(page - 1)}
          >
            <ArrowLeft size={16} />
            上一页
          </button>
          <span>
            {page + 1} / {Math.ceil(results.length / 36)}
          </span>
          <button
            className="quiet-button"
            disabled={(page + 1) * 36 >= results.length}
            onClick={() => setPage(page + 1)}
          >
            下一页
            <ArrowRight size={16} />
          </button>
        </div>
      )}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="word-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.word} 词条`}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSelected(null);
              if (event.key !== "Tab") return;
              const controls = event.currentTarget.querySelectorAll(
                "button:not(:disabled), a[href], input",
              );
              const first = controls[0];
              const last = controls[controls.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
          >
            <button
              className="modal-close icon-button"
              aria-label="关闭词条"
              onClick={() => setSelected(null)}
              autoFocus
            >
              <X size={20} />
            </button>
            <WordIllustration word={selected} />
            <h2 lang="en">{selected.word}</h2>
            {selected.phonetic && (
              <p className="phonetic">UK {selected.phonetic}</p>
            )}
            <p>{selected.translation}</p>
            <SoundButton
              text={getSpeakableWordText(selected)}
              say={say}
              label="播放单词发音"
            />
            {selected.sentence && (
              <blockquote lang="en">{selected.sentence}</blockquote>
            )}
            {!selected.contentReviewed && (
              <p className="tiny">
                扩展词条尚未完成语义复核，不作为掌握度测试依据。
              </p>
            )}
            <button className="quiet-button" onClick={() => setSelected(null)}>
              返回词库
            </button>
          </section>
        </div>
      )}
    </>
  );
}

function makeWordQuestions(words) {
  return words.map((word, index) => ({
    id: `word-${word.id}`,
    wordId: word.id,
    word,
    skill: "vocabulary",
    type:
      index % 3 === 1 ? "spelling" : index % 3 === 2 ? "listening" : "picture",
    prompt:
      index % 3 === 1
        ? `拼出“${word.translation.replace("（名词）", "")}”的英文`
        : index % 3 === 2
          ? "听一听，选择你听到的词。"
          : "看看照片，选出它的英文。",
    options: [
      word,
      ...learningWords
        .filter((item) => item.id !== word.id)
        .slice(index, index + 2),
    ]
      .map((item) => item.word)
      .sort(),
    correctWord: word.word,
    explanation: `${word.word} 的意思是${word.translation}。`,
  }));
}

function Practice({ activity, progress, seen, answer, complete, exit, say }) {
  const words = activity.lesson?.words || [];
  const questions = activity.questions || makeWordQuestions(words);
  const [stage, setStage] = useState(words.length ? "learn" : "quiz");
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [choice, setChoice] = useState(null);
  const [typed, setTyped] = useState("");
  const [heard, setHeard] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const currentWord = words[index];
  const question = questions[index];
  const score = responses.filter(Boolean).length;
  const total = stage === "learn" ? words.length : questions.length;

  function check(value) {
    if (choice !== null) return;
    const correct = question.correctWord
      ? value.trim().toLowerCase() === question.correctWord
      : value === question.answer;
    setChoice({ value, correct });
    setResponses([...responses, correct]);
    answer(question.correctWord ? question.wordId : question.id, correct);
    if (correct) playCorrectSound();
    else playIncorrectSound();
  }
  function next() {
    stopSpeech();
    if (stage === "learn") {
      seen(currentWord.id);
      if (index + 1 === words.length) {
        setStage("quiz");
        setIndex(0);
      } else setIndex(index + 1);
    } else if (index + 1 === questions.length) {
      complete({
        title: activity.title,
        skill: activity.skill || "vocabulary",
        score,
        total: questions.length,
        lessonId: activity.lesson?.id,
      });
      setStage("result");
      playVictoryFanfare();
    } else {
      setIndex(index + 1);
      setChoice(null);
      setTyped("");
      setHeard(false);
      setAudioError(false);
    }
  }
  function listen() {
    const accepted = say(
      question.audio || question.correctWord,
      null,
      () => {
        setHeard(true);
        setAudioError(false);
      },
      () => {
        setHeard(false);
        setAudioError(true);
      },
    );
    if (!accepted) setAudioError(true);
  }
  return (
    <section className="practice-shell">
      <div className="practice-header">
        <button className="quiet-button" onClick={exit}>
          <ArrowLeft size={17} /> 返回
        </button>
        <span>{activity.title}</span>
        <span className="tiny">
          {stage === "result" ? "完成" : `${index + 1} / ${total}`}
        </span>
      </div>
      {stage !== "result" && (
        <div className="progress-track">
          <span style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      )}
      {stage === "learn" && (
        <div className="learning-stage">
          <WordIllustration word={currentWord} />
          <div className="word-detail">
            <span className="eyebrow">听一听 · 读一读</span>
            <h1 lang="en">{currentWord.word}</h1>
            <p className="phonetic">UK {currentWord.phonetic}</p>
            <h2>{currentWord.translation}</h2>
            <div className="sound-controls">
              <button className="primary" onClick={() => say(currentWord.word)}>
                <Volume2 size={19} /> 听发音
              </button>
              <SoundButton
                slow
                text={currentWord.word}
                say={say}
                label="慢速播放单词"
              />
            </div>
            <div className="example">
              <div>
                <p lang="en">{currentWord.sentence}</p>
                <SoundButton
                  text={currentWord.sentence}
                  say={say}
                  label="朗读例句"
                />
              </div>
              <p>{currentWord.sentenceTranslation}</p>
            </div>
            <button className="secondary" onClick={next}>
              {index + 1 === words.length ? "开始小练习" : "下一个单词"}{" "}
              <ArrowRight size={18} />
            </button>
            <p className="tiny">
              {progress.seen.includes(currentWord.id)
                ? "这是你已经见过的老朋友。"
                : "听完后，试着自己读一遍。"}
            </p>
          </div>
        </div>
      )}
      {stage === "quiz" && (
        <div className="question-stage">
          <span className="eyebrow">
            {question.type === "spelling"
              ? "SPELL IT"
              : question.skill === "listening" || question.type === "listening"
                ? "LISTEN & CHOOSE"
                : "YOUR TURN"}
          </span>
          <h2>{question.prompt}</h2>
          {question.type === "picture" && (
            <WordIllustration word={question.word} />
          )}
          {question.passage && (
            <blockquote className="reading-passage" lang="en">
              {question.passage}
            </blockquote>
          )}
          {(question.audio || question.type === "listening") && (
            <div className="listening-control">
              <button className="audio-play" onClick={listen}>
                <Headphones size={26} /> {heard ? "再听一次" : "播放听力"}
              </button>
              <p className="tiny">
                {audioError
                  ? "没有成功播放，请检查设备音量后重试。"
                  : heard
                    ? "听完了，选一个答案吧。"
                    : "听完后再选择答案。"}
              </p>
            </div>
          )}
          {question.type === "spelling" ? (
            <form
              className="spelling-form"
              onSubmit={(event) => {
                event.preventDefault();
                check(typed);
              }}
            >
              <input
                autoFocus
                aria-label="输入英文拼写"
                value={typed}
                disabled={choice !== null}
                onChange={(event) => setTyped(event.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
              />
              <button
                className="primary"
                disabled={!typed.trim() || choice !== null}
              >
                检查拼写 <Check size={18} />
              </button>
            </form>
          ) : (
            <div className="answer-options">
              {question.options.map((option, n) => {
                const value = question.correctWord ? option : n;
                return (
                  <button
                    key={option}
                    className={`answer-option ${choice?.value === value ? (choice.correct ? "correct" : "incorrect") : ""}`}
                    disabled={
                      choice !== null ||
                      ((question.audio || question.type === "listening") &&
                        !heard)
                    }
                    onClick={() => check(value)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + n)}
                    </span>
                    <span lang="en">{option}</span>
                    {choice?.value === value &&
                      (choice.correct ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <X size={20} />
                      ))}
                  </button>
                );
              })}
            </div>
          )}
          {choice !== null && (
            <div
              className={`answer-feedback ${choice.correct ? "success" : "try-again"}`}
              role="status"
            >
              <h3>
                {choice.correct ? "答对啦！" : "没关系，我们再认识一次。"}
              </h3>
              <p>{question.explanation}</p>
              <button className="primary" onClick={next}>
                {index + 1 === questions.length ? "查看结果" : "下一题"}{" "}
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      )}
      {stage === "result" && (
        <div className="result-stage">
          <span className="result-mark">
            <CheckCircle2 size={48} />
          </span>
          <span className="eyebrow">WELL DONE</span>
          <h1>又向前迈了一小步。</h1>
          <p>
            这次答对 <strong>{score}</strong> / {questions.length} 题
          </p>
          <p>
            {score === questions.length
              ? "这些知识已经更熟悉了，继续探索吧。"
              : "需要巩固的题目已放进复习区。下次再见，就更熟悉。"}
          </p>
          <button className="primary" onClick={exit}>
            完成练习 <Check size={18} />
          </button>
        </div>
      )}
    </section>
  );
}

function Speaking({ say }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [waitingForMic, setWaitingForMic] = useState(false);
  const [clip, setClip] = useState("");
  const [error, setError] = useState("");
  const [checks, setChecks] = useState({});
  const recorder = useRef(null);
  const stream = useRef(null);
  const clipRef = useRef("");
  const alive = useRef(true);
  const stopTimer = useRef(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(stopTimer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
      if (clipRef.current) URL.revokeObjectURL(clipRef.current);
    };
  }, []);
  async function record() {
    if (waitingForMic) return;
    if (recording) {
      recorder.current?.stop();
      return;
    }
    try {
      setWaitingForMic(true);
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder)
        throw new Error("unsupported");
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stopSpeech();
      stream.current = media;
      const chunks = [];
      const device = new MediaRecorder(media);
      recorder.current = device;
      device.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      device.onstop = () => {
        clearTimeout(stopTimer.current);
        media.getTracks().forEach((track) => track.stop());
        if (!alive.current) return;
        if (clipRef.current) URL.revokeObjectURL(clipRef.current);
        const url = URL.createObjectURL(
          new Blob(chunks, { type: device.mimeType }),
        );
        clipRef.current = url;
        setClip(url);
        setRecording(false);
      };
      device.start();
      stopTimer.current = setTimeout(() => {
        if (device.state === "recording") device.stop();
      }, 60_000);
      setRecording(true);
      setError("");
    } catch {
      stream.current?.getTracks().forEach((track) => track.stop());
      if (alive.current)
        setError("暂时无法使用麦克风。允许麦克风权限，或者直接大声练习。");
    } finally {
      if (alive.current) setWaitingForMic(false);
    }
  }
  return (
    <section className="skill-workspace">
      <span className="eyebrow">SPEAK ABOUT YOU</span>
      <h2 lang="en">{speakingPrompts[promptIndex]}</h2>
      <button
        className="quiet-button"
        onClick={() => say(speakingPrompts[promptIndex])}
      >
        <Volume2 size={18} /> 听问题
      </button>
      <p>用 2–3 句英语回答。说说你喜欢什么，再说一个理由。</p>
      <button
        className={recording ? "secondary recording" : "primary"}
        onClick={record}
        disabled={waitingForMic}
      >
        {recording ? <Square size={17} /> : <Mic size={17} />}
        {waitingForMic
          ? "等待麦克风…"
          : recording
            ? "结束录音"
            : "录下我的回答"}
      </button>
      {error && (
        <p className="error-note" role="alert">
          {error}
        </p>
      )}
      {clip && <audio controls src={clip} aria-label="播放我的口语录音" />}
      <h3>听听自己，勾一勾</h3>
      {["我回答了问题", "我用了完整的句子", "我说出了一个理由"].map(
        (text, n) => (
          <label className="check-row" key={text}>
            <input
              type="checkbox"
              checked={!!checks[n]}
              onChange={(event) =>
                setChecks({ ...checks, [n]: event.target.checked })
              }
            />
            {text}
          </label>
        ),
      )}
      <button
        className="quiet-button"
        disabled={recording || waitingForMic}
        onClick={() => {
          setPromptIndex((promptIndex + 1) % speakingPrompts.length);
          setChecks({});
          if (clipRef.current) URL.revokeObjectURL(clipRef.current);
          clipRef.current = "";
          setClip("");
        }}
      >
        换一个话题 <ArrowRight size={17} />
      </button>
      <p className="tiny">
        每段录音最多 60
        秒，只留在当前页面，不上传。口语为自评练习，不自动评判发音准确度。
      </p>
    </section>
  );
}

function Assessment({ startTest, progress, update, say }) {
  const [skill, setSkill] = useState("listening");
  const [submitted, setSubmitted] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [checks, setChecks] = useState({});
  const count = countEnglishWords(progress.draft);
  return (
    <>
      <div className="assessment-intro">
        <div>
          <span className="tag">A2 Key · 能力练习</span>
          <h2>不怕做错，才会更多。</h2>
          <p>听、读、写、说，各练一点。先从你喜欢的开始。</p>
        </div>
        <button className="primary" onClick={() => startTest("mixed")}>
          综合小测 <ArrowRight size={18} />
        </button>
      </div>
      <div className="skill-tabs" role="tablist" aria-label="能力练习类型">
        {skills.map(([id, name, Icon, description]) => (
          <button
            role="tab"
            aria-selected={skill === id}
            className={skill === id ? "active" : ""}
            key={id}
            onClick={() => setSkill(id)}
          >
            <Icon size={22} />
            <strong>{name}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>
      {["listening", "reading"].includes(skill) && (
        <section className="skill-workspace">
          <span className="eyebrow">{skill.toUpperCase()} PRACTICE</span>
          <h2>
            {skill === "listening"
              ? "先听懂，再选答案。"
              : "在文字里，找到小线索。"}
          </h2>
          <p>
            {skill === "listening"
              ? "3 段生活英语，可以重复播放。请先打开设备声音。"
              : "3 道短文练习，读一读，再想一想。"}
          </p>
          <button className="primary" onClick={() => startTest(skill)}>
            开始{skill === "listening" ? "听力" : "阅读"}练习 <Play size={17} />
          </button>
        </section>
      )}
      {skill === "writing" && (
        <section className="skill-workspace">
          <span className="eyebrow">A SHORT EMAIL</span>
          <h2>给朋友写一封信</h2>
          <p>{writingTask.prompt}</p>
          <ul className="writing-points">
            {writingTask.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <label className="writing-label" htmlFor="writing-draft">
            我的英文邮件
          </label>
          <textarea
            id="writing-draft"
            lang="en"
            placeholder="Hi Alex, ..."
            value={progress.draft}
            onChange={(event) => {
              update((p) => ({ ...p, draft: event.target.value }));
              setSubmitted(false);
            }}
          />
          <div className="writing-bottom">
            <span className={count >= 25 ? "positive" : "muted"}>
              {count} / 25 words
            </span>
            <button
              className="primary"
              disabled={count < 25}
              onClick={() => setSubmitted(true)}
            >
              完成并自查 <Check size={17} />
            </button>
          </div>
          {submitted && (
            <div className="writing-review" role="status">
              <h3>字数达标了，看看有没有说清楚。</h3>
              {writingTask.points.map((text, n) => (
                <label className="check-row" key={text}>
                  <input
                    type="checkbox"
                    checked={!!checks[n]}
                    onChange={(event) =>
                      setChecks({ ...checks, [n]: event.target.checked })
                    }
                  />
                  {text}
                </label>
              ))}
              <p className="tiny">
                字数达标不代表语法正确。可请家长或老师帮你看看。
              </p>
            </div>
          )}
          <button
            className="text-button"
            onClick={() => setShowExample(!showExample)}
          >
            {showExample ? "收起" : "看一封参考邮件"} <ChevronRight size={16} />
          </button>
          {showExample && (
            <blockquote lang="en">{writingTask.example}</blockquote>
          )}
          <p className="tiny">草稿保存在本设备，不上传。</p>
        </section>
      )}
      {skill === "speaking" && <Speaking say={say} />}
      <p className="assessment-disclaimer">
        本页是自编的 KET 入门能力练习，不是完整模拟考试，也不预测 Cambridge
        成绩。正式 A2 Key 包含阅读与写作、听力和口语。
        <a
          href="https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/format/"
          target="_blank"
          rel="noreferrer"
        >
          了解官方考试结构
        </a>
      </p>
    </>
  );
}

function Progress({ progress, review }) {
  const wordsToReview = progress.review.filter((id) => wordById[id]);
  return (
    <>
      <section className="stats-grid">
        {[
          [
            progress.mastered.filter((id) => wordById[id]).length,
            "已掌握单词",
            "练习答对，不只看过",
          ],
          [progress.completed.length, "完成课程", "属于你的探索足迹"],
          [Object.keys(progress.days).length, "学习天数", "每一天都值得鼓励"],
        ].map(([number, title, description]) => (
          <div className="stat-block" key={title}>
            <strong>
              {number}
              <span>
                {" "}
                /{" "}
                {title === "已掌握单词"
                  ? learningWords.length
                  : title === "完成课程"
                    ? lessons.length
                    : "天"}
              </span>
            </strong>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>
      <div className="section-heading">
        <h2>再练一次</h2>
        <span className="muted">{progress.review.length} 项待复习</span>
      </div>
      {progress.review.length ? (
        <section className="review-list">
          {progress.review.map((id) => (
            <div key={id}>
              <div>
                <strong>
                  {wordById[id]?.word ||
                    abilityQuestions.find((question) => question.id === id)
                      ?.prompt ||
                    "练习题"}
                </strong>
                <span>
                  {wordById[id]?.translation ||
                    (abilityQuestions.find((question) => question.id === id)
                      ?.skill === "listening"
                      ? "听力理解"
                      : "阅读理解")}
                </span>
              </div>
              <button className="quiet-button" onClick={() => review([id])}>
                复习 <ArrowRight size={16} />
              </button>
            </div>
          ))}
          {wordsToReview.length > 1 && (
            <button className="primary" onClick={() => review(wordsToReview)}>
              复习这些单词 <RotateCcw size={17} />
            </button>
          )}
        </section>
      ) : (
        <div className="empty-state">
          <CheckCircle2 size={30} />
          <h3>复习区空空的，很棒。</h3>
          <p>遇到需要巩固的知识，它们会在这里等你。</p>
        </div>
      )}
      <div className="section-heading">
        <h2>我的练习记录</h2>
        <span className="muted">只保存在这台设备</span>
      </div>
      {progress.sessions.length ? (
        <div className="session-list">
          {progress.sessions
            .slice()
            .reverse()
            .map((session) => (
              <div key={session.id}>
                <span className="icon-tint">
                  <Check size={18} />
                </span>
                <div>
                  <strong>{session.title}</strong>
                  <span>
                    {new Date(session.date).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <strong>
                  {session.score} / {session.total}
                </strong>
              </div>
            ))}
        </div>
      ) : (
        <p className="muted">完成第一组练习后，记录就会出现在这里。</p>
      )}
      <div className="privacy-note">
        <BookOpen size={20} />
        <p>
          学习不需要账号，进度保存在本浏览器。清除浏览器数据会清除新版记录；旧版学习数据保持不变。
        </p>
      </div>
    </>
  );
}

export default function App() {
  const initialPage = window.location.hash.slice(1);
  const [page, setPage] = useState(
    navigation.some(([id]) => id === initialPage) ? initialPage : "today",
  );
  const [stored, setStored] = useLocalStorageState(
    "sparks_learning_v2",
    emptyProgress,
  );
  const progress = normalizeProgress(stored);
  const [settings, setSettings] = useLocalStorageState("sparks_voice_v2", {
    lang: "en-GB",
    rate: 0.85,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activity, setActivity] = useState(null);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);
  function update(fn) {
    setStored((previous) => fn(normalizeProgress(previous)));
  }
  function showNotice(message) {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 6000);
  }
  function say(text, rate, onEnd, onError) {
    const accepted = speakText(
      text,
      rate || settings.rate || 0.85,
      onEnd,
      settings.lang || "en-GB",
      (error) => {
        showNotice("发音未成功播放，请检查浏览器语音与设备声音后重试。");
        onError?.(error);
      },
    );
    if (!accepted)
      showNotice("这个浏览器暂不支持朗读，请换用支持语音的浏览器。");
    return accepted;
  }
  useEffect(() => {
    function changed() {
      stopSpeech();
      const id = window.location.hash.slice(1);
      setPage(navigation.some(([key]) => key === id) ? id : "today");
      setActivity(null);
    }
    window.addEventListener("hashchange", changed);
    return () => {
      window.removeEventListener("hashchange", changed);
      stopSpeech();
      clearTimeout(noticeTimer.current);
    };
  }, []);
  useEffect(() => {
    function escape(event) {
      if (event.key === "Escape") setSettingsOpen(false);
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  function navigate(id) {
    stopSpeech();
    setActivity(null);
    setSettingsOpen(false);
    setPage(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function start(lesson) {
    stopSpeech();
    setActivity({ title: lesson.title, lesson, key: Date.now() });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function startTest(skill) {
    stopSpeech();
    setActivity({
      title:
        skill === "mixed"
          ? "综合小测"
          : skill === "listening"
            ? "听力练习"
            : "阅读练习",
      skill,
      questions: abilityQuestions.filter(
        (question) => skill === "mixed" || question.skill === skill,
      ),
      key: Date.now(),
    });
  }
  function review(ids) {
    const words = ids.map((id) => wordById[id]).filter(Boolean);
    const questions = [
      ...makeWordQuestions(words),
      ...abilityQuestions.filter((question) => ids.includes(question.id)),
    ];
    if (questions.length) {
      stopSpeech();
      setActivity({ title: "温故知新", questions, key: Date.now() });
    }
  }
  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        跳到内容
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#today"
            onClick={() => navigate("today")}
            aria-label="Sparks 首页"
          >
            <span className="brand-symbol">
              <Sparkles size={22} />
            </span>
            <strong>
              Sparks<span>KET 英语探索</span>
            </strong>
          </a>
          <nav aria-label="主要导航">
            {navigation.map(([id, label, Icon]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={page === id ? "page" : undefined}
                onClick={() => navigate(id)}
              >
                <Icon size={17} />
                <span>{label}</span>
              </a>
            ))}
          </nav>
          <button
            className={`icon-button settings-button ${settingsOpen ? "active" : ""}`}
            aria-label="发音设置"
            title="发音设置"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Settings2 size={20} />
          </button>
        </div>
      </header>
      {settingsOpen && (
        <section className="settings-panel" aria-label="发音设置">
          <div>
            <h3>听得清楚，学得轻松</h3>
            <button
              className="icon-button"
              aria-label="关闭设置"
              onClick={() => setSettingsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <label>
            英语口音
            <select
              value={settings.lang || "en-GB"}
              onChange={(event) => {
                stopSpeech();
                setSettings({ ...settings, lang: event.target.value });
              }}
            >
              <option value="en-GB">英式英语</option>
              <option value="en-US">美式英语</option>
            </select>
          </label>
          <label>
            朗读速度
            <input
              type="range"
              min="0.6"
              max="1"
              step="0.05"
              value={settings.rate || 0.85}
              onChange={(event) =>
                setSettings({ ...settings, rate: Number(event.target.value) })
              }
            />
          </label>
          <button
            className="quiet-button"
            onClick={() => say("Hello! Let’s learn English together.")}
          >
            <Volume2 size={17} /> 试听
          </button>
          <p className="tiny">
            音色取决于设备。课程音标为英式；音量请用设备调节。
          </p>
        </section>
      )}
      <main id="main-content" className="main-content">
        {activity ? (
          <Practice
            key={activity.key}
            activity={activity}
            progress={progress}
            say={say}
            exit={() => {
              stopSpeech();
              setActivity(null);
            }}
            seen={(id) =>
              update((p) => ({ ...p, seen: [...new Set([...p.seen, id])] }))
            }
            answer={(id, correct) =>
              update((p) => recordAnswer(p, id, correct))
            }
            complete={(session) =>
              update((p) => ({
                ...p,
                completed: session.lessonId
                  ? [...new Set([...p.completed, session.lessonId])]
                  : p.completed,
                sessions: [
                  ...p.sessions,
                  {
                    ...session,
                    id: activity.key,
                    date: new Date().toISOString(),
                  },
                ].slice(-100),
              }))
            }
          />
        ) : (
          <>
            <div className="page-heading">
              <div>
                <span className="eyebrow">{titles[page][0]}</span>
                <h1>{titles[page][1]}</h1>
              </div>
              <span className="progress-pill">
                <span className="green-dot" /> 已掌握{" "}
                {progress.mastered.filter((id) => wordById[id]).length} 个词
              </span>
            </div>
            {page === "today" && (
              <Today
                progress={progress}
                start={start}
                navigate={navigate}
                say={say}
              />
            )}
            {page === "learn" && (
              <Library progress={progress} start={start} say={say} />
            )}
            {page === "assessment" && (
              <Assessment
                startTest={startTest}
                progress={progress}
                update={update}
                say={say}
              />
            )}
            {page === "progress" && (
              <Progress progress={progress} review={review} />
            )}
          </>
        )}
      </main>
      <footer>
        <span>Sparks · 让好奇心，带着英语长大。</span>
        <span>无需账号 · 本地保存 · 慢慢学，也很好</span>
      </footer>
      {notice && (
        <div className="toast" role="alert">
          {notice}
          <button aria-label="关闭提示" onClick={() => setNotice("")}>
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
