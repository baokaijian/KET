import { normalizeProgress, recordAnswer, retainDailyPlans } from "../utils/learningProgress.js";

export const PROGRESS_KEY = "sparks_learning_v2";
export const syncedKey = (key) => [PROGRESS_KEY, "sparks_voice_v2", "sparks_course_unit", "sparks_advanced_courses"].includes(key) || key.startsWith("sparks_activity_");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const object = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const union = (a = [], b = []) => [...new Set([...a, ...b])];

// A patch contains only changed units. A word/skill and an activity checkpoint
// stay atomic; merging their individual fields would invent learning evidence.
export function changesFor(key, previous, next) {
  if (!syncedKey(key) || same(previous, next)) return [];
  if (key !== PROGRESS_KEY) return [{ key, type: "value", before: previous ?? null, after: next }];
  const before = normalizeProgress(previous);
  const after = normalizeProgress(next);
  const changes = [];
  function add(type, path, old, value) {
    if (!same(old, value)) changes.push({ key, type, path, before: old ?? null, after: value ?? null });
  }
  for (const field of ["seen", "completed", "review", "selfReviews"]) {
    for (const id of union(before[field], after[field])) {
      add("membership", [field, id], before[field].includes(id), after[field].includes(id));
    }
  }
  for (const [day, count] of Object.entries(after.days)) {
    const delta = Number(count) - (Number(before.days[day]) || 0);
    if (delta > 0) changes.push({ key, type: "count", path: ["days", day], after: delta });
  }
  for (const id of union(Object.keys(before.memory), Object.keys(after.memory))) {
    for (const skill of ["reading", "listening"]) add("memory", ["memory", id, skill], before.memory[id]?.[skill], after.memory[id]?.[skill]);
  }
  for (const field of ["drafts", "dailyPlans"]) {
    for (const id of union(Object.keys(before[field]), Object.keys(after[field]))) {
      // Retention is a projection, not a deletion of cloud history.
      if (field === "dailyPlans" && !after[field][id]) continue;
      add(field === "drafts" ? "draft" : "plan", [field, id], before[field][id], after[field][id]);
    }
  }
  add("draft", ["draft"], before.draft, after.draft);
  const oldSessions = new Set(before.sessions.map((session) => session.id));
  for (const session of after.sessions) if (!oldSessions.has(session.id)) changes.push({ key, type: "session", after: session });
  return changes;
}

function rememberConflict(snapshot, operation, change, text) {
  if (typeof text !== "string" || !text) return;
  const id = `${operation.id}:${change.path?.join("/") || change.key}`;
  if (!snapshot.conflicts.some((item) => item.id === id)) snapshot.conflicts.push({ id, task: change.path?.[1] || "旧版草稿", text });
}

function mergeCheckpoint(before, current, after) {
  if (!current) return after;
  if (current.fingerprint !== after?.fingerprint) return same(before, current) ? after : current;
  if (current.stage === "result" && same(before, current)) return after;
  const rank = (value) => ({ guide: 0, learn: 1, quiz: 2, result: 3 }[value.stage] ?? 0) * 100000 + (value.index || 0) * 100 + (value.responses?.length || 0);
  return rank(after) > rank(current) || rank(after) === rank(current) && same(before, current) ? after : current;
}

