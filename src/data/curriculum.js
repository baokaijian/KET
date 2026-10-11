import { allKetWords, levels, topicCategories } from "./ket-words/index.js";
import { dictionaryEntry } from "./learning.js";
import { grammarLessons } from "./grammar.js";
import { skillLessons, productionTasks } from "./skill-lessons.js";
import { getSpeakableWordText } from "../utils/speechText.js";
import { courseUnitFor } from "./course-topics.js";
import { meaningKey } from "./meaning-groups.js";
import courseGroupBaseline from "./course-group-baseline.json" with { type: "json" };

export const courseWords = allKetWords.map(dictionaryEntry);
export const courseWordById = Object.fromEntries(courseWords.map((word) => [word.id, word]));
const wordsByTopic = Object.fromEntries(topicCategories.map((topic) => [topic.id, courseWords.filter((word) => word.topic === topic.id)]));

export function vocabularyQuestions(words, pool) {
  return words.map((word, index) => {
    const sameTopic = wordsByTopic[word.topic] || [];
    const distinct = new Map();
    const addCandidates = (candidates) => {
      for (const other of candidates) {
        const key = meaningKey(other);
        if (other.id !== word.id && key !== meaningKey(word) && !distinct.has(key)) distinct.set(key, other);
      }
    };
    addCandidates(pool || sameTopic);
    if (distinct.size < 2) addCandidates(sameTopic);
    if (distinct.size < 2) addCandidates(courseWords);
    const remaining = [...distinct.values()];
    const offsetInPool = index % remaining.length;
    const distractors = [...remaining.slice(offsetInPool), ...remaining.slice(0, offsetInPool)].slice(0, 2);
    const choices = [word, ...distractors];
    const offset = index % choices.length;
    const ordered = [...choices.slice(offset), ...choices.slice(0, offset)];
    const base = {
      id: `vocab-${word.id}`,
      wordId: word.id,
      skill: "vocabulary",
      explanation: `${word.word}：${word.translation}。`,
    };
    if (index % 2 === 1) {
      return { ...base, skill: "listening", type: "listening", audio: getSpeakableWordText(word), prompt: "听一听，选择这个词的意思。", options: ordered.map((item) => item.translation), answer: ordered.findIndex((item) => item.id === word.id) };
    }
    return { ...base, skill: "reading", type: "meaning", prompt: `“${word.word}”的中文意思是什么？`, options: ordered.map((item) => item.translation), answer: ordered.findIndex((item) => item.id === word.id) };
  });
}

export function vocabularyLessonId(unit, topic, index, words) {
  const base = `vocabulary-${unit}-${topic}-${index + 1}`;
  const ids = words.map((word) => word.id);
  // A changed group must not inherit a pass earned for different word IDs.
  const previous = courseGroupBaseline[base];
  return JSON.stringify(previous?.words) === JSON.stringify(ids)
    ? previous.id : `${base}--${ids.join("_")}`;
}

export const vocabularyLessons = levels.flatMap((level) => {
  return topicCategories.flatMap((topic) => {
  const words = courseWords.filter((word) => courseUnitFor(word) === level.id && word.topic === topic.id);
  return Array.from({ length: Math.ceil(words.length / 8) }, (_, index) => {
    const group = words.slice(index * 8, index * 8 + 8);
    return {
      id: vocabularyLessonId(level.id, topic.id, index, group),
      unit: level.id,
      title: `${topic.scene} · 词汇 ${index + 1}`,
      topic: topic.id,
      skill: "vocabulary",
      minutes: 8,
      words: group,
      questions: vocabularyQuestions(group),
    };
  });
  });
});

export const checkpoints = levels.map((level) => ({
  id: `checkpoint-${level.id}`,
  unit: level.id,
  title: `${level.name} · 阶段检查`,
  skill: "mixed",
  minutes: 12,
  questions: [
    ...grammarLessons.filter((lesson) => lesson.unit === level.id).flatMap((lesson) => lesson.questions).slice(0, 3),
    ...skillLessons.find((lesson) => lesson.unit === level.id).questions,
  ],
}));

export const curriculumUnits = levels.map((level) => ({
  ...level,
  phase: level.id <= 4 ? "基础表达" : level.id <= 8 ? "A2 应用" : "考试整合",
  vocabulary: vocabularyLessons.filter((lesson) => lesson.unit === level.id),
  grammar: grammarLessons.filter((lesson) => lesson.unit === level.id),
  skillLesson: skillLessons.find((lesson) => lesson.unit === level.id),
  production: productionTasks.find((task) => task.unit === level.id),
  checkpoint: checkpoints.find((lesson) => lesson.unit === level.id),
}));
export const courseLessons = [...vocabularyLessons, ...grammarLessons, ...skillLessons, ...checkpoints];
export const courseQuestionById = Object.fromEntries(courseLessons.flatMap((lesson) => lesson.questions).map((question) => [question.id, question]));

export const examCoverage = [
  { id: "R1", title: "阅读 1 · 告示理解", lessonId: "skill-1" },
  { id: "R2", title: "阅读 2 · 多篇匹配", lessonId: "skill-3" },
  { id: "R3", title: "阅读 3 · 长文理解", lessonId: "skill-5" },
  { id: "R4", title: "阅读 4 · 词汇填空", lessonId: "skill-7" },
  { id: "R5", title: "阅读 5 · 单词填空", lessonId: "skill-9" },
  { id: "R6", title: "写作 6 · 25 词邮件", taskId: "production-1" },
  { id: "R7", title: "写作 7 · 35 词故事", taskId: "production-5" },
  { id: "L1", title: "听力 1 · 关键信息", lessonId: "skill-2" },
  { id: "L2", title: "听力 2 · 笔记填空", lessonId: "skill-4" },
  { id: "L3", title: "听力 3 · 对话细节", lessonId: "skill-6" },
  { id: "L4", title: "听力 4 · 主旨意图", lessonId: "skill-8" },
  { id: "L5", title: "听力 5 · 信息匹配", lessonId: "skill-10" },
  { id: "S1", title: "口语 1 · 自我与生活", taskId: "production-1", mode: "speaking" },
  { id: "S2", title: "口语 2 · 偏好与理由", taskId: "production-7", mode: "speaking" },
];

export function lessonPassed(score, total) {
  return total > 0 && score / total >= 0.8;
}

export function nextCourseLesson(progress) {
  for (const unit of curriculumUnits) {
    const next = [...unit.vocabulary, ...unit.grammar, unit.skillLesson, unit.checkpoint].find((lesson) => !progress.completed.includes(lesson.id));
    if (next) return next;
  }
  return curriculumUnits[0].checkpoint;
}
