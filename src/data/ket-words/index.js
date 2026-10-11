// KET Vocabulary Database Main Entry
// Exposes complete curriculum definition

import { level1Words } from './level-01.js';
import { level2Words } from './level-02.js';
import { level3Words } from './level-03.js';
import { level4Words } from './level-04.js';
import { level5Words } from './level-05.js';
import { level6Words } from './level-06.js';
import { level7Words } from './level-07.js';
import { level8Words } from './level-08.js';
import { level9Words } from './level-09.js';
import { level10Words } from './level-10.js';
import { level11Words } from './level-11.js';
import { level12Words } from './level-12.js';

import { levels, topicCategories } from './levels.js';
import { withCorrectMeaning } from '../ket-meanings.js';
import { withVocabularyMetadata } from '../vocabulary-metadata.js';

export { levels, topicCategories };

export const allKetWords = [
  ...level1Words,
  ...level2Words,
  ...level3Words,
  ...level4Words,
  ...level5Words,
  ...level6Words,
  ...level7Words,
  ...level8Words,
  ...level9Words,
  ...level10Words,
  ...level11Words,
  ...level12Words
].map(withCorrectMeaning).map(withVocabularyMetadata);
