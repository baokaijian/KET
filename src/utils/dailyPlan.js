import { dueReviews, localDay, normalizeProgress, dayAfter } from "./learningProgress.js";
import { getSpeakableWordText } from "./speechText.js";

// These are teaching defaults chosen for a six-year-old's daily rhythm, not laws:
// reviews arrive in small batches, a normal day has a review budget, new intake
// yields when the next week already looks heavy, and a heavy queue is met with
// familiar stories instead of nine brand-new questions.
export const REVIEW_BATCH_SIZE = 10;
export const REVIEW_DAILY_LIMIT = 30;
export const FORECAST_DAYS = 7;
export const CATCHUP_RATIO = 2;
// A day whose known load already fills this much of the review budget is not a
// "no backlog" day: keep the eight-word day for genuinely light days.
export const NEW_WORD_FULL_LIMIT = REVIEW_DAILY_LIMIT - 5;
export const NEW_WORD_TARGETS = { full: 8, reduced: 4, minimum: 2 };

function childReviewAllowed(id, curriculum) {
  if (curriculum.courseWordById[id]) return true;
  const question = curriculum.childQuestionById[id] || curriculum.courseQuestionById[id];
  return Boolean(question && !["input", "spelling"].includes(question.type));
}

// How many already-scheduled items first come due on each of the next `days`
// days. Only items that can actually reach a child review are counted, so
// parent-area typing practice never pushes the child's new-word volume down.
// Limitation: this is the *known* schedule only - items not yet recorded and
// future re-scheduling are invisible to the forecast.
function forecastFrom(p, curriculum, date, days = FORECAST_DAYS) {
  const targets = Array.from({ length: days }, (_, index) => dayAfter(date, index + 1));
  const load = new Array(days).fill(0);
  for (const [id, skills] of Object.entries(p.memory)) {
    if (!childReviewAllowed(id, curriculum)) continue;
    for (const item of Object.values(skills)) {
      const index = targets.findIndex((day) => item.due <= day);
      if (index !== -1) load[index] += 1;
    }
  }
  return load;
}

export function reviewLoadForecast(progress, curriculum, date = new Date(), days = FORECAST_DAYS) {
  return forecastFrom(normalizeProgress(progress), curriculum, date, days);
}

// A lesson can be re-read as "familiar" only when the child already answered all
// of its questions, so re-reading it adds no new scheduled questions.
function familiarLessons(progress, curriculum, readingStage) {
  const answered = (lesson) => Boolean(lesson) && lesson.questions.length > 0 &&
    progress.completed.includes(lesson.id) && lesson.questions.every((question) => progress.memory[question.id]);
  for (const theme of [...curriculum.childThemes].reverse()) {
    const stageStory = readingStage === 2 && theme.longStory ? theme.longStory : theme.story;
    const sentencesLessonId = answered(theme.sentences) ? theme.sentences.id : "";
    const storyLessonId = answered(stageStory) ? stageStory.id : answered(theme.story) ? theme.story.id : "";
    if (sentencesLessonId || storyLessonId) return { sentencesLessonId, storyLessonId };
  }
  return { sentencesLessonId: "", storyLessonId: "" };
}

// New words come from the day's theme first, then top up from the bank so a
// nearly finished theme can never shrink a day below the minimum.
function newWordCandidates(p, curriculum, vocabulary) {
  const unseenIn = (lesson) => (lesson?.words || []).filter((word) => !p.seen.includes(word.id)).map((word) => word.id);
  const candidates = unseenIn(vocabulary);
  if (candidates.length < NEW_WORD_TARGETS.minimum) {
    for (const lesson of curriculum.vocabularyLessons) {
      for (const id of unseenIn(lesson)) if (!candidates.includes(id)) candidates.push(id);
      if (candidates.length >= NEW_WORD_TARGETS.minimum) break;
    }
  }
  return candidates;
}

