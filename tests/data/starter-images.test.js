import { describe, expect, it } from "vitest";
import { starterImages } from "../../src/data/starter-images.js";
import { courseWordById, vocabularyQuestions } from "../../src/data/curriculum.js";
import { getSpeakableWordText } from "../../src/utils/speechText.js";
import { countEnglishWords } from "../../src/utils/learningProgress.js";
import { wordImagePlans } from "../../src/data/word-image-plans.js";

const ids = ["l1_all", "l1_also", "l1_always", "l1_a_m", "l1_and", "l1_answer"];

describe("originally mismatched starter words", () => {
  it("gives each of the six words its own reviewed scene and mandatory bilingual context", () => {
    expect(Object.keys(starterImages)).toEqual(ids);
    expect(new Set(Object.values(starterImages).map((image) => image.sha256)).size).toBe(6);
    for (const id of ids) {
      const image = starterImages[id];
      const word = courseWordById[id];
      expect(word.image).toBe(image);
      expect(image.requiresContext).toBe(true);
      expect(image.reviewStatus).toBe("fixed");
      expect(image.meaningSource).toMatch(/^https:\/\/dictionary\.cambridge\.org\//);
      expect(image.generationPrompt.length).toBeGreaterThan(100);
      expect(wordImagePlans[id].prompt).toContain(image.generationPrompt);
      expect(image.note.length).toBeGreaterThan(100);
      expect(word.sentence).toBe(image.context.sentence);
      expect(word.sentenceTranslation).toBe(image.context.translation);
      expect(countEnglishWords(word.sentence)).toBeLessThanOrEqual(10);
      expect(word.sentenceTranslation).toMatch(/[\u4e00-\u9fff]/);
      expect(word.partOfSpeechLabel).toBeTruthy();
      expect(word.topic).toBe(id === "l1_a_m" ? "time_calendar" : "daily_starters");
    }
  });
  it("keeps addition, conjunction, frequency, time and response senses distinct", () => {
    expect(starterImages.l1_all.context.sentence).toBe("All four children are wearing hats.");
    expect(starterImages.l1_also.context.sentence).toBe("I have an apple. I also have a banana.");
    expect(starterImages.l1_always.alt).toContain("all seven days checked");
    expect(starterImages.l1_always.context.sentence).toContain("always put my shoes");
    expect(courseWordById.l1_always.translation).toContain("每次都");
    expect(starterImages.l1_a_m.alt).toContain("9:00 AM");
    expect(courseWordById.l1_a_m.translation).toContain("午夜十二点到中午十二点之间");
    expect(starterImages.l1_and.context.sentence).toBe("A book and a cup.");
    expect(starterImages.l1_answer.alt).toContain("2 + 1 = ?");
    expect(starterImages.l1_answer.context.sentence).toBe("The answer is three.");
    expect(courseWordById.l1_answer.partOfSpeech).toEqual(["n", "v"]);
    expect(courseWordById.l1_answer.translation).toContain("接电话");
  });
  it("reads dotted a.m. as letters without changing the verb am or unrelated AM", () => {
    for (const value of ["a.m.", " A.M. ", { word: "a.m." }]) expect(getSpeakableWordText(value)).toBe("A M");
    expect(getSpeakableWordText("am")).toBe("am");
    expect(getSpeakableWordText("AM")).toBe("AM");
    expect(getSpeakableWordText("I am six.")).toBe("I am six.");
    const questions = vocabularyQuestions(ids.map((id) => courseWordById[id]));
    expect(questions[3].audio).toBe("A M");
    expect(questions.every((question) => ["meaning", "listening"].includes(question.type))).toBe(true);
  });
});
