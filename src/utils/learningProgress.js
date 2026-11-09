export const emptyProfile = {
  nickname: "小探索家",
  avatar: "dino",
  birthYear: 2020,
  modePreference: null,
  dailyMinutes: 10,
  hideChinese: false,
  lockAdvanced: true,
  pin: null,
};

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
  profile: emptyProfile,
  modeSessions: [],
};
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function retainedWord(skills) {
  return ["reading", "listening"].every((skill) => skills?.[skill]?.successDays.length >= 3 && skills[skill].lastCorrect);
}
// The same handful of day strings is re-validated on every answer, so remember
// the answer for any well-formed date (the key space is bounded by real days).
const validDayCache = new Map();
function validDay(day) {
  if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const cached = validDayCache.get(day);
  if (cached !== undefined) return cached;
  const date = new Date(`${day}T12:00:00`);
  const valid = !Number.isNaN(date.getTime()) && localDay(date) === day;
  validDayCache.set(day, valid);
  return valid;
}
function validAssessmentTime(value) {
  return Number.isSafeInteger(value) && value >= 0 && value <= 8_640_000_000_000_000;
}
// A calendar change alone is not a second spaced retrieval session.
export const minimumReviewIntervalMs = 4 * 60 * 60 * 1000;
export function separatedAssessment(item, date) {
  if (!item || item.assessed === false) return true;
  if (validAssessmentTime(item.lastAssessedAt)) return date.getTime() - item.lastAssessedAt >= minimumReviewIntervalMs;
  // Legacy same-day overdue items remain available, but cannot advance below.
  if (item.lastDay === localDay(date)) return true;
  const latestPossibleTime = new Date(`${item.lastDay}T23:59:59.999`).getTime();
  return date.getTime() - latestPossibleTime >= minimumReviewIntervalMs;
}
export const DAILY_PLAN_LIMIT = 90;
export function retainDailyPlans(value, activeDay = localDay()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.entries(value).filter(([day, plan]) => validDay(day) && plan && typeof plan === "object" && !Array.isArray(plan) && plan.day === day);
  const active = entries.find(([day]) => day === activeDay);
  const recent = entries.filter(([day]) => day !== activeDay).sort(([a], [b]) => a.localeCompare(b)).slice(-(DAILY_PLAN_LIMIT - Number(Boolean(active))));
  return Object.fromEntries(active ? [...recent, active] : recent);
}
export function normalizeProfile(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ...emptyProfile };
  return {
    nickname: typeof raw.nickname === "string" && raw.nickname.trim() ? raw.nickname.trim().slice(0, 24) : emptyProfile.nickname,
    avatar: typeof raw.avatar === "string" && raw.avatar ? raw.avatar : emptyProfile.avatar,
    birthYear: Number.isInteger(raw.birthYear) && raw.birthYear >= 2010 && raw.birthYear <= 2026 ? raw.birthYear : emptyProfile.birthYear,
    modePreference: ["solo", "colearn", "classic"].includes(raw.modePreference) ? raw.modePreference : null,
    dailyMinutes: [10, 15, 20].includes(Number(raw.dailyMinutes)) ? Number(raw.dailyMinutes) : 10,
    hideChinese: Boolean(raw.hideChinese),
    lockAdvanced: raw.lockAdvanced === undefined ? true : Boolean(raw.lockAdvanced),
    pin: typeof raw.pin === "string" && /^\d{4}$/.test(raw.pin) ? raw.pin : null,
  };
}

export function normalizeModeSessions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object" && typeof item.id === "string" && ["solo", "colearn"].includes(item.mode))
    .map((item) => ({
      id: item.id,
      day: validDay(item.day) ? item.day : localDay(),
      mode: item.mode,
      startedAt: typeof item.startedAt === "string" ? item.startedAt : new Date().toISOString(),
      durationSec: Math.max(0, Number(item.durationSec) || 0),
      tasksCompleted: Math.max(0, Number(item.tasksCompleted) || 0),
      wordsSeen: Math.max(0, Number(item.wordsSeen) || 0),
      parentPromptsShown: Math.max(0, Number(item.parentPromptsShown) || 0),
      interventions: Math.max(0, Number(item.interventions) || 0),
      childUtterances: Math.max(0, Number(item.childUtterances) || 0),
      interruptions: Math.max(0, Number(item.interruptions) || 0),
      endedBy: ["child", "parent", "timeout"].includes(item.endedBy) ? item.endedBy : "child",
    }))
    .slice(-200);
}

