import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import process from "node:process";
import { allKetWords } from "../src/data/ket-words/index.js";
import { wordById, learningWords } from "../src/data/learning.js";
import { imageReviews } from "../src/data/image-reviews.js";

const lines = [
  "# 单词与图片复核",
  "",
  "范围：新版发布课程共 12 个词。其余 1675 个词仍待复核，不展示旧模板图片，不宣称全词库图片验收通过。",
  "",
  "复核者：Codex 逐张视觉检查（不是家长人工签字）。图片使用内置 imagegen 分别生成，缩放为 640px WebP，未使用网络照片。",
  "文件哈希锁定已检查版本；任何替换都必须重新视觉复核。系统 TTS 实际音色与听感仍需要目标设备听辨。",
  "",
  "生成提示词规则：ONE photorealistic educational vocabulary photograph；单一清楚主体、方形构图、明亮灰色背景（鱼为水下）、无文字、无拼图、无水印。逐词主体见 alt 列。",
  "",
  "| ID | 单词 | 指定词义 | 图片 / alt | 状态 | 视觉依据 |",
  "| --- | --- | --- | --- | --- | --- |",
];
let reviewed = 0;
for (const original of allKetWords) {
  const word = wordById[original.id];
  let status = "pending";
  let note = "旧模板图未通过语义复核，已停用。";
  if (word) {
    try {
      const hash = createHash("sha256")
        .update(await readFile(`public/${word.image.src}`))
        .digest("hex");
      const review = imageReviews[word.word];
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
    word ? `${word.image.src} / ${word.image.alt}` : "未发布",
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
  `Published curriculum: ${reviewed}/${learningWords.length} reviewed. Full vocabulary: ${reviewed}/${allKetWords.length}.`,
);
if (
  reviewed !== learningWords.length ||
  (process.argv.includes("--full") && reviewed !== allKetWords.length)
)
  process.exitCode = 1;
