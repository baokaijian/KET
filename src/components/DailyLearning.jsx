import { BookOpen, Headphones, RotateCcw, ArrowRight, CheckCircle2, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import WordIllustration from "./WordIllustration.jsx";
import { buildDailyPlan, dailyVocabularyLesson, planReadingLessons, reviewBatch, reviewBatches, reviewQuestions, REVIEW_BATCH_SIZE, REVIEW_DAILY_LIMIT } from "../utils/dailyPlan.js";
import { getSpeakableWordText } from "../utils/speechText.js";
import { safeReadStorage } from "../hooks/useLocalStorageState.js";
import { practiceFingerprint, resumablePractice } from "../utils/practiceSession.js";

function reviewSummary(plan, review) {
  if (!review.total) return plan.deferredReviews?.length ? "复习稍后回来，先听读今天的内容" : "今天还没有到期的复习";
  if (!review.ready) return "复习间隔还没到，先听读今天的内容";
  if (review.done) return `今天已完成 ${review.answered} 项复习，剩下的明天再来`;
  const head = review.answered ? `已完成 ${review.answered} / ${review.total} 项` : `${review.total} 项到期复习`;
  const parts = [head, review.pending && !review.unanswered ? "本批还有订正或结果待完成" : `本批还剩 ${review.unanswered} 题`];
  if (review.batches > 1) parts.push(`共 ${review.batches} 批，答完一批再换下一批`);
  if (plan.backlog > 0) parts.push(`另有 ${plan.backlog} 项保留在队列中`);
  return parts.join(" · ");
}

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
  const lessonById = Object.fromEntries((curriculum.childLessons || []).map((lesson) => [lesson.id, lesson]));
  // undefined = a day plan saved before the fields existed -> keep the theme's own
  // sentence and story lessons; only "" means "no new reading task today".
  const { sentences, story, legacy: legacyReading } = planReadingLessons(plan, theme, lessonById);
  const batchSize = plan.batchSize ?? REVIEW_BATCH_SIZE;
  const unfinishedBatches = [];
  for (const [batchIndex, batch] of reviewBatches(plan, batchSize).entries()) {
    const questions = reviewQuestions(batch, curriculum);
    const saved = safeReadStorage(`sparks_activity_daily-review-${plan.day}-b${batchIndex}`, null);
    if (saved?.stage === "quiz" && resumablePractice(saved, practiceFingerprint([], questions), 0, questions.length)) unfinishedBatches.push(batchIndex);
  }
  const review = reviewBatch(plan, progress, { batchSize: REVIEW_BATCH_SIZE, dailyLimit: REVIEW_DAILY_LIMIT, unfinishedBatches, date });
  const batchTitle = review.batchIndex === 0 ? "复习老朋友" : `复习老朋友 · 第 ${review.batchIndex + 1} 批`;
  const catchingUp = plan.familiar === true || (plan.mode === "catchup" && !legacyReading);
  const readingPaused = !sentences || !story;
  const light = plan.mode === "light";
  const storyDay = plan.mode === "story";
  const explainPlan = () => say([
    `今天的主题是${theme.title}。`,
    review.batch.length && review.ready && !review.done ? `先复习老朋友，点击${review.answered ? "继续复习" : "开始复习"}，每次最多${batchSize}题。` : "今天的复习还没准备好或已经完成，可以先看看其他内容。",
    words.length ? `认识${words.length}个新朋友，点击开始学习。先听单词，再看它的意思，不用拼写。` : "今天不需要认识新的单词。",
    sentences ? `点击${catchingUp ? "再读一遍" : "听读句子"}，先听一听，再选答案。` : "今天不用做新的句子题。",
    story ? `点击${catchingUp ? "读熟悉的故事" : "打开故事"}，${catchingUp ? "再听读一个学过的故事" : "读一个小故事"}。` : "今天不用做新的故事题。",
    "一次学一点，累了可以休息，下次继续。",
  ].join(""), 0.9, undefined, undefined, "zh-CN");
  const begin = (lesson) => { save(plan); launch(lesson); };
  return <section className="daily-child" aria-label="今日听读计划">
    <div className="section-heading"><div><span className="eyebrow">LISTEN · READ · DISCOVER</span><div className="daily-title"><h2>{theme.title}</h2><button type="button" className="icon-button" aria-label="听今天的安排" title="听今天的安排" onClick={explainPlan}><Volume2 size={19} /></button></div></div><span className="muted">{light ? "轻量复习日" : storyDay ? "综合故事日" : catchingUp ? "老朋友读熟一点 · 今天不加新阅读题" : "20–25 分钟 · 可以分三次学"}</span></div>
    <div className="daily-task-list">
      <article><RotateCcw size={23} /><div><h3>复习老朋友</h3><p>{reviewSummary(plan, review)}</p></div><button className="secondary" disabled={review.done || !review.ready || !review.batch.length || (!review.remaining && !review.pending)} onClick={() => begin({ id: `daily-review-${plan.day}-b${review.batchIndex}`, title: batchTitle, skill: "mixed", questions: reviewQuestions(review.batch, curriculum) })}>{review.answered ? "继续复习" : "开始复习"}</button></article>
      <article><BookOpen size={23} /><div><h3>认识新朋友</h3><p>{words.length ? `${words.length} 个新词 · 听音与认读，不用拼写` : plan.mode === "light" || plan.mode === "story" ? "今天不安排强制新词" : "今天的词已经见过啦，继续听读句子"}</p></div><button className="primary" disabled={!words.length} onClick={() => begin(vocabulary)}>开始学习 <ArrowRight size={16} /></button></article>
      <article><Headphones size={23} /><div><h3>{catchingUp ? "熟悉句子听读" : "听懂句子"}</h3><p>{sentences ? catchingUp ? "6 个学过的句子 · 只复习，不加新题" : "6 个句子 · 先听，再理解" : light || storyDay ? "今天只安排故事听读" : "先完成复习，今天不加新的句子题"}</p></div>{sentences ? <button className="secondary" onClick={() => begin(sentences)}>{progress.completed.includes(sentences.id) ? <CheckCircle2 size={17} /> : null}{catchingUp ? "再读一遍" : "听读句子"}</button> : <span className="tiny">今天不加新题</span>}</article>
      <article><BookOpen size={23} /><div><h3>{catchingUp ? "熟悉故事听读" : plan.readingStage === 2 ? "阅读进阶故事" : "阅读小故事"}</h3><p>{story ? `${catchingUp ? "读过的故事 · 不再新增理解题" : plan.readingStage === 2 ? "分句听读 · 慢慢连成一篇" : "1 篇生活故事"} · ${story.questions.length} 道理解题` : light ? "今天先复习，不加新故事；可以到学习天地自由听读" : "先完成复习，今天不加新的故事题"}</p></div>{story ? <button className="secondary" onClick={() => begin(story)}>{progress.completed.includes(story.id) ? <CheckCircle2 size={17} /> : null}{catchingUp ? "读熟悉的故事" : "打开故事"}</button> : <span className="tiny">今天不加新题</span>}</article>
    </div>
    {!!words.length && <><div className="section-heading"><h2>今天的新朋友</h2><span className="tiny">听一听，看看它的意思</span></div><div className="word-grid">{words.map((word) => <article className="preview-word" key={word.id}><WordIllustration word={word} /><div className="word-caption"><div><h3 lang="en">{word.word}</h3><small className="part-of-speech">{word.partOfSpeechLabel}</small><p>{word.translation}</p></div><button className="icon-button" aria-label={`听 ${word.word} 的发音`} title={`听 ${word.word} 的发音`} onClick={() => say(getSpeakableWordText(word))}><Headphones size={19} /></button></div>{word.image && word.image.meaning !== word.translation && <p className="tiny">照片对应：{word.image.meaning}</p>}{word.image?.context && <div className="photo-context"><div><p lang="en">{word.image.context.sentence}</p><p className="translation">{word.image.context.translation}</p></div><button className="icon-button" aria-label={`听 ${word.word} 的图片例句`} title={`听 ${word.word} 的图片例句`} onClick={() => say(word.image.context.sentence)}><Volume2 size={17} /></button></div>}</article>)}</div></>}
    <p className="tiny">学习当天再见一次，之后逐步延长复习间隔；听懂和读懂分别记录。复习每批最多 {batchSize} 题、一天通常不超过 {plan.reviewLimit ?? REVIEW_DAILY_LIMIT} 题，批次题目固定，答过的不用再答一遍；未来一周已知负荷偏高时先减少新词{readingPaused ? "，并减少新的阅读题" : ""}，今天最多新增 {plan.newQuestions} 道阅读题，漏学不清零。</p>
  </section>;
}