export function normalizeProgress(value, date = new Date()) {
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
    const valid = Object.fromEntries(Object.entries(skills).filter(([skill, item]) => ["reading", "listening"].includes(skill) && item && validDay(item.due) && validDay(item.lastDay) && Number.isInteger(item.step) && item.step >= 0 && item.step <= maxReviewStep && Array.isArray(item.successDays) && item.successDays.every(validDay) && typeof item.lastCorrect === "boolean")
      .map(([skill, item]) => {
        const { lastAssessedAt, ...rest } = item;
        return [skill, { ...rest, ...(validAssessmentTime(lastAssessedAt) ? { lastAssessedAt } : {}), successDays: [...new Set(item.successDays)] }];
      }));
    if (Object.keys(valid).length) result.memory[id] = valid;
  }
  result.dailyPlans = retainDailyPlans(value?.dailyPlans, localDay(date));
  // Old single-answer mastery is not evidence of retention across days.
  result.mastered = result.mastered.filter((id) => retainedWord(result.memory[id]));
  result.profile = normalizeProfile(value?.profile);
  result.modeSessions = normalizeModeSessions(value?.modeSessions);
  return result;
}
export function dayAfter(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return localDay(next);
}
// Teaching defaults for when a child should meet a word or question again, not a
// scientific law: the first week is dense, then the interval widens, and once a
// word is retained (three different days per skill) it only comes back for
// long-term maintenance. Steps 0-7 keep the original 1/2/4/7/16/30/60 gaps, so
// records written before the maintenance steps existed stay valid.
export const reviewGaps = [1, 2, 4, 7, 16, 30, 60, 120, 180, 365];
export const maxReviewStep = reviewGaps.length;

export function recordEncounter(progress, id, date = new Date()) {
  const p = normalizeProgress(progress, date);
  const skills = { ...p.memory[id] };
  for (const skill of ["reading", "listening"]) {
    if (!skills[skill]) skills[skill] = { step: 0, due: dayAfter(date, 1), lastDay: localDay(date), successDays: [], lastCorrect: false, assessed: false };
  }
  return { ...p, seen: [...new Set([...p.seen, id])], memory: { ...p.memory, [id]: skills } };
}

export function recordAnswer(progress, id, correct, date = new Date(), { skill = "reading", hinted = false } = {}) {
  const p = normalizeProgress(progress, date);
  const day = localDay(date);
  const unique = (items) => [...new Set(items)];
  const old = p.memory[id]?.[skill];
  const independent = correct && !hinted;
  const newDay = validAssessmentTime(old?.lastAssessedAt) ? !old.successDays.includes(day) : old?.lastDay !== day;
  const eligible = old?.assessed === false || (newDay && (!old || old.due <= day) && separatedAssessment(old, date));
  // Preserve past evidence, but same-day correction cannot undo an error or hint.
  const confirmed = independent && (eligible || old?.lastCorrect === true);
  const successDays = independent && eligible ? unique([...(old?.successDays || []), day]) : old?.successDays || [];
  const step = !independent ? 0 : eligible ? Math.min((old?.step || 0) + 1, maxReviewStep) : old?.step || 0;
  const memory = { ...p.memory, [id]: { ...p.memory[id], [skill]: {
    step, successDays, lastDay: day,
    due: independent && !eligible && old ? old.due : dayAfter(date, independent ? reviewGaps[Math.max(0, step - 1)] : 1),
    lastCorrect: confirmed,
    assessed: true,
    ...(!independent || eligible ? { lastAssessedAt: date.getTime() } : validAssessmentTime(old?.lastAssessedAt) ? { lastAssessedAt: old.lastAssessedAt } : {}),
  } } };
  const retained = retainedWord(memory[id]);
  return {
    ...p,
    memory,
    mastered: retained
      ? unique([...p.mastered, id])
      : p.mastered.filter((item) => item !== id),
    review: confirmed && Object.values(memory[id]).every((item) => item.assessed === false || item.lastCorrect)
      ? p.review.filter((item) => item !== id)
      : !correct ? unique([...p.review, id]) : p.review,
    days: { ...p.days, [day]: (Number(p.days[day]) || 0) + 1 },
  };
}