function storedPlanUsable(saved, day, curriculum) {
  if (!saved || saved.day !== day) return false;
  if (!curriculum.childThemes.some((theme) => theme.id === saved.themeId)) return false;
  if (!Array.isArray(saved.newWords) || saved.newWords.length > NEW_WORD_TARGETS.full ||
    new Set(saved.newWords).size !== saved.newWords.length ||
    !saved.newWords.every((id) => curriculum.courseWordById[id])) return false;
  if (!Array.isArray(saved.review) || saved.review.length > REVIEW_DAILY_LIMIT ||
    !saved.review.every((item) => item && ["reading", "listening"].includes(item.skill) && childReviewAllowed(item.id, curriculum))) return false;
  if (saved.readingStage !== undefined && ![1, 2].includes(saved.readingStage)) return false;
  if (saved.vocabularyLessonId && ![...curriculum.vocabularyLessons, ...curriculum.childThemes.map((theme) => theme.vocabulary)].some((lesson) => lesson.id === saved.vocabularyLessonId)) return false;
  if (!Number.isInteger(saved.backlog) || saved.backlog < 0) return false;
  if (!["light", "story", "learn", "catchup"].includes(saved.mode)) return false;
  const lessonIds = new Set(curriculum.childLessons.map((lesson) => lesson.id));
  const lessonKnown = (id) => id === undefined || id === "" || lessonIds.has(id);
  if (!lessonKnown(saved.sentencesLessonId) || !lessonKnown(saved.storyLessonId)) return false;
  if (saved.reviewLimit !== undefined && saved.reviewLimit !== REVIEW_DAILY_LIMIT) return false;
  if (saved.batchSize !== undefined && saved.batchSize !== REVIEW_BATCH_SIZE) return false;
  if (saved.forecast !== undefined && (!Array.isArray(saved.forecast) || saved.forecast.length !== FORECAST_DAYS ||
    !saved.forecast.every((value) => Number.isInteger(value) && value >= 0))) return false;
  if (saved.pressure !== undefined && (!Number.isInteger(saved.pressure) || saved.pressure < 0)) return false;
  if (saved.newQuestions !== undefined && (!Number.isInteger(saved.newQuestions) || saved.newQuestions < 0)) return false;
  if (saved.familiar !== undefined && typeof saved.familiar !== "boolean") return false;
  // Plans saved before the batch fields existed are still honoured for that day.
  return true;
}

export function buildDailyPlan(progress, curriculum, date = new Date()) {
  const p = normalizeProgress(progress);
  const day = localDay(date);
  const saved = p.dailyPlans[day];
  if (storedPlanUsable(saved, day, curriculum)) return saved;
  const due = dueReviews(p, date).filter((item) => childReviewAllowed(item.id, curriculum));
  const forecast = forecastFrom(p, curriculum, date, FORECAST_DAYS);
  const pressure = Math.max(due.length, ...forecast);
  const ratio = pressure / REVIEW_DAILY_LIMIT;
  const light = date.getDay() === 0 && p.seen.length > 0;
  const integration = date.getDay() === 6 && p.seen.length > 0;
  const foundation = curriculum.childThemes.find((item) => item.vocabulary.words.some((word) => !p.seen.includes(word.id)) || [item.sentences, item.story].some((lesson) => !p.completed.includes(lesson.id)));
  const readingStage = foundation ? 1 : 2;
  const theme = foundation || curriculum.childThemes.find((item) => !p.completed.includes(item.longStory.id)) || curriculum.childThemes[Math.floor(date.getTime() / 86_400_000) % curriculum.childThemes.length];
  // Keep new vocabulary moving even while the theme's stories wait for a calm day.
  const themeHasNewWords = theme.vocabulary.words.some((word) => !p.seen.includes(word.id));
  const vocabulary = themeHasNewWords
    ? theme.vocabulary
    : curriculum.vocabularyLessons.find((lesson) => lesson.words.some((word) => !p.seen.includes(word.id))) || theme.vocabulary;
  const weekend = light || integration;
  const newLimit = weekend ? 0
    : pressure < NEW_WORD_FULL_LIMIT ? NEW_WORD_TARGETS.full
      : pressure <= REVIEW_DAILY_LIMIT * CATCHUP_RATIO ? NEW_WORD_TARGETS.reduced
        : NEW_WORD_TARGETS.minimum;
  const newWords = newWordCandidates(p, curriculum, vocabulary).slice(0, newLimit);
  // A heavy queue is met with material the child already met: same questions, no new schedule.
  // This also applies on weekends, so an integration or light day never quietly adds nine
  // new comprehension questions while the queue is already over budget.
  const familiar = ratio > CATCHUP_RATIO ? familiarLessons(p, curriculum, readingStage) : { sentencesLessonId: "", storyLessonId: "" };
  const familiarReady = Boolean(familiar.sentencesLessonId || familiar.storyLessonId);
  const sentencesLessonId = familiarReady ? familiar.sentencesLessonId : theme.sentences.id;
  const storyLessonId = familiarReady ? familiar.storyLessonId : readingStage === 2 ? theme.longStory.id : theme.story.id;
  const offered = [sentencesLessonId, storyLessonId].filter(Boolean)
    .map((id) => curriculum.childLessons.find((lesson) => lesson.id === id)).filter(Boolean);
  const newQuestions = offered.reduce((sum, lesson) => sum + lesson.questions.filter((question) => !p.memory[question.id]).length, 0);
  return {
    day,
    themeId: theme.id,
    readingStage,
    vocabularyLessonId: vocabulary?.id || "",
    newWords,
    review: due.slice(0, REVIEW_DAILY_LIMIT).map(({ id, skill }) => ({ id, skill })),
    reviewLimit: REVIEW_DAILY_LIMIT,
    batchSize: REVIEW_BATCH_SIZE,
    backlog: Math.max(0, due.length - REVIEW_DAILY_LIMIT),
    mode: light ? "light" : integration ? "story" : familiarReady ? "catchup" : "learn",
    familiar: familiarReady,
    pressure,
    forecast,
    sentencesLessonId,
    storyLessonId,
    newQuestions,
  };
}

