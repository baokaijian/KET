import { BookOpen, Headphones, RotateCcw, ArrowRight, CheckCircle2, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import WordIllustration from "./WordIllustration.jsx";
import { buildDailyPlan, dailyVocabularyLesson, reviewQuestions } from "../utils/dailyPlan.js";
import { getSpeakableWordText } from "../utils/speechText.js";

export default function DailyLearning({ curriculum, progress, launch, save, say }) {
  const [date, setDate] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setDate(new Date());
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  if (!curriculum?.childThemes) return <p role="status">正在准备今天的听读计划…</p>;
  const plan = buildDailyPlan(progress, curriculum, date);
  const theme = curriculum.childThemes.find((item) => item.id === plan.themeId);
  const words = plan.newWords.map((id) => curriculum.courseWordById[id]);
  const vocabulary = dailyVocabularyLesson(plan, theme, curriculum, progress);
  const story = plan.readingStage === 2 ? theme.longStory : theme.story;
  const begin = (lesson) => { save(plan); launch(lesson); };
  return <section className="daily-child" aria-label="今日听读计划">
    <div className="section-heading"><div><span className="eyebrow">LISTEN · READ · DISCOVER</span><h2>{theme.title}</h2></div><span className="muted">{plan.mode === "light" ? "轻量复习日" : plan.mode === "story" ? "综合故事日" : "20–25 分钟 · 可以分三次学"}</span></div>
    <div className="daily-task-list">
      <article><RotateCcw size={23} /><div><h3>复习老朋友</h3><p>{plan.review.length ? `${plan.review.length} 项到期复习` : "今天还没有到期的复习"}{plan.backlog > 0 ? ` · 另有 ${plan.backlog} 项保留在队列中` : ""}</p></div><button className="secondary" disabled={!plan.review.length} onClick={() => begin({ id: `daily-review-${plan.day}`, title: "复习老朋友", skill: "mixed", questions: reviewQuestions(plan.review, curriculum) })}>开始复习</button></article>
      <article><BookOpen size={23} /><div><h3>认识新朋友</h3><p>{words.length ? `${words.length} 个新词 · 听音与认读，不用拼写` : plan.mode === "learn" ? "今天的词已经见过啦，继续听读句子" : "今天不安排强制新词"}</p></div><button className="primary" disabled={!words.length} onClick={() => begin(vocabulary)}>开始学习 <ArrowRight size={16} /></button></article>
      <article><Headphones size={23} /><div><h3>听懂句子</h3><p>6 个句子 · 先听，再理解</p></div><button className="secondary" onClick={() => begin(theme.sentences)}>{progress.completed.includes(theme.sentences.id) ? <CheckCircle2 size={17} /> : null}听读句子</button></article>
      <article><BookOpen size={23} /><div><h3>{plan.readingStage === 2 ? "阅读进阶故事" : "阅读小故事"}</h3><p>{plan.readingStage === 2 ? "分句听读 · 慢慢连成一篇" : "1 篇生活故事"} · {story.questions.length} 道理解题</p></div><button className="secondary" onClick={() => begin(story)}>{progress.completed.includes(story.id) ? <CheckCircle2 size={17} /> : null}打开故事</button></article>
    </div>
    {!!words.length && <><div className="section-heading"><h2>今天的新朋友</h2><span className="tiny">听一听，看看它的意思</span></div><div className="word-grid">{words.map((word) => <article className="preview-word" key={word.id}><WordIllustration word={word} /><div className="word-caption"><div><h3 lang="en">{word.word}</h3><small className="part-of-speech">{word.partOfSpeechLabel}</small><p>{word.translation}</p></div><button className="icon-button" aria-label={`听 ${word.word} 的发音`} title={`听 ${word.word} 的发音`} onClick={() => say(getSpeakableWordText(word))}><Headphones size={19} /></button></div>{word.image && word.image.meaning !== word.translation && <p className="tiny">照片对应：{word.image.meaning}</p>}{word.image?.context && <div className="photo-context"><div><p lang="en">{word.image.context.sentence}</p><p className="translation">{word.image.context.translation}</p></div><button className="icon-button" aria-label={`听 ${word.word} 的图片例句`} title={`听 ${word.word} 的图片例句`} onClick={() => say(word.image.context.sentence)}><Volume2 size={17} /></button></div>}</article>)}</div></>}
    <p className="tiny">学习当天再见一次，之后逐步延长复习间隔。听懂和读懂分别记录；漏学不清零，复习多时自动减少新词。</p>
  </section>;
}