export function dueReviews(progress, date = new Date()) {
  const p = normalizeProgress(progress, date);
  const day = localDay(date);
  return Object.entries(p.memory).flatMap(([id, skills]) => Object.entries(skills)
    .filter(([, item]) => item.due <= day && separatedAssessment(item, date)).map(([skill, item]) => ({ id, skill, ...item })))
    .sort((a, b) => Number(a.lastCorrect) - Number(b.lastCorrect) || a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
}
export function countEnglishWords(text) {
  return (text.match(/[a-zA-Z]+(?:['’-][a-zA-Z]+)*/g) || []).length;
}

export function updateProfile(progress, patch, date = new Date()) {
  const p = normalizeProgress(progress, date);
  return {
    ...p,
    profile: normalizeProfile({ ...p.profile, ...patch }),
  };
}

export function recordModeSession(progress, session, date = new Date()) {
  const p = normalizeProgress(progress, date);
  const entry = normalizeModeSessions([
    {
      id: session?.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ms-${Date.now()}`),
      day: session?.day || localDay(date),
      mode: session?.mode === "colearn" ? "colearn" : "solo",
      startedAt: session?.startedAt || date.toISOString(),
      durationSec: session?.durationSec ?? 0,
      tasksCompleted: session?.tasksCompleted ?? 0,
      wordsSeen: session?.wordsSeen ?? 0,
      parentPromptsShown: session?.parentPromptsShown ?? 0,
      interventions: session?.interventions ?? 0,
      childUtterances: session?.childUtterances ?? 0,
      interruptions: session?.interruptions ?? 0,
      endedBy: session?.endedBy || "child",
    },
  ])[0];
  if (!entry) return p;
  const existingIdx = p.modeSessions.findIndex((item) => item.id === entry.id);
  const nextSessions =
    existingIdx >= 0
      ? p.modeSessions.map((item, idx) => (idx === existingIdx ? entry : item))
      : [...p.modeSessions, entry];
  return {
    ...p,
    modeSessions: nextSessions.slice(-200),
  };
}

// PRD 5.2 & 9.3 M3/M4: Automatic scaffolding fade / mode switch recommendations
export function evaluateModeRecommendation(progress) {
  const p = normalizeProgress(progress);
  const currentMode = p.profile.modePreference;
  const sessions = p.modeSessions;

  if (currentMode === "colearn") {
    const colearnSessions = sessions.filter((s) => s.mode === "colearn");
    if (colearnSessions.length >= 3) {
      const lastThree = colearnSessions.slice(-3);
      if (lastThree.every((s) => s.interventions === 0 && s.tasksCompleted >= 1)) {
        return {
          suggestMode: "solo",
          reason: "three_zero_interventions",
          message: "他今天完全自己完成了，要不要试试自学模式？",
        };
      }
    }
  }

  if (currentMode === "solo") {
    const soloSessions = sessions.filter((s) => s.mode === "solo");
    const latest = soloSessions.at(-1);
    if (latest && latest.interruptions >= 3) {
      return {
        suggestMode: "colearn",
        reason: "session_interrupted_3_times",
        message: "可能有点难，试试陪他 10 分钟？",
      };
    }
    const byDay = new Map();
    for (const s of soloSessions) {
      byDay.set(s.day, (byDay.get(s.day) || 0) + s.tasksCompleted);
    }
    const days = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b));
    if (days.length >= 2) {
      const lastTwoDays = days.slice(-2);
      if (lastTwoDays.every(([, completedCount]) => completedCount === 0)) {
        return {
          suggestMode: "colearn",
          reason: "two_days_incomplete",
          message: "可能有点难，试试陪他 10 分钟？",
        };
      }
    }
  }

  return null;
}

// PRD 8.4 & F5: Export JSON with complete events and deterministic replay verification
export function exportLearningData(progress, date = new Date()) {
  const normalized = normalizeProgress(progress, date);
  const events = [
    ...normalized.sessions.map((s) => ({
      type: "practice_session",
      id: s.id,
      timestamp: s.date,
      title: s.title,
      skill: s.skill,
      score: s.score,
      total: s.total,
      lessonId: s.lessonId || null,
    })),
    ...normalized.modeSessions.map((ms) => ({
      type: "mode_session",
      id: ms.id,
      timestamp: ms.startedAt,
      day: ms.day,
      mode: ms.mode,
      durationSec: ms.durationSec,
      tasksCompleted: ms.tasksCompleted,
      wordsSeen: ms.wordsSeen,
      parentPromptsShown: ms.parentPromptsShown,
      interventions: ms.interventions,
      childUtterances: ms.childUtterances,
      endedBy: ms.endedBy,
    })),
  ].sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));

  return {
    schemaVersion: "sparks-v2.0",
    exportedAt: date.toISOString(),
    progress: normalized,
    events,
    replaySummary: {
      seenCount: normalized.seen.length,
      masteredCount: normalized.mastered.length,
      completedCount: normalized.completed.length,
      sessionCount: normalized.sessions.length,
      modeSessionCount: normalized.modeSessions.length,
      activeDays: Object.keys(normalized.days).length,
    },
  };
}

export function importLearningData(payloadOrJson, date = new Date()) {
  const parsed = typeof payloadOrJson === "string" ? JSON.parse(payloadOrJson) : payloadOrJson;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid learning data payload");
  }
  const sourceProgress = parsed.progress && typeof parsed.progress === "object" ? parsed.progress : parsed;
  const restored = normalizeProgress(sourceProgress, date);
  return {
    progress: restored,
    replayedEvents: Array.isArray(parsed.events) ? parsed.events.length : restored.sessions.length + restored.modeSessions.length,
    summary: {
      seenCount: restored.seen.length,
      masteredCount: restored.mastered.length,
      completedCount: restored.completed.length,
      sessionCount: restored.sessions.length,
      modeSessionCount: restored.modeSessions.length,
      activeDays: Object.keys(restored.days).length,
    },
  };
}

// PRD 8.4 & F6: Complete deletion of local and cached learning data
export function clearAllLearningData(storage = typeof window !== "undefined" ? window.localStorage : null) {
  if (!storage) return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < storage.length; i += 1) {
      const k = storage.key(i);
      if (k && (k.startsWith("sparks_") || k.startsWith("ket_"))) {
        keysToRemove.push(k);
      }
    }
    for (const k of [
      "sparks_learning_v2",
      "sparks_voice_v2",
      "sparks_advanced_courses",
      "sparks_course_unit",
      "ket_placed_stickers",
      ...keysToRemove,
    ]) {
      storage.removeItem(k);
    }
  } catch {
    // Ignore storage security errors in restricted environments
  }
}
