import { describe, expect, it } from "vitest";
import {
  LEARNING_STAGES,
  WEEKLY_SCHEDULE,
  computeStageProgress,
} from "../../src/data/learning-roadmap.js";
import {
  ALPHABET_PHONEMES,
  CORE_GRAPHEMES,
  CVC_ONSETS,
  CVC_VOWELS,
  CVC_CODAS,
  MAGIC_E_PAIRS,
  blendCvcWord,
} from "../../src/data/phonics-workshop.js";
import { COMMUNICATION_DIALOGUES } from "../../src/data/communication-dialogues.js";
import { GRADED_LONG_PASSAGES } from "../../src/data/long-passages.js";
import {
  WRITING_SCAFFOLDS,
  GUIDED_WRITING_TASKS,
  analyzeWritingDraft,
} from "../../src/data/writing-scaffolds.js";
import { countEnglishWords, emptyProgress } from "../../src/utils/learningProgress.js";

describe("4-stage progressive learning roadmap", () => {
  it("defines 4 ordered stages from Pre-A1 phonics to B1 long reading and writing", () => {
    expect(LEARNING_STAGES).toHaveLength(4);
    expect(LEARNING_STAGES.map((s) => s.order)).toEqual([1, 2, 3, 4]);
    for (const stage of LEARNING_STAGES) {
      expect(stage.title).toBeTruthy();
      expect(stage.goal.length).toBeGreaterThan(20);
      expect(stage.milestones).toHaveLength(4);
      expect(stage.targetPage).toBe("learn");
      expect(stage.targetSection).toBeTruthy();
    }
    expect(WEEKLY_SCHEDULE).toHaveLength(3);
  });

  it("computes bounded stage progress percentages from learner progress", () => {
    const initial = computeStageProgress(emptyProgress);
    for (const stage of LEARNING_STAGES) {
      expect(initial[stage.id].percent).toBe(0);
    }

    const active = computeStageProgress({
      ...emptyProgress,
      seen: Array.from({ length: 48 }, (_, i) => `w_${i}`),
      completed: [
        "phonics-cvc-cat",
        "phonics-cvc-dog",
        "child-breakfast-words",
        "child-breakfast-sentences",
        "dialogue-morning-school",
        "vocabulary-1-food_drink-1",
        "long-passage-seed-journey",
      ],
      mastered: ["l2_apple", "l2_banana"],
      selfReviews: ["guided_guided-email-picnic"],
    });
    expect(active["stage-1-phonics"].percent).toBeGreaterThan(30);
    expect(active["stage-2-communication"].percent).toBeGreaterThan(5);
    expect(active["stage-3-ket-core"].percent).toBeGreaterThan(0);
    expect(active["stage-4-long-reading"].percent).toBeGreaterThan(0);
  });
});

describe("interactive phonics workshop data and CVC blender", () => {
  it("covers all 26 alphabet phonemes, 12 core graphemes and 8 Magic E pairs", () => {
    expect(ALPHABET_PHONEMES).toHaveLength(26);
    expect(CORE_GRAPHEMES).toHaveLength(12);
    expect(MAGIC_E_PAIRS).toHaveLength(8);
    expect(CVC_ONSETS.length).toBeGreaterThanOrEqual(8);
    expect(CVC_VOWELS).toEqual(["a", "e", "i", "o", "u"]);
    expect(CVC_CODAS.length).toBeGreaterThanOrEqual(6);
  });

  it("blends real CVC words with meaning and handles decodable nonsense words gracefully", () => {
    const cat = blendCvcWord("c", "a", "t");
    expect(cat.isRealWord).toBe(true);
    expect(cat.word).toBe("cat");
    expect(cat.cn).toContain("猫");
    expect(cat.sentence).toContain("cat");

    const pseudo = blendCvcWord("z", "e", "x");
    expect(pseudo.isRealWord).toBe(false);
    expect(pseudo.word).toBe("zex");
    expect(pseudo.tip).toContain("短元音");
  });
});

describe("situational communication dialogues", () => {
  it("provides 6 progressive multi-turn real-life conversations with valid answer indices", () => {
    expect(COMMUNICATION_DIALOGUES).toHaveLength(6);
    for (const dialogue of COMMUNICATION_DIALOGUES) {
      expect(dialogue.turns).toHaveLength(3);
      expect(dialogue.keyExpressions.length).toBeGreaterThanOrEqual(3);
      for (const turn of dialogue.turns) {
        expect(turn.options).toHaveLength(3);
        expect(turn.answer).toBeGreaterThanOrEqual(0);
        expect(turn.answer).toBeLessThan(3);
        expect(turn.explanation.length).toBeGreaterThan(10);
      }
    }
  });
});

describe("graded long-passage reading hub", () => {
  it("provides 6 multi-paragraph articles (150+ words each) with reading strategies and 3 comprehension questions", () => {
    expect(GRADED_LONG_PASSAGES).toHaveLength(6);
    for (const article of GRADED_LONG_PASSAGES) {
      expect(article.paragraphs.length).toBeGreaterThanOrEqual(4);
      const actualWords = countEnglishWords(article.passage);
      expect(actualWords, article.id).toBeGreaterThanOrEqual(145);
      expect(article.readingStrategy.name).toBeTruthy();
      expect(article.discourseMarkers.length).toBeGreaterThanOrEqual(3);
      expect(article.questions).toHaveLength(3);
      for (const q of article.questions) {
        expect(q.options).toHaveLength(3);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(3);
      }
    }
  });
});

describe("guided writing workshop and draft analyzer", () => {
  it("provides scaffolds and tasks for email, story, and B1 opinion paragraph writing", () => {
    expect(Object.keys(WRITING_SCAFFOLDS)).toEqual(["email", "story", "opinion"]);
    expect(GUIDED_WRITING_TASKS).toHaveLength(3);
    for (const task of GUIDED_WRITING_TASKS) {
      const sampleAnalysis = analyzeWritingDraft(task.example, task.minWords);
      expect(sampleAnalysis.meetsWordCount, task.id).toBe(true);
      expect(sampleAnalysis.startsWithCapital).toBe(true);
      expect(sampleAnalysis.endsWithPunctuation).toBe(true);
      expect(sampleAnalysis.sentenceCount).toBeGreaterThanOrEqual(3);
    }
  });
});
