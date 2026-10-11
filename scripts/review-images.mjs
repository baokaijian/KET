import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import process from "node:process";
import { allKetWords } from "../src/data/ket-words/index.js";
import { wordById, dictionaryEntry } from "../src/data/learning.js";
import { imageReviews } from "../src/data/image-reviews.js";
import { wordImages } from "../src/data/word-images.js";

const lines = [
  "# 单词与图片复核",
  "",
  `图片范围：${Object.keys(wordImages).length} 个词有已复核的照片。全词库 ${allKetWords.length} 词的中文释义已补齐；其余 ${allKetWords.length - Object.keys(wordImages).length} 个词的图片仍待复核，不展示旧模板图片，不宣称全词库图片验收通过。`,
  "",
  "复核者：Codex 逐张视觉检查（不是家长人工签字）。图片使用内置 imagegen 分别生成，缩放为 640px WebP，未使用网络照片。",
  "文件哈希锁定已检查版本；任何替换都必须重新视觉复核。系统 TTS 实际音色与听感仍需要目标设备听辨。",
  "",
  "生成提示词规则：每个 word ID 单独生成一张真实感词汇照片。具象物品清楚完整；人物角色与关系用具体生活场景；方形构图、自然光、无标语、无拼图、无水印。逐词主体和已检查语义见 alt 与视觉依据列。",
  "",
  "| ID | 单词 | 指定词义 | 图片 / alt | 状态 | 视觉依据 |",
  "| --- | --- | --- | --- | --- | --- |",
];
let reviewed = 0;
for (const original of allKetWords) {
  const word = dictionaryEntry(original);
  let status = "pending";
  let note = "旧模板图未通过语义复核，已停用。";
  if (word.image) {
    try {
      const hash = createHash("sha256")
        .update(await readFile(`public/${word.image.src}`))
        .digest("hex");
      const review = word.image.sha256 ? { ...word.image, status: word.image.reviewStatus } : imageReviews[wordById[original.id]?.word];
      status = hash === review?.sha256 ? review.status : "fail";
      note = hash === review?.sha256 ? review.note : "图片已变更或无复核证据。";
      if (["pass", "fixed"].includes(status)) reviewed += 1;
    } catch {
      status = "fail";
      note = "图片文件缺失。";
    }
  }
  const cells = [
    original.id,
    original.word,
    word?.translation || original.translation,
    word.image ? `${word.image.src} / ${word.image.alt}` : "未发布",
    status,
    note,
  ];
  lines.push(
    `| ${cells.map((cell) => String(cell).replaceAll("|", "\\|")).join(" | ")} |`,
  );
}
await mkdir("docs/acceptance", { recursive: true });
await writeFile(
  "docs/acceptance/image-review-checklist.md",
  `${lines.join("\n")}\n`,
);
console.log(
  `Published photos: ${reviewed}/${Object.keys(wordImages).length} reviewed. Full vocabulary photos: ${reviewed}/${allKetWords.length}.`,
);
if (
  reviewed !== Object.keys(wordImages).length ||
  (process.argv.includes("--full") && reviewed !== allKetWords.length)
)
  process.exitCode = 1;