export function applyOperations(base, operations) {
  const snapshot = structuredClone({ values: object(base?.values), conflicts: Array.isArray(base?.conflicts) ? base.conflicts : [] });
  for (const operation of operations) for (const change of operation.changes) {
    if (!syncedKey(change.key)) continue;
    if (change.type === "value") {
      const current = snapshot.values[change.key];
      if (change.key.startsWith("sparks_activity_")) snapshot.values[change.key] = mergeCheckpoint(change.before, current, change.after);
      else if (change.key === "sparks_voice_v2") {
        const merged = { ...object(current) };
        for (const [field, value] of Object.entries(object(change.after))) {
          if (!same(change.before?.[field], value) && (same(current?.[field], change.before?.[field]) || current?.[field] === undefined)) merged[field] = value;
        }
        snapshot.values[change.key] = merged;
      } else if (same(current ?? null, change.before) || current === undefined) snapshot.values[change.key] = change.after;
      continue;
    }
    const p = snapshot.values[PROGRESS_KEY] = normalizeProgress(snapshot.values[PROGRESS_KEY]);
    const [field, id, skill] = change.path || [];
    if (change.type === "count") p.days[id] = (Number(p.days[id]) || 0) + change.after;
    if (change.type === "membership") {
      if (change.after) p[field] = union(p[field], [id]);
      else if (!["seen", "completed"].includes(field)) p[field] = p[field].filter((item) => item !== id);
    }
    if (change.type === "session" && !p.sessions.some((item) => item.id === change.after.id)) {
      p.sessions = [...p.sessions, change.after].sort((a, b) => a.date.localeCompare(b.date)).slice(-100);
    }
    if (change.type === "memory" && change.after) {
      const current = p.memory[id]?.[skill];
      // Keep the entire newest assessment. Do not union success dates or take
      // max(step): a later error must still reset the review schedule.
      const time = (item) => item?.lastAssessedAt ?? new Date(`${item?.lastDay || "1970-01-01"}T00:00:00`).getTime();
      const newer = !current || same(current, change.before) || time(change.after) > time(current);
      const tiedError = current && time(current) === time(change.after) && !change.after.lastCorrect;
      if (newer || tiedError) {
        let assessment = change.after;
        if (current && !same(current, change.before) && Number.isSafeInteger(assessment.lastAssessedAt) && assessment.assessed !== false) {
          // Rebase a newer offline assessment on known evidence using the
          // existing learning rules. A union of success dates would bypass the
          // due-date/four-hour gates; replacing blindly would erase old days.
          const independent = assessment.lastCorrect || assessment.step > 0;
          assessment = recordAnswer(p, id, independent, new Date(assessment.lastAssessedAt), { skill, hinted: !independent }).memory[id][skill];
        }
        p.memory[id] = { ...p.memory[id], [skill]: assessment };
      }
    }
    if (change.type === "draft") {
      const current = id ? p.drafts[id] : p.draft;
      if (same(current ?? null, change.before) || !current || same(current, change.after)) {
        if (id) p.drafts[id] = change.after ?? "";
        else p.draft = change.after ?? "";
      } else rememberConflict(snapshot, operation, change, change.after);
    }
    if (change.type === "plan" && change.after) {
      const current = p.dailyPlans[id];
      // Keep the first fixed plan. Accept only a compatible appended review
      // batch so another browser cannot reorder a partially answered batch.
      const compatible = current && same(current.newWords, change.after.newWords) && current.themeId === change.after.themeId &&
        same(current.review, change.after.review?.slice(0, current.review.length));
      if (!current || same(current, change.before) || compatible && change.after.review.length > current.review.length) p.dailyPlans[id] = change.after;
    }
  }
  if (snapshot.values[PROGRESS_KEY]) {
    const p = normalizeProgress(snapshot.values[PROGRESS_KEY]);
    p.mastered = Object.entries(p.memory).filter(([, skills]) => ["reading", "listening"].every((skill) => skills[skill]?.successDays.length >= 3 && skills[skill].lastCorrect)).map(([id]) => id);
    // Reconcile mistake membership from the selected assessments.
    const mistakes = Object.entries(p.memory).filter(([, skills]) => Object.values(skills).some((item) => item.assessed !== false && !item.lastCorrect)).map(([id]) => id);
    p.review = union(p.review.filter((id) => !p.memory[id] || Object.values(p.memory[id]).some((item) => item.assessed !== false && !item.lastCorrect)), mistakes);
    p.dailyPlans = retainDailyPlans(p.dailyPlans);
    snapshot.values[PROGRESS_KEY] = p;
  }
  return snapshot;
}
