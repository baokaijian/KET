export const emptyProgress = {
  seen: [],
  mastered: [],
  review: [],
  completed: [],
  sessions: [],
  days: {},
  draft: "",
};
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
  return result;
}
export function recordAnswer(progress, id, correct, date = new Date()) {
  const p = normalizeProgress(progress);
  const day = localDay(date);
  const unique = (items) => [...new Set(items)];
  return {
    ...p,
    mastered: correct
      ? unique([...p.mastered, id])
      : p.mastered.filter((item) => item !== id),
    review: correct
      ? p.review.filter((item) => item !== id)
      : unique([...p.review, id]),
    days: { ...p.days, [day]: (Number(p.days[day]) || 0) + 1 },
  };
}
export function countEnglishWords(text) {
  return (text.match(/[a-zA-Z]+(?:['’-][a-zA-Z]+)*/g) || []).length;
}
