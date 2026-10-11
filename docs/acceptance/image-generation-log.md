# 图片生成记录

使用内置 imagegen，每个词单独调用，逐张视觉检查后用 Sharp 转为 640 × 640 WebP。没有抓取网络图片，没有用同一照片替代多个词。源图保留在 Codex 的 generated_images 目录；平台最终资产保存在 `public/word-images/{wordId}.webp`。

## 学校主题补图（2026-10-11）

下列每条为对应独立调用的提示词主体与限制；图片哈希、指定词义和实际视觉依据在 `src/data/additional-images.js`。

| wordId / 最终图片 | 主提示词 | 限制与复核重点 |
| --- | --- | --- |
| l12_pen / public/word-images/l12_pen.webp | ONE clearly recognizable fountain pen for the English word pen, Chinese 钢笔. An unbranded dark green fountain pen with its cap removed and placed alongside, the shiny metal nib clearly visible. Bright light grey studio surface, full pen and cap, crisp three-quarter view. | 不使用铅笔、记号笔或手；检查金属钢笔尖和独立笔帽。 |
| l12_bag / public/word-images/l12_bag.webp | ONE recognizable school bag illustrating English bag, Chinese 包. A small green fabric school backpack standing upright, with two shoulder straps, a carry handle, zipper and front pocket. Bright pale grey studio surface, full object. | 不放置其他文具；检查完整背包、肩带、提手和拉链。 |
| l4_desk / public/word-images/l4_desk.webp | One recognizable writing desk for English desk, Chinese 书桌. One small light wood writing desk with a flat rectangular desktop, four legs, and two small drawers on one side, one drawer slightly open. Bright pale grey room. | 不用餐桌、椅子或电脑代替；检查写字台与内置抽屉。 |
| l4_teacher / public/word-images/l4_teacher.webp | A clearly recognizable school teacher for English teacher, Chinese 老师. One friendly adult woman teacher standing at the front of a primary classroom, holding an open picture book and showing its pictures to two seated children at small school desks. Classroom board with simple shapes only. | 不能只是成人头像；检查老师正在授课、学生课桌和教室黑板。 |
| l5_school / public/word-images/l5_school.webp | An unmistakable primary school illustrating English school, Chinese 学校. A low-rise primary school building, main entrance, classroom windows, fenced playground, children arriving with backpacks and an adult. Classroom board and desks visible through a ground-floor window. | 不用普通住宅代替；检查学校建筑、教室、课桌、操场和学生。 |
| l10_friend / public/word-images/l10_friend.webp | Friendship illustrating English friend, Chinese 朋友. Two six-year-old friends with different appearances walking side by side on a safe footpath, smiling and chatting, carrying backpacks. One child offers a friendly greeting and the other smiles back. | 不能只是两个孤立头像；检查友好互动、共同出行和相互关注。 |

共同限制：真实感摄影、方形构图、清楚主体、自然光，无标语、品牌标记、水印、拼图或泛用图标。

## 后续完整队列

`src/data/word-image-plans.js` 为全部 1687 个词建立唯一文件路径、指定 KET 词义、词性、教学场景和逐词提示词。该队列只用于制作，不把提示词视作图片已存在的证明，不自动写入通过状态。抽象词必须继续检查生成场景是否真的能表达其含义。
