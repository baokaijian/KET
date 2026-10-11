import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { allKetWords } from '../src/data/ket-words/index.js';
import { getSpeakableWordText } from '../src/utils/speechText.js';
import { dictionaryEntry } from '../src/data/learning.js';

const outputPath = resolve('docs/acceptance/content-review-checklist.md');

const rows = allKetWords.map((word) => {
  const displayed = dictionaryEntry(word);
  const speakText = getSpeakableWordText(word);
  return [
    word.level,
    word.topic,
    word.id,
    word.word,
    word.partOfSpeechLabel,
    speakText,
    displayed.phonetic || 'not published',
    word.translation,
    displayed.image?.src || 'not published',
    'provided',
    'pending',
    ''
  ];
});

const header = [
  '# KET Content Accuracy Review Checklist',
  '',
  'All 1687 entries have authored Chinese meanings and no application placeholders. The provided status means a Chinese gloss exists; it is not an independent teacher signature. The pending status tracks independent human content and real-device speech review. Unverified legacy phonetics and icons are not published.',
  '',
  '- Status values: `pending`, `pass`, `fail`, `fixed`.',
  '- Every `fail` must be corrected and rechecked as `fixed` before final acceptance.',
  '- Cambridge baseline: A2 Key Vocabulary List, August 2025.',
  '',
  '| Level | Topic | ID | Word | Official POS | TTS Text | Published Phonetic | Chinese Meaning | Published Photo | Meaning | Independent Review | Notes |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
];

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

const markdown = [
  ...header,
  ...rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`),
  ''
].join('\n');

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, markdown, 'utf8');
console.log(`Wrote ${rows.length} review rows to ${outputPath}`);
