import { describe, expect, it } from "vitest";
import { allKetWords } from "../../src/data/ket-words/index.js";
import { meaningCorrections, withCorrectMeaning } from "../../src/data/ket-meanings.js";
import { courseWords, vocabularyLessons, vocabularyLessonId, courseLessons, curriculumUnits, courseQuestionById, examCoverage, lessonPassed, nextCourseLesson, vocabularyQuestions } from "../../src/data/curriculum.js";
import courseGroupBaseline from "../../src/data/course-group-baseline.json" with { type: "json" };
import { grammarLessons } from "../../src/data/grammar.js";
import { skillLessons, productionTasks } from "../../src/data/skill-lessons.js";
import { countEnglishWords, emptyProgress, normalizeProgress } from "../../src/utils/learningProgress.js";
import { supplementaryTopics, courseUnitFor } from "../../src/data/course-topics.js";
import { meaningGroups, meaningKey } from "../../src/data/meaning-groups.js";

describe("meaning regressions", () => {
  it("rejects placeholders and explains easily confused senses", () => {
    expect(() => withCorrectMeaning({ id: "invalid", word: "unknown", translation: "综合复习词：unknown" })).toThrow("Missing meaning");
    const meaning = (word) => allKetWords.find((entry) => entry.word === word)?.translation;
    for (const [word, expected] of [
      ["borrow", "借入"], ["lend", "借出"], ["bored", "感到无聊"], ["boring", "令人觉得无聊"],
      ["mouse", "鼠标"], ["book", "预订"], ["orange", "橙色"], ["chips", "炸薯条"],
      ["chemist", "药剂师"], ["rock", "摇滚"], ["tablet", "平板电脑"], ["the", "定冠词"],
      ["p.m.", "下午或晚上"], ["a.m.", "上午"], ["make-up", "化妆"], ["surprising", "令人惊讶"],
    ]) expect(meaning(word), word).toContain(expected);
    for (const translation of Object.values(meaningCorrections)) expect(translation).not.toMatch(/待复核|词[：:]/);
    expect(meaning("mix")).toBe("混合；拌匀");
    expect(meaning("play")).toContain("戏剧或话剧（名词）");
    expect(allKetWords.find((word) => word.word === "play").partOfSpeech).toEqual(["n", "v"]);
    expect(allKetWords.find((word) => word.word === "mix").partOfSpeech).toEqual(["v"]);
    expect(allKetWords.every((word) => !/ -|board ing|pris ing/.test(word.word))).toBe(true);
  });
});

