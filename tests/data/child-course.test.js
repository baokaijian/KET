import { describe, expect, it } from "vitest";
import { allKetWords } from "../../src/data/ket-words/index.js";
import { metadataFor, partOfSpeechLabels } from "../../src/data/vocabulary-metadata.js";
import { vocabularyCorrections } from "../../src/data/vocabulary-corrections.js";
import { vocabularyLessons, vocabularyQuestions } from "../../src/data/curriculum.js";
import { childThemes, childLessons, childQuestionById } from "../../src/data/child-course.js";
import { growingStories } from "../../src/data/child-reading.js";
import { countEnglishWords } from "../../src/utils/learningProgress.js";
import { curatedTopics, curatedTopicGroups } from "../../src/data/curated-topics.js";
import { familyImages } from "../../src/data/family-images.js";
import { homeImages } from "../../src/data/home-images.js";
import { parkImages } from "../../src/data/park-images.js";
import { healthImages } from "../../src/data/health-images.js";
import { clothesImages } from "../../src/data/clothes-images.js";
import { weatherImages } from "../../src/data/weather-images.js";
import { bodyImages } from "../../src/data/body-images.js";
import { dictionaryEntry } from "../../src/data/learning.js";

describe("whole-bank meaning, POS and theme regressions", () => {
  it("separates weather senses from travel and identifies noun and verb meanings explicitly", () => {
    const find = (name) => allKetWords.find((word) => word.word === name);
    for (const name of ["cloud", "cloudy", "foggy", "storm", "warm", "weather", "wind", "windy", "cold", "hot", "sun", "rain", "snow"]) {
      expect(find(name).topic, name).toBe("nature_weather");
    }
    for (const name of ["dress", "rain", "snow"]) {
      expect(find(name).partOfSpeech).toEqual(["n", "v"]);
      expect(find(name).translation).toContain("名词");
      expect(find(name).translation).toContain("动词");
    }
    expect(find("cold").translation).toContain("感冒");
    expect(weatherImages.l2_cold.meaning).toBe("冷的（天气）");
    expect(weatherImages.l6_hot.meaning).toBe("炎热的（天气）");
    expect(clothesImages.l8_dress.meaning).toBe("连衣裙（名词）");
  });
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
  it("labels every word with source POS or a documented dictionary correction", () => {
    for (const word of allKetWords) {
      const official = metadataFor(word.word);
      expect(official, word.word).toBeTruthy();
      const correction = vocabularyCorrections[word.word];
      expect(word.partOfSpeech, word.word).toEqual((correction?.pos || official.pos).filter((pos) => partOfSpeechLabels[pos]));
      if (correction) expect(word.posSource).toBe(correction.source);
      expect(word.partOfSpeechLabel, word.word).toBeTruthy();
    }
    expect(allKetWords.find((w) => w.word === "book").partOfSpeech).toEqual(["n", "v"]);
    expect(allKetWords.find((w) => w.word === "chips").grammarNotes).toBe("复数形式");
  });
  it("chooses a child-friendly primary context instead of the first appendix heading", () => {
    const groups = {
      food_cafe: ["menu", "bill", "restaurant"],
      time_calendar: ["day", "hour", "minute", "second", "week", "year", "early", "late", "later", "quarter"],
      home_room: ["window", "mirror", "washing-up", "tidy up", "get up", "wake up"],
      city_travel: ["passport", "ticket", "postcard"],
      shopping_work: ["shop", "supermarket"],
      sports_hobbies: ["sports centre", "stadium", "playground", "footballer", "walking", "swim"],
      clothes: ["costume", "dressed", "put on", "make-up"],
      animals: ["zoo", "tail", "wing", "fur", "nest", "wildlife", "extinct"],
      tech_media: ["turn on", "turn off"],
      body_health: ["get fit", "pale"],
    };
    for (const [topic, names] of Object.entries(groups)) for (const name of names) {
      expect(allKetWords.find((word) => word.word === name)?.topic, name).toBe(topic);
    }
    expect(allKetWords.find((word) => word.word === "ice").topic).toBe("food_cafe");
    expect(allKetWords.find((word) => word.word === "half").topic).toBe("school_library");
  });
  it("corrects importer omissions and dictionary-verified PDF errata without erasing source facts", () => {
    const find = (name) => allKetWords.find((word) => word.word === name);
    for (const name of ["design", "train"]) expect(find(name).partOfSpeech).toEqual(["n", "v"]);
    expect(find("it").partOfSpeech).toEqual(["pron"]);
    expect(metadataFor("IT").pos).toEqual(["n"]);
    expect(find("May").partOfSpeech).toEqual(["n"]);
    expect(metadataFor("may").pos).toEqual(["mv"]);
    expect(find("Miss").partOfSpeech).toEqual(["n"]);
    expect(metadataFor("miss").pos).toEqual(["v"]);
    expect(find("as well").partOfSpeech).toEqual(["adv"]);
    for (const [name, pos] of [["unhappy", "adj"], ["unfortunately", "adv"], ["diving", "n"], ["for sale", "phrase"], ["Guess what?", "phrase"]]) {
      expect(find(name).partOfSpeech, name).toEqual([pos]);
    }
    expect(metadataFor("unhappy").pos).toEqual(["n"]);
    expect(metadataFor("unfortunately").pos).toEqual(["adj"]);
    for (const name of ["afraid", "happy", "unhappy", "angry", "young", "difficult"]) expect(find(name).topic, name).toBe("feelings_descriptions");
    expect(find("clever").topic).toBe("school_library");
    for (const name of ["earring", "necklace", "get dressed", "wear", "raincoat"]) expect(find(name).topic, name).toBe("clothes");
    for (const name of ["fog", "thunderstorm"]) expect(find(name).topic, name).toBe("nature_weather");
    expect(find("engineer").topic).toBe("shopping_work");
    expect(find("grocery store").topic).toBe("shopping_work");
    expect(find("swimming pool").topic).toBe("sports_hobbies");
    expect(find("right hand").translation).toContain("右边的");
    expect(metadataFor("give somebody a call/ring").topics).not.toContain("Clothes and Accessories");
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
  for (const [themeId, images] of [["family", familyImages], ["home", homeImages], ["park", parkImages], ["clothes", clothesImages], ["weather", weatherImages], ["body", bodyImages]]) it(`pairs all eight ${themeId} photographs with a specific, speakable bilingual scene`, () => {
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
    if (themeId === "weather") {
      for (const id of ["l5_wind", "l5_weather"]) {
        expect(images[id].reviewStatus).toBe("fixed");
        expect(images[id].refinementPrompt.length).toBeGreaterThan(80);
      }
    }
  });
  it("pairs health photographs with specific clinical meanings, never restaurant content", () => {
    expect(Object.keys(healthImages)).toHaveLength(8);
    for (const [id, image] of Object.entries(healthImages)) {
      const word = dictionaryEntry(allKetWords.find((entry) => entry.id === id));
      expect(word.topic).toBe("body_health");
      expect(word.image).toEqual(image);
      expect(word.sentence).toBe(image.context.sentence);
      expect(word.sentenceTranslation).toBe(image.context.translation);
      expect(word.sentence.toLowerCase()).toContain(word.word.toLowerCase());
      expect(word.sentenceTranslation).toMatch(/[\u4e00-\u9fff]/);
      expect(countEnglishWords(word.sentence)).toBeLessThanOrEqual(10);
      expect(image.generationPrompt.length).toBeGreaterThan(80);
    }
    expect(healthImages.l2_ambulance.reviewStatus).toBe("fixed");
    expect(healthImages.l2_ambulance.refinementPrompt).toContain("Zoom out");
    expect(healthImages.l2_tooth.context.sentence).toContain("model");
    expect(healthImages.l2_tooth.meaning).toContain("模型");
    expect(parkImages.l7_park.meaning).toBe("公园（名词）");
    expect(parkImages.l7_play.meaning).toBe("玩游戏（动词）");
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
  it("covers every theme word in its six sentences, including regular plurals", () => {
    for (const theme of childThemes) {
      const text = theme.sentences.guide.sentences.map(([sentence]) => sentence).join(" ");
      for (const word of theme.vocabulary.words) {
        expect(text, `${theme.id}: ${word.word}`).toMatch(new RegExp(`\\b${word.word}(?:s|es)?\\b`, "i"));
      }
    }
    const body = childThemes.find((theme) => theme.id === "body");
    expect(body.story.guide.passage).toMatch(/\bmouth\b/);
    expect(body.longStory.guide.passage).toMatch(/\bmouth\b/);
  });
  it("keeps contextual vocabulary question IDs unique while sharing the same word memory", () => {
    const questions = childLessons.flatMap((lesson) => lesson.questions);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
    expect(Object.keys(childQuestionById)).toHaveLength(questions.length);
    const bags = childThemes.flatMap((theme) => theme.vocabulary.questions).filter((question) => question.wordId === "l12_bag");
    expect(bags).toHaveLength(2);
    expect(new Set(bags.map((question) => question.id)).size).toBe(2);
    expect(new Set(bags.map((question) => question.wordId)).size).toBe(1);
  });
  it("varies story answer positions without changing the correct meaning", () => {
    for (const kind of ["story", "longStory"]) {
      const patterns = childThemes.map((theme) => theme[kind].questions.map((question) => question.answer).join(","));
      expect(new Set(patterns).size).toBeGreaterThan(6);
      const answers = childThemes.flatMap((theme) => theme[kind].questions.map((question) => question.answer));
      for (const position of [0, 1, 2]) expect(answers.filter((answer) => answer === position).length).toBeGreaterThan(5);
      for (const theme of childThemes) for (const question of theme[kind].questions) {
        expect(question.explanation).toBe(`故事中的答案是：${question.options[question.answer]}。`);
      }
    }
    expect(childThemes[0].story.questions[0].options[childThemes[0].story.questions[0].answer]).toBe("牛奶");
    for (const theme of childThemes) for (const [index, question] of theme.longStory.questions.entries()) {
      const [, originalOptions, originalAnswer] = growingStories[theme.id].questions[index];
      expect(question.options[question.answer]).toBe(originalOptions[originalAnswer]);
      expect([...question.options].sort()).toEqual([...originalOptions].sort());
    }
  });
});
