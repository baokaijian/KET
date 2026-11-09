import { describe, expect, it } from "vitest";
import { allKetWords, l12Subgroups } from "../../src/data/ket-words/index.js";
import { hasVerifiedImage } from "../../src/data/vocabulary-metadata.js";
import { getColearnScriptForStage, STAGE_SCRIPTS, THEME_COLEARN_GUIDES } from "../../src/data/colearn-scripts.js";
import {
  clearAllLearningData,
  emptyProgress,
  evaluateModeRecommendation,
  exportLearningData,
  importLearningData,
  normalizeProgress,
  recordAnswer,
  recordEncounter,
  recordModeSession,
  updateProfile,
} from "../../src/utils/learningProgress.js";
import { applyOperations, changesFor, PROGRESS_KEY } from "../../src/sync/merge.js";

describe("v2.0 Dual-Mode, Vocabulary Grading & Parent Center unit suite", () => {
  it("assigns gradeBand L0-L4 to all 1687 KET words and enforces 100% verified images on L0/L1 (PRD 7.3 & C2)", () => {
    expect(allKetWords.length).toBe(1687);
    const validBands = new Set(["L0", "L1", "L2", "L3", "L4"]);
    const counts = { L0: 0, L1: 0, L2: 0, L3: 0, L4: 0 };

    for (const word of allKetWords) {
      expect(validBands.has(word.gradeBand)).toBe(true);
      counts[word.gradeBand] += 1;
      if (word.gradeBand === "L0" || word.gradeBand === "L1") {
        expect(hasVerifiedImage(word.id)).toBe(true);
      }
    }

    expect(counts.L0).toBe(48);
    expect(counts.L1).toBe(67);
    expect(counts.L0 + counts.L1).toBe(115);
  });

  it("splits all 809 Level-12 words into 3 sub-pools (everyday_actions, time_space, thematic_review) (PRD 7.3 & C7)", () => {
    const l12Words = allKetWords.filter((w) => w.level === 12);
    expect(l12Words.length).toBe(809);

    const g1 = l12Subgroups.everyday_actions.words;
    const g2 = l12Subgroups.time_space.words;
    const g3 = l12Subgroups.thematic_review.words;

    expect(g1.length + g2.length + g3.length).toBe(809);
    expect(g1.every((w) => w.l12Subgroup === "everyday_actions")).toBe(true);
    expect(g2.every((w) => w.l12Subgroup === "time_space")).toBe(true);
    expect(g3.every((w) => w.l12Subgroup === "thematic_review")).toBe(true);
  });

  it("provides structured Co-learn parent script cards for every stage and all 12 child themes (PRD 6.3 & M5)", () => {
    for (const stageKey of ["watch_listen", "repeat", "quiz_choice", "sentences", "story", "wrapup"]) {
      expect(STAGE_SCRIPTS[stageKey]).toBeTruthy();
      expect(STAGE_SCRIPTS[stageKey].say.length).toBeGreaterThanOrEqual(1);
      expect(STAGE_SCRIPTS[stageKey].action).toBeTruthy();
      expect(STAGE_SCRIPTS[stageKey].caution).toBeTruthy();
    }
    expect(Object.keys(THEME_COLEARN_GUIDES).length).toBe(12);

    const sampleScript = getColearnScriptForStage("watch_listen", "breakfast", { word: "apple", translation: "苹果" });
    expect(sampleScript.goal).toContain("apple");
    expect(sampleScript.say[0]).toContain("苹果");
  });

  it("recommends switching from Co-learn to Solo after 3 consecutive zero-intervention sessions (PRD M3)", () => {
    let progress = updateProfile(emptyProgress, { modePreference: "colearn" });
    expect(evaluateModeRecommendation(progress)).toBeNull();

    for (let i = 1; i <= 3; i += 1) {
      progress = recordModeSession(progress, {
        id: `colearn-${i}`,
        day: `2026-11-0${i}`,
        mode: "colearn",
        tasksCompleted: 1,
        interventions: 0,
      });
    }

    const rec = evaluateModeRecommendation(progress);
    expect(rec).not.toBeNull();
    expect(rec.suggestMode).toBe("solo");
    expect(rec.reason).toBe("three_zero_interventions");
  });

  it("recommends switching from Solo to Co-learn when interrupted >=3 times or 2 consecutive days incomplete (PRD M4)", () => {
    let progress = updateProfile(emptyProgress, { modePreference: "solo" });
    progress = recordModeSession(progress, {
      id: "solo-int",
      day: "2026-11-05",
      mode: "solo",
      tasksCompleted: 0,
      interruptions: 3,
    });
    const rec1 = evaluateModeRecommendation(progress);
    expect(rec1?.suggestMode).toBe("colearn");
    expect(rec1?.reason).toBe("session_interrupted_3_times");

    let progress2 = updateProfile(emptyProgress, { modePreference: "solo" });
    progress2 = recordModeSession(progress2, {
      id: "solo-d1",
      day: "2026-11-05",
      mode: "solo",
      tasksCompleted: 0,
      interruptions: 1,
    });
    progress2 = recordModeSession(progress2, {
      id: "solo-d2",
      day: "2026-11-06",
      mode: "solo",
      tasksCompleted: 0,
      interruptions: 1,
    });
    const rec2 = evaluateModeRecommendation(progress2);
    expect(rec2?.suggestMode).toBe("colearn");
    expect(rec2?.reason).toBe("two_days_incomplete");
  });

  it("syncs profile and modeSessions losslessly across changesFor and applyOperations (PRD A5 & 8.1)", () => {
    let progress = updateProfile(emptyProgress, {
      nickname: "乐乐",
      modePreference: "colearn",
      dailyMinutes: 15,
      hideChinese: true,
    });
    progress = recordModeSession(progress, {
      id: "sync-ms-1",
      day: "2026-11-09",
      mode: "colearn",
      durationSec: 420,
      tasksCompleted: 2,
      wordsSeen: 8,
      interventions: 1,
    });

    const changes = changesFor(PROGRESS_KEY, emptyProgress, progress);
    expect(changes.some((c) => c.type === "profile")).toBe(true);
    expect(changes.some((c) => c.type === "modeSession")).toBe(true);

    const snapshot = applyOperations(
      { values: { [PROGRESS_KEY]: emptyProgress }, conflicts: [] },
      [{ id: "op-1", changes }],
    );
    const merged = snapshot.values[PROGRESS_KEY];
    expect(merged.profile.nickname).toBe("乐乐");
    expect(merged.profile.modePreference).toBe("colearn");
    expect(merged.profile.dailyMinutes).toBe(15);
    expect(merged.profile.hideChinese).toBe(true);
    expect(merged.modeSessions.length).toBe(1);
    expect(merged.modeSessions[0].id).toBe("sync-ms-1");
  });

  it("exports, imports, and replays learning data losslessly, and clears all data cleanly (PRD F5 & F6)", () => {
    let p = updateProfile(emptyProgress, { modePreference: "solo", dailyMinutes: 10 });
    p = recordEncounter(p, 1, new Date("2026-10-31T10:00:00Z"));
    p = recordAnswer(p, 1, true, new Date("2026-11-01T10:00:00Z"), { skill: "listening" });
    p = recordAnswer(p, 1, true, new Date("2026-11-03T10:00:00Z"), { skill: "listening" });
    p = recordAnswer(p, 1, true, new Date("2026-11-07T10:00:00Z"), { skill: "listening" });
    p = recordAnswer(p, 1, true, new Date("2026-11-01T10:05:00Z"), { skill: "reading" });
    p = recordAnswer(p, 1, true, new Date("2026-11-03T10:05:00Z"), { skill: "reading" });
    p = recordAnswer(p, 1, true, new Date("2026-11-07T10:05:00Z"), { skill: "reading" });

    expect(p.mastered).toContain(1);

    const payload = exportLearningData(p, new Date("2026-11-08T10:00:00Z"));
    expect(payload.schemaVersion).toBe("sparks-v2.0");

    const restored = importLearningData(JSON.stringify(payload), new Date("2026-11-08T10:00:00Z"));
    expect(restored.progress.mastered).toContain(1);
    expect(restored.progress.profile.modePreference).toBe("solo");

    const cleared = clearAllLearningData(null);
    expect(normalizeProgress(cleared).seen).toEqual([]);
    expect(normalizeProgress(cleared).mastered).toEqual([]);
  });
});