describe("the full A2 learning path", () => {
  it("keeps old completion IDs only for unchanged ordered word groups", () => {
    expect(Object.keys(courseGroupBaseline)).toHaveLength(219);
    expect(Object.values(courseGroupBaseline).flatMap((entry) => entry.words).sort()).toEqual(courseWords.map((word) => word.id).sort());
    for (const [base, { id, words: ids }] of Object.entries(courseGroupBaseline)) {
      const [, unit, topic, number] = base.split("-");
      const words = ids.map((wordId) => courseWords.find((word) => word.id === wordId));
      expect(words.every(Boolean), id).toBe(true);
      expect(vocabularyLessonId(Number(unit), topic, Number(number) - 1, words)).toBe(id);
      expect(vocabularyLessonId(Number(unit), topic, Number(number) - 1, words.slice(1))).not.toBe(id);
      if (words.length > 1) expect(vocabularyLessonId(Number(unit), topic, Number(number) - 1, [...words].reverse())).not.toBe(id);
    }
    const previousById = Object.fromEntries(Object.values(courseGroupBaseline).map((entry) => [entry.id, entry]));
    for (const lesson of vocabularyLessons) {
      if (previousById[lesson.id]) expect(lesson.words.map((word) => word.id)).toEqual(previousById[lesson.id].words);
      else expect(lesson.id).toContain(`--${lesson.words.map((word) => word.id).join("_")}`);
    }
    expect(vocabularyLessons.find((lesson) => lesson.id === "vocabulary-2-body_health-1")).toBeTruthy();
    for (const oldId of ["vocabulary-5-city_travel-3", "vocabulary-6-nature_weather-1"]) {
      expect(vocabularyLessons.some((lesson) => lesson.id === oldId)).toBe(false);
      expect(vocabularyLessons.some((lesson) => lesson.id.startsWith(`${oldId}--`))).toBe(true);
    }
    expect(vocabularyLessonId(1, "food_cafe", 0, courseWords.slice(0, 8))).toContain("--");
    expect(vocabularyLessonId(99, "nature_weather", 0, courseWords.slice(0, 8))).toContain("--");
  });
  it("never uses overlapping meanings as wrong answers, even when an input pool contains only synonyms", () => {
    const names = Object.values(meaningGroups).flat();
    expect(new Set(names).size).toBe(names.length);
    for (const group of Object.values(meaningGroups)) {
      const words = group.map((name) => courseWords.find((word) => word.word === name));
      expect(words.every(Boolean), group.join(", ")).toBe(true);
      for (const word of words) {
        const q = vocabularyQuestions([word], words)[0];
        expect(q.options).toHaveLength(3);
        for (const other of words) if (other.translation !== word.translation) expect(q.options).not.toContain(other.translation);
        expect(q.options[q.answer]).toBe(word.translation);
      }
    }
    const mother = courseWords.find((word) => word.word === "mother");
    expect(meaningKey(courseWords.find((word) => word.word === "Dr"))).toBe(meaningKey(courseWords.find((word) => word.word === "doctor")));
    const q = vocabularyQuestions([mother])[0];
    expect(q.options).not.toContain("妈妈（美式非正式称呼）");
    expect(q.options.filter((option) => option !== mother.translation).every((option) => courseWords.some((word) => word.topic === mother.topic && word.translation === option && meaningKey(word) !== meaningKey(mother)))).toBe(true);
  });
  it("assigns all 1687 words to exactly one short course, with real Chinese meanings", () => {
    const ids = vocabularyLessons.flatMap((lesson) => lesson.words.map((word) => word.id));
    expect(ids.slice().sort()).toEqual(courseWords.map((word) => word.id).sort());
    expect(new Set(ids).size).toBe(1687);
    expect(vocabularyLessons.every((lesson) => lesson.words.length >= 1 && lesson.words.length <= 8)).toBe(true);
    expect(vocabularyLessons.every((lesson) => lesson.questions.length === lesson.words.length)).toBe(true);
    expect(courseWords.every((word) => word.translation && !word.translation.includes("待复核"))).toBe(true);
  });
  it("reassigns catch-all words by meaning without missing or duplicate topic mappings", () => {
    const names = Object.values(supplementaryTopics).flat();
    expect(new Set(names).size).toBe(names.length);
    expect(names.every((name) => courseWords.some((word) => word.word === name))).toBe(true);
    expect(courseUnitFor(courseWords.find((word) => word.word === "dolphin"))).toBe(6);
    expect(courseUnitFor(courseWords.find((word) => word.word === "pencil"))).toBe(4);
    expect(courseUnitFor(courseWords.find((word) => word.word === "pasta"))).toBe(2);
    expect(curriculumUnits[11].vocabulary.flatMap((lesson) => lesson.words).length).toBeLessThan(300);
  });
  it("includes two grammar lessons, comprehension, production and a checkpoint per unit", () => {
    expect(curriculumUnits).toHaveLength(12);
    expect(grammarLessons).toHaveLength(24);
    expect(skillLessons).toHaveLength(12);
    expect(productionTasks).toHaveLength(12);
    for (const unit of curriculumUnits) {
      expect(unit.grammar).toHaveLength(2);
      expect(unit.vocabulary.length).toBeGreaterThan(0);
      expect(unit.skillLesson.unit).toBe(unit.id);
      expect(unit.checkpoint.questions).toHaveLength(6);
      expect(unit.production.unit).toBe(unit.id);
      expect(unit.production.speaking).toHaveLength(3);
    }
    expect(examCoverage.map((part) => part.id).sort()).toEqual(["R1", "R2", "R3", "R4", "R5", "R6", "R7", "L1", "L2", "L3", "L4", "L5", "S1", "S2"].sort());
    for (const part of examCoverage) expect(part.lessonId ? courseLessons.some((lesson) => lesson.id === part.lessonId) : productionTasks.some((task) => task.id === part.taskId)).toBe(true);
  });
  it("has valid answer keys, unique distractors and safe spelling for every question", () => {
    expect(new Set(courseLessons.map((lesson) => lesson.id)).size).toBe(courseLessons.length);
    for (const lesson of courseLessons) for (const question of lesson.questions) {
      expect(question.id).toBeTruthy();
      expect(question.prompt).toBeTruthy();
      expect(question.explanation).toBeTruthy();
      expect(courseQuestionById[question.id]).toEqual(question);
      if (question.options) {
        expect(new Set(question.options).size).toBe(question.options.length);
        expect(question.options.length).toBeGreaterThanOrEqual(3);
        expect(question.options[question.answer]).toBeTruthy();
      } else if (question.type === "spelling") expect(question.correctWord).toMatch(/^[a-z]+$/);
      else {
        expect(question.type).toBe("input");
        expect(question.acceptedAnswers.length).toBeGreaterThan(0);
        expect(question.acceptedAnswers.every((answer) => answer && !/\s/.test(answer))).toBe(true);
      }
      if (question.skill === "listening" || question.type === "listening") expect(question.audio).toBeTruthy();
    }
    const phrases = courseWords.filter((word) => !/^[a-z]+$/i.test(word.word));
    expect(vocabularyQuestions(phrases.slice(0, 8)).every((question) => question.type !== "spelling")).toBe(true);
  });
  it("uses 25-word emails and 35-word stories, with adequate original examples", () => {
    for (const task of productionTasks) {
      expect(task.minWords).toBe(task.kind === "story" ? 35 : 25);
      expect(task.points).toHaveLength(3);
      expect(countEnglishWords(task.example)).toBeGreaterThanOrEqual(task.minWords);
    }
  });
  it("requires 80% to pass and recommends the first unfinished course", () => {
    expect(lessonPassed(2, 3)).toBe(false);
    expect(lessonPassed(3, 3)).toBe(true);
    expect(lessonPassed(4, 5)).toBe(true);
    expect(lessonPassed(0, 0)).toBe(false);
    expect(nextCourseLesson(emptyProgress).id).toBe(vocabularyLessons[0].id);
    expect(nextCourseLesson({ ...emptyProgress, completed: [vocabularyLessons[0].id] }).id).toBe(vocabularyLessons[1].id);
    const migrated = normalizeProgress({ ...emptyProgress, draft: "Old draft", drafts: { one: "New draft", two: false } });
    expect(migrated.draft).toBe("Old draft");
    expect(migrated.drafts).toEqual({ one: "New draft" });
  });
});
