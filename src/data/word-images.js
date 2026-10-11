import { learningWords } from "./learning.js";

// Only visually reviewed photographs are published. Legacy template WebPs are excluded.
export const wordImages = Object.fromEntries(
  learningWords.map((word) => [word.id, word.image]),
);
export function getWordImage(wordId) {
  return wordImages[wordId] || null;
}
