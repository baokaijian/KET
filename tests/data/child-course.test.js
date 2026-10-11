import { describe, expect, it } from "vitest";
import { allKetWords } from "../../src/data/ket-words/index.js";
import { metadataFor, partOfSpeechLabels } from "../../src/data/vocabulary-metadata.js";
import { vocabularyLessons, vocabularyQuestions } from "../../src/data/curriculum.js";
import { childThemes, childLessons } from "../../src/data/child-course.js";
import { countEnglishWords } from "../../src/utils/learningProgress.js";
import { curatedTopics, curatedTopicGroups } from "../../src/data/curated-topics.js";
import { familyImages } from "../../src/data/family-images.js";
import { homeImages } from "../../src/data/home-images.js";

describe("whole-bank meaning, POS and theme regressions", () => {
  it("places calendar, spatial and formerly unclassified words into explicit semantic groups", () => {
    const names = Object.values(curatedTopicGroups).flatMap((group) => group.split("|"));
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) {
      const word = allKetWords.find((w) => w.word === name);
      expect(word, name).toBeTruthy();
      expect(word.topic, name).toBe(curatedTopics[name]);
    }
    for (const name of ["January", "April", "December", "Monday", "Friday", "midday", "suddenly"]) expect(allKetWords.find((w) => w.word === name).topic).toBe("time_calendar");
    for (const name of ["beside", "below", "between", "under"]) expect(allKetWords.find((w) => w.word === name).topic).toBe("positions");
    expect(allKetWords.find((w) => w.word === "bag").topic).toBe("shopping_work");
    expect(allKetWords.find((w) => w.word === "gas station").topic).toBe("city_travel");
    expect(allKetWords.find((w) => w.word === "fish").topic).toBe("animals");
    expect(allKetWords.filter((w) => w.topic === "full_review").every((w) => curatedTopics[w.word] === "full_review")).toBe(true);
  });
  it("labels every word with its official POS, including multi-POS and plural forms", () => {
    for (const word of allKetWords) {
      const official = metadataFor(word.word);
      expect(official, word.word).toBeTruthy();
      expect(word.partOfSpeech, word.word).toEqual(official.pos.filter((pos) => partOfSpeechLabels[pos]));
      expect(word.partOfSpeechLabel, word.word).toBeTruthy();
    }
    expect(allKetWords.find((w) => w.word === "book").partOfSpeech).toEqual(["n", "v"]);
    expect(allKetWords.find((w) => w.word === "chips").grammarNotes).toBe("复数形式");
  });
  it("excludes ALL health words from restaurant word lists and keeps every vocabulary lesson on one topic", () => {
    const restaurant = allKetWords.filter((word) => word.topic === "food_cafe");
    const health = allKetWords.filter((word) => metadataFor(word.word).topics.includes("Health, Medicine and Exercise"));
    for (const word of health) expect(restaurant.some((item) => item.id === word.id), word.word).toBe(false);
    for (const name of ["ambulance", "doctor", "headache", "appointment", "brain", "toothache", "pharmacy"]) expect(allKetWords.find((word) => word.word === name).topic).toBe("body_health");
    for (const lesson of vocabularyLessons) {
      expect(new Set(lesson.words.map((word) => word.topic)).size, lesson.title).toBe(1);
      expect(lesson.words.every((word) => word.scene === lesson.title.split(" · ")[0])).toBe(true);
    }
    expect(vocabularyQuestions(allKetWords).some((q) => ["spelling", "input"].includes(q.type))).toBe(false);
  });
});
describe("six-year-old listening and reading", () => {
  for (const [themeId, images] of [["family", familyImages], ["home", homeImages]]) it(`pairs all eight ${themeId} photographs with a specific, speakable bilingual scene`, () => {
    const words = childThemes.find((theme) => theme.id === themeId).vocabulary.words;
    expect(Object.keys(images).sort()).toEqual(words.map((word) => word.id).sort());
    for (const word of words) {
      const image = images[word.id];
      expect(word.image).toEqual(image);
      expect(word.sentence).toBe(image.context.sentence);
      expect(word.sentenceTranslation).toBe(image.context.translation);
      expect(word.sentence.toLowerCase()).toContain(word.word.toLowerCase());
      expect(word.sentenceTranslation).toMatch(/[\u4e00-\u9fff]/);
      expect(image.generationPrompt.length).toBeGreaterThan(80);
      expect(countEnglishWords(word.sentence)).toBeLessThanOrEqual(10);
    }
    if (themeId === "family") {
      expect(familyImages.l1_sister.meaning).toBe("姐姐");
      expect(familyImages.l10_brother.meaning).toBe("哥哥");
    }
  });
  it("provides twelve themes with eight words, six sentences and one original short story each", () => {
    expect(childThemes).toHaveLength(12);
    for (const theme of childThemes) {
      expect(theme.vocabulary.words).toHaveLength(8);
      expect(new Set(theme.vocabulary.words.map((word) => word.id)).size).toBe(8);
      expect(theme.sentences.guide.sentences).toHaveLength(6);
      expect(countEnglishWords(theme.story.guide.passage)).toBeGreaterThanOrEqual(30);
      expect(countEnglishWords(theme.story.guide.passage)).toBeLessThanOrEqual(60);
      expect(theme.story.questions).toHaveLength(3);
      expect(countEnglishWords(theme.longStory.guide.passage)).toBeGreaterThanOrEqual(100);
      expect(countEnglishWords(theme.longStory.guide.passage)).toBeLessThanOrEqual(120);
      expect(theme.longStory.questions).toHaveLength(4);
      expect(new Set(theme.sentences.questions.map((q) => q.answer)).size).toBe(3);
    }
    for (const lesson of childLessons) for (const q of lesson.questions) {
      expect(["spelling", "input"]).not.toContain(q.type);
      expect(new Set(q.options).size).toBe(3);
      expect(q.options[q.answer]).toBeTruthy();
      expect(q.audio || q.passage || q.wordId).toBeTruthy();
    }
  });
});
