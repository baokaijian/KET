import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { allKetWords } from '../src/data/ket-words/index.js';
import { getSpeakableWordText } from '../src/utils/speechText.js';

const outputPath = resolve('docs/acceptance/content-review-checklist.md');

const rows = allKetWords.map((word) => {
  const speakText = getSpeakableWordText(word);
  return [
    word.level,
    word.topic,
    word.id,
    word.word,
    speakText,
    word.phonetic,
    word.translation,
    word.icon,
    'pending',
    ''
  ];
});

const header = [
  '# KET Content Accuracy Review Checklist',
  '',
  'Use this checklist for the manual acceptance pass that cannot be fully automated: Cambridge headword match, child-friendly Chinese meaning, illustration accuracy, and real browser TTS listening quality.',
  '',
  '- Status values: `pending`, `pass`, `fail`, `fixed`.',
  '- Every `fail` must be corrected and rechecked as `fixed` before final acceptance.',
  '- Cambridge baseline: A2 Key Vocabulary List, August 2025.',
  '',
  '| Level | Topic | ID | Word | TTS Text | Phonetic | Chinese Meaning | Icon | Status | Notes |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
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
