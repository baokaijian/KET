import { dueReviews, localDay, normalizeProgress } from "./learningProgress.js";
import { getSpeakableWordText } from "./speechText.js";

export function buildDailyPlan(progress, curriculum, date = new Date()) {
  const p = normalizeProgress(progress);
  const day = localDay(date);
  const saved = p.dailyPlans[day];
  if (saved?.day === day && curriculum.childThemes.some((theme) => theme.id === saved.themeId) &&
    Array.isArray(saved.newWords) && saved.newWords.length <= 8 && new Set(saved.newWords).size === saved.newWords.length && saved.newWords.every((id) => curriculum.courseWordById[id]) &&
    Array.isArray(saved.review) && saved.review.length <= 20 && saved.review.every((item) => item && ["reading", "listening"].includes(item.skill) && (curriculum.courseWordById[item.id] || curriculum.courseQuestionById[item.id] || curriculum.childQuestionById[item.id])) &&
    (saved.readingStage === undefined || [1, 2].includes(saved.readingStage)) &&
    (!saved.vocabularyLessonId || [...curriculum.vocabularyLessons, ...curriculum.childThemes.map((theme) => theme.vocabulary)].some((lesson) => lesson.id === saved.vocabularyLessonId)) &&
    Number.isInteger(saved.backlog) && saved.backlog >= 0 && ["light", "story", "learn"].includes(saved.mode)) return saved;
  const due = dueReviews(p, date).filter((item) => curriculum.courseWordById[item.id] || curriculum.courseQuestionById[item.id] || curriculum.childQuestionById[item.id]);
  const light = date.getDay() === 0 && p.seen.length > 0;
  const integration = date.getDay() === 6 && p.seen.length > 0;
  const foundation = curriculum.childThemes.find((item) => item.vocabulary.words.some((word) => !p.seen.includes(word.id)) || [item.sentences, item.story].some((lesson) => !p.completed.includes(lesson.id)));
  const readingStage = foundation ? 1 : 2;
  const theme = foundation || curriculum.childThemes.find((item) => !p.completed.includes(item.longStory.id)) || curriculum.childThemes[Math.floor(date.getTime() / 86_400_000) % curriculum.childThemes.length];
  const vocabulary = foundation ? theme.vocabulary : curriculum.vocabularyLessons.find((lesson) => lesson.words.some((word) => !p.seen.includes(word.id)));
  const newLimit = light || integration ? 0 : due.length > 20 ? 4 : 8;
  const newWords = (vocabulary?.words || []).filter((word) => !p.seen.includes(word.id)).slice(0, newLimit).map((word) => word.id);
  return { day, themeId: theme.id, readingStage, vocabularyLessonId: vocabulary?.id || "", newWords, review: due.slice(0, 20).map(({ id, skill }) => ({ id, skill })), backlog: Math.max(0, due.length - 20), mode: light ? "light" : integration ? "story" : "learn" };
}

export function dailyVocabularyLesson(plan, theme, curriculum, progress) {
  const words = plan.newWords.map((id) => curriculum.courseWordById[id]);
  const base = curriculum.vocabularyLessons.find((lesson) => lesson.id === plan.vocabularyLessonId) || theme.vocabulary;
  const covered = base.words.every((word) => progress.seen.includes(word.id) || plan.newWords.includes(word.id));
  return { ...base, id: `daily-words-${plan.day}`, completionId: covered ? base.id : "", words,
    questions: curriculum.vocabularyQuestions(words) };
}

export function saveDailyPlan(progress, plan) {
  const p = normalizeProgress(progress);
  return { ...p, dailyPlans: { ...p.dailyPlans, [plan.day]: plan } };
}

export function reviewQuestions(items, curriculum) {
  return items.map(({ id, skill }, index) => {
    const word = curriculum.courseWordById[id];
    if (!word) return curriculum.childQuestionById[id] || curriculum.courseQuestionById[id];
    const question = curriculum.vocabularyQuestions([word])[0];
    const offset = index % question.options.length;
    const options = [...question.options.slice(offset), ...question.options.slice(0, offset)];
    return { ...question, id: `scheduled-${id}-${skill}`, skill,
      options, answer: (question.answer - offset + options.length) % options.length,
      ...(skill === "listening" ? { type: "listening", audio: getSpeakableWordText(word), prompt: "听一听，选择这个词的意思。" } : { type: "meaning" }),
      reviewOrder: index,
    };
  }).filter(Boolean);
}
