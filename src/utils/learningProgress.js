export const emptyProgress = {
  seen: [],
  mastered: [],
  review: [],
  completed: [],
  sessions: [],
  days: {},
  draft: "",
  drafts: {},
  selfReviews: [],
  memory: {},
  dailyPlans: {},
};
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function retainedWord(skills) {
  return ["reading", "listening"].every((skill) => skills?.[skill]?.successDays.length >= 3 && skills[skill].lastCorrect);
}
function validDay(day) {
  if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T12:00:00`);
  return !Number.isNaN(date.getTime()) && localDay(date) === day;
}
export function normalizeProgress(value) {
  const result = { ...emptyProgress };
  for (const key of ["seen", "mastered", "review", "completed", "sessions"])
    result[key] = Array.isArray(value?.[key]) ? value[key] : [];
  result.days =
    value?.days && typeof value.days === "object" && !Array.isArray(value.days)
      ? value.days
      : {};
  result.draft = typeof value?.draft === "string" ? value.draft : "";
  result.drafts = value?.drafts && typeof value.drafts === "object" && !Array.isArray(value.drafts)
    ? Object.fromEntries(Object.entries(value.drafts).filter(([, text]) => typeof text === "string"))
    : {};
  result.selfReviews = Array.isArray(value?.selfReviews) ? value.selfReviews : [];
  result.memory = {};
  for (const [id, skills] of Object.entries(value?.memory && typeof value.memory === "object" ? value.memory : {})) {
    if (!skills || typeof skills !== "object") continue;
    const valid = Object.fromEntries(Object.entries(skills).filter(([skill, item]) => ["reading", "listening"].includes(skill) && item && validDay(item.due) && validDay(item.lastDay) && Number.isInteger(item.step) && item.step >= 0 && item.step <= 7 && Array.isArray(item.successDays) && item.successDays.every(validDay) && typeof item.lastCorrect === "boolean")
      .map(([skill, item]) => [skill, { ...item, successDays: [...new Set(item.successDays)] }]));
    if (Object.keys(valid).length) result.memory[id] = valid;
  }
  result.dailyPlans = value?.dailyPlans && typeof value.dailyPlans === "object" && !Array.isArray(value.dailyPlans) ? value.dailyPlans : {};
  // Old single-answer mastery is not evidence of retention across days.
  result.mastered = result.mastered.filter((id) => retainedWord(result.memory[id]));
  return result;
}
export function dayAfter(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return localDay(next);
}
export const reviewGaps = [1, 2, 4, 7, 16, 30, 60];

export function recordEncounter(progress, id, date = new Date()) {
  const p = normalizeProgress(progress);
  const skills = { ...p.memory[id] };
  for (const skill of ["reading", "listening"]) {
    if (!skills[skill]) skills[skill] = { step: 0, due: dayAfter(date, 1), lastDay: localDay(date), successDays: [], lastCorrect: false, assessed: false };
  }
  return { ...p, seen: [...new Set([...p.seen, id])], memory: { ...p.memory, [id]: skills } };
}

export function recordAnswer(progress, id, correct, date = new Date(), { skill = "reading", hinted = false } = {}) {
  const p = normalizeProgress(progress);
  const day = localDay(date);
  const unique = (items) => [...new Set(items)];
  const old = p.memory[id]?.[skill];
  const independent = correct && !hinted;
  const newDay = old?.lastDay !== day;
  const eligible = old?.assessed === false || (newDay && (!old || old.due <= day));
  const successDays = independent && eligible ? unique([...(old?.successDays || []), day]) : old?.successDays || [];
  const step = !independent ? 0 : eligible ? Math.min((old?.step || 0) + 1, 7) : old?.step || 0;
  const memory = { ...p.memory, [id]: { ...p.memory[id], [skill]: {
    step, successDays: correct ? successDays : [], lastDay: day,
    due: independent && !eligible && old ? old.due : dayAfter(date, independent ? reviewGaps[Math.max(0, step - 1)] : 1),
    lastCorrect: independent,
    assessed: true,
  } } };
  const retained = retainedWord(memory[id]);
  return {
    ...p,
    memory,
    mastered: retained
      ? unique([...p.mastered, id])
      : p.mastered.filter((item) => item !== id),
    review: independent && Object.values(memory[id]).every((item) => item.assessed === false || item.lastCorrect)
      ? p.review.filter((item) => item !== id)
      : !correct ? unique([...p.review, id]) : p.review,
    days: { ...p.days, [day]: (Number(p.days[day]) || 0) + 1 },
  };
}

export function dueReviews(progress, date = new Date()) {
  const p = normalizeProgress(progress);
  const day = localDay(date);
  return Object.entries(p.memory).flatMap(([id, skills]) => Object.entries(skills)
    .filter(([, item]) => item.due <= day).map(([skill, item]) => ({ id, skill, ...item })))
    .sort((a, b) => Number(a.lastCorrect) - Number(b.lastCorrect) || a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
}
export function countEnglishWords(text) {
  return (text.match(/[a-zA-Z]+(?:['’-][a-zA-Z]+)*/g) || []).length;
}