// Which reading lessons today actually offers. A legacy plan saved before these
// fields existed has `undefined`: that means "use the theme's own lessons" (the
// old behaviour). Only an explicit empty string means the day offers no new
// reading task, so a stale stored plan never loses its sentence and story entry.
export function planReadingLessons(plan, theme, lessonById = {}) {
  const stageStory = plan.readingStage === 2 && theme.longStory ? theme.longStory : theme.story;
  const resolve = (id, fallback) => (id === "" ? null : lessonById[id] || fallback || null);
  return {
    sentences: resolve(plan.sentencesLessonId, theme.sentences),
    story: resolve(plan.storyLessonId, stageStory),
    legacy: plan.sentencesLessonId === undefined && plan.storyLessonId === undefined,
  };
}

export function dailyVocabularyLesson(plan, theme, curriculum, progress) {
  const words = plan.newWords.map((id) => curriculum.courseWordById[id]);
  const base = curriculum.vocabularyLessons.find((lesson) => lesson.id === plan.vocabularyLessonId) || theme.vocabulary;
  const covered = base.words.every((word) => progress.seen.includes(word.id) || plan.newWords.includes(word.id));
  return { ...base, id: `daily-words-${plan.day}`, completionId: covered ? base.id : "", words,
    questions: curriculum.vocabularyQuestions(words, base.words) };
}

export function saveDailyPlan(progress, plan) {
  const p = normalizeProgress(progress);
  return { ...p, dailyPlans: { ...p.dailyPlans, [plan.day]: plan } };
}

// The day's review is split into fixed batches. A batch keeps its members, its
// order and its id while the child works through it, so leaving and coming back
// restores the same practice snapshot (including "I already heard this passage")
// and the answer positions stay where they were. The next batch only appears
// once every question is answered and its saved feedback/correction is finished.
export function reviewBatch(plan, progress, { batchSize = REVIEW_BATCH_SIZE, dailyLimit = REVIEW_DAILY_LIMIT, unfinishedBatches = [] } = {}) {
  const memory = progress?.memory || {};
  const items = Array.isArray(plan.review) ? plan.review : [];
  const size = plan.batchSize ?? batchSize;
  const limit = plan.reviewLimit ?? dailyLimit;
  const answeredItem = (item) => {
    const saved = memory[item.id]?.[item.skill];
    // A same-day encounter or an imported overdue record is not a completed review.
    return saved?.lastDay === plan.day && saved.assessed !== false && saved.due > plan.day;
  };
  const answered = items.filter(answeredItem).length;
  const batches = [];
  for (let index = 0; index < items.length; index += size) batches.push(items.slice(index, index + size));
  let batchIndex = batches.findIndex((batch, index) => unfinishedBatches.includes(index) || batch.some((item) => !answeredItem(item)));
  if (batchIndex === -1) batchIndex = batches.length;
  const batch = batches[batchIndex] || [];
  return {
    answered,
    remaining: Math.max(0, limit - answered),
    total: items.length,
    batchIndex,
    batches: batches.length,
    batch,
    unanswered: batch.filter((item) => !answeredItem(item)).length,
    pending: unfinishedBatches.includes(batchIndex),
    done: batchIndex >= batches.length,
  };
}

export function reviewQuestions(items, curriculum) {
  return items.filter(({ id }) => childReviewAllowed(id, curriculum)).map(({ id, skill }, index) => {
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
