import { learningWords } from "./learning.js";
import { additionalImages } from "./additional-images.js";

// Only visually reviewed photographs are published. Legacy template WebPs are excluded.
export const wordImages = { ...additionalImages, ...Object.fromEntries(
  learningWords.map((word) => [word.id, word.image]),
) };
export function getWordImage(wordId) {
  return wordImages[wordId] || null;
}
