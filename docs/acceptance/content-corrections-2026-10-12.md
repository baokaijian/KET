# Starter Word Meaning and Photo Corrections, 2026-10-12

This batch addresses the six words in the user's original mismatched-image report. Sources below were checked individually. The examples are original teaching contexts, not dictionary quotations. Codex viewed each generated original, each final 640 x 640 WebP, and desktop/mobile browser screenshots. This is agent visual review, not an independent teacher signature or a real-device pronunciation assessment.

| Word | Teaching meaning and scene | Meaning source | Limit of the example |
| --- | --- | --- | --- |
| all | All four children are wearing hats; the complete four-child group is visible. Chinese gloss now also preserves the degree sense: 全部；所有的；完全. | [Cambridge: all](https://dictionary.cambridge.org/dictionary/english/all) | This group only, not all children everywhere; the photograph does not represent every use of all. |
| also | The child already holds an apple and receives an additional banana. Chinese gloss explains addition: 也；还（表示增加另一件事）. | [Cambridge: also](https://dictionary.cambridge.org/dictionary/english/also) | The paired two-sentence context supplies addition; fruit alone is not the meaning of also. |
| always | Putting shoes by the door, beside a physical Mon-Sun chart with seven checks. Chinese gloss: 总是；每次都；一直. | [Cambridge: always](https://dictionary.cambridge.org/dictionary/english/always) | An illustrative habit, not proof of a real child's lifelong behaviour or every time forever. |
| a.m. | A clearly visible physical clock reads 9:00 AM. Full Chinese definition retains 午夜十二点到中午十二点之间. | [Cambridge: am / a.m.](https://dictionary.cambridge.org/dictionary/english/am) | Nine in the morning is one example; a.m. is not limited to sunny hours or school time. |
| and | One blue book and one red cup, paired with A book and a cup. Chinese gloss preserves joining and sequence: 和；并且；然后（用于连接词语或句子）. | [Cambridge: and](https://dictionary.cambridge.org/dictionary/english/and) | Neither object is itself named and; conjunction must be taught with the paired phrase. |
| answer | A real question board shows 2 + 1 = ? and the child's response card shows 3. Existing full gloss remains 答案；回答；应答（如接电话）. | [Cambridge: answer](https://dictionary.cambridge.org/dictionary/english/answer) | This image teaches the noun sense 答案, not every verb sense or only answering a telephone. |

## Asset and Speech Evidence

- Each word has a separate `public/word-images/{wordId}.webp`, distinct SHA-256, meaning-specific alt text, a bilingual context, and `requiresContext: true`.
- Six obsolete, unpublished icon templates were replaced. Their original bytes were verified against the clean committed baseline before replacement; no unrelated user edits were overwritten.
- Only these actually viewed replacements are marked `fixed`; unreviewed words remain unpublished and pending. Exact generation prompts and review notes are retained in `src/data/starter-images.js`, and the generation queue now retains those specific prompts.
- Standalone dotted `a.m.` is sent to speech synthesis as `A M`. Plain `am`, radio `AM`, and `I am six.` are not changed. The example is spoken as `It is nine in the morning.` Browser speech mocks confirm the actual submitted texts, not the acoustic quality of a system voice.
- Official word IDs, parts of speech, and primary topics are preserved. No icon fallback, duplicate photo reuse across distinct words, input/spelling requirement, or teacher-approved status was introduced.

## Verification

- Focused data checks: 14 / 14; full data and logic suite: 111 / 111 across ten files.
- Six-word focused browser checks: 2 / 2 on desktop/mobile, repeated after improving screenshots to capture the picture and context separately.
- Screenshots confirm complete picture subjects, meaning labels, parts of speech and context text without horizontal overflow. Long entries scroll inside the modal; a viewport screenshot of the context is not evidence that the picture is simultaneously wholly visible.
- Final full platform and GitHub Pages results are recorded in `child-learning-acceptance.md`. Full-bank image completion and independent teacher/device review remain separate requirements.
