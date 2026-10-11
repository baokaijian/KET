import { allKetWords } from "./ket-words/index.js";
import { wordImages } from "./word-images.js";

// Authoring queue only: a prompt is not evidence that an image exists or is correct.
export const wordImagePlans = Object.fromEntries(allKetWords.map((word) => {
  const reviewed = wordImages[word.id];
  const target = `Target word: ${word.word}. Primary KET meaning: ${reviewed?.meaning || word.translation}. Part of speech: ${word.partOfSpeechLabel}.`;
  const prompt = reviewed?.generationPrompt ? [target, reviewed.generationPrompt].join("\n") : [
    "Use case: photorealistic-natural. Asset type: one square educational vocabulary photograph for a six-year-old.",
    target,
    `Teaching context: ${word.scenePrompt}`,
    "Show the intended meaning, not the written word. For a concrete noun, show a clear recognizable subject; for a verb, show the action; for an abstract or function word, use a specific realistic scene that communicates that meaning.",
    "Choose one teaching sense if the word has multiple meanings. Do not combine unrelated senses. Bright natural light, clear subject, realistic materials, uncropped useful details, no text, no logo, no watermark, no collage or generic icon.",
    "The generated image must be inspected individually before publication. A successful generation does not count as semantic approval.",
  ].join("\n");
  return [word.id, { wordId: word.id, word: word.word, meaning: reviewed?.meaning || word.translation,
    src: `word-images/${word.id}.webp`, alt: reviewed?.alt || "", reviewStatus: reviewed?.reviewStatus || "pending", prompt }];
}));
