import { allKetWords, topicCategories } from './ket-words/index.js';

export const categories = topicCategories;

export const wordsData = allKetWords.map(word => ({
  ...word,
  category: word.topic // compatibility mapping
}));

