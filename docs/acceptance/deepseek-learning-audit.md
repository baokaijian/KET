# Sparks · KET 独立学习流程验收审计（DeepSeek / 2026-10-11）

- 审计对象：工作目录 `/Users/baokaijian/Project/KET`，基线提交 `b0663dc`（开始阅读时 `git status` 干净）。
- 目标用户假设：6 岁儿童；不需要拼写/打字；重点是听力、认读、长句与短文阅读；学习当天巩固、间隔逐渐拉长。
- 本报告区分两类结论：
  - **[执行]** 我用独立脚本 / 独立浏览器探针在本机实际跑出来的结果（脚本在 `/private/tmp/ket-verify/`，不入库）。
  - **[阅读]** 只通过读源码推断，未实际运行。
- 未做的事（约束 + 能力边界）：没有修改任何源码/图片/测试/既有文档（本文件是唯一新增文件）；没有提交、推送、清理；没有启动或停止任何服务（复用他人已在 `127.0.0.1:5173` 运行的 Vite dev server）；没有运行会覆盖 `test-results` / `dist` / `dist-pages` 的全量测试（`test:functional`、`test:acceptance`、`test:pages`）；没有做全词库语义审计；没有在真实手机/平板或真实麦克风上验证。
- 并发情况：审计期间另一位代理改动了 `src/data/curriculum.js` 与 `scripts/import-vocabulary-metadata.py`（并新增 `src/data/course-group-baseline.json`）。我的 Node 逻辑探针跑在干净基线上；浏览器探针与 5 条 e2e 子集跑在其改动落地前后，结论已尽量与数据无关。**当前工作区 `curriculum.test.js > keeps old completion IDs only for unchanged ordered word groups` 失败属于该代理在途工作，不是本次审计结论，由主任务统一复核。**

审计基线文件哈希（`shasum -a 256`，审计时刻）：

```
7653db1c…  src/utils/learningProgress.js
766a3732…  src/utils/dailyPlan.js
61bc23f1…  src/App.jsx
1177270d…  src/components/DailyLearning.jsx
5466f652…  src/data/child-course.js
b038eb84…  src/data/child-reading.js
24ab3afd…  src/data/curriculum.js   (审计后已被并发代理改动)
98e44cca…  src/utils/audio.js
```

---

## 0. 结论摘要

| ID | 严重度 | 结论 | 验证 |
|---|---|---|---|
| F1 | **高** | 儿童“今天”页的“复习老朋友”可以出现**打字填空**题（来自家长区 `skill-4` / `skill-9`），直接违反“6 岁不需要拼写/打字” | 执行 |
| F2 | **高** | 设备无 `speechSynthesis`、或 TTS 不触发 `onend` 时，**听力题永久不可作答且没有任何跳过入口**，当天的词汇小测/到期复习无法完成 | 执行 |
| F3 | 中 | “听这段文字”的提示状态只存在内存、reload 后丢失：**先听后答会被记成独立阅读成功**（提示虚增掌握） | 执行 |
| F4 | 中 | “成长记录 · 再练一次”列表先显示单词+中文释义，再给同一词出听力/词义题：**照着刚看到的释义点选即记为独立答对，可把词推成“已掌握”** | 执行 |
| F5 | 中 | 每日路径的复习上限固定 20 项，但每天新增排期多于 20（8 个新词即产生 16 条技能排期 + 句子/故事题），**到期积压单调增长**：模拟 40 天 5→263，240 天→1151，永不收敛 | 执行 |
| F6 | 中 | 84 道故事理解题的正确答案位置固定：短故事恒为 `[0,1,2]`，进阶故事恒为 `[0,1,2,0]`，12 个主题完全相同；按位置猜即可满分 | 执行 |
| F7 | 中 | 答错会把该技能 `successDays` **整体清空**（不只是“缩短间隔”），而题面在点选后立即锁定，**误触无法撤销**；对 6 岁误触率高的场景风险偏高 | 执行（逻辑） |
| F8 | 低 | 跨午夜 4 分钟内两次答对会被记成 2 个不同“学习日”并推进一个间隔档位 | 执行 |
| F9 | 低 | `checkpoints` 复用其单元 grammar/skill 的 72 个题 ID（1867 题中 1795 唯一），阶段检查与其单元课共享同一份间隔复习记录 | 执行 |
| F10 | 低 | 数据卫生：`bag` 同时属于 school 与 shopping 两个主题；因此 `childQuestionById` 只有 251 条而题目有 252 条（`vocab-l12_bag` 重复，后者被静默覆盖） | 执行 |
| F11 | 低 | 主题内一致性：`clothes` 的 `sock`、`body` 的 `mouth` 未出现在该主题的“听读句子”里；`mouth` 在 body 的句子/短故事/进阶故事中完全没出现 | 执行 |
| F12 | 低 | 未接线的旧代码保留“拼写游戏”和“答对 2 次即掌握”（`WordLearn` / `QuizArena` / `ParentDashboard` / `src/data/progress.js`），当前不可达但策略相反，属于长期维护风险 | 执行（导入图） |
| F13 | 低 | 手机端触控目标偏小：主导航链接 34px 高、句子朗读按钮 38×38、设置按钮 38×38（低于 44px 常规建议）；所有测量页面横向溢出均为 0 | 执行 |
| F14 | 低 | `dailyPlans` 每天累积一条（240 天约 243 KB），`memory` 随词量线性增长；无清理策略 | 执行 |
| F15 | 低 | 6 岁自主操作仍依赖识字：四个任务按钮只有中文文字标签，没有语音引导；周末“轻量复习日”仍照常提供完整句子/故事任务 | 阅读 |

**可以确认的正常项**：同日重复不推进、提前复习不推进、独立掌握需要听力与阅读各 3 个不同日期、提示默认不计独立成功（不 reload 时）、听力与阅读分开排期、断点续学可用、日期/时区/DST 计算安全、12 主题 48 项活动齐全且答案键无措辞错误、桌面与 390px 手机无横向溢出。详见第 3 节。

---

## 1. 方法（可复现）

| 探针 | 位置 | 作用 |
|---|---|---|
| `logic-probe.mjs` / `early.mjs` / `midnight.mjs` | `/private/tmp/ket-verify/` | 直接 import 项目 ESM 模块，验证同日重复/提前复习（含“提前一天”）/提示/掌握门槛/积压上限/日期边界/存储清洗/跨午夜 |
| `day-sim.mjs` / `day-sim-long.mjs` | 同上 | 模拟一个 6 岁儿童 40 / 240 天的真实每日流程（新词小测 + 句子 + 故事 + 进阶故事 + 全部到期复习），观察每日量与积压 |
| `tz-probe.mjs` | 同上 | 在 6 个时区（含 `Pacific/Kiritimati` UTC+14、`Australia/Lord_Howe` 半小时 DST）验证 `localDay` / `dayAfter` / `validDay` |
| `content-consistency*.mjs` | 同上 | 12 主题词/句/短故事/进阶故事覆盖与角色一致性、重复词 |
| `ui-probe*.mjs` | 同上 | 裸 `playwright` 模块驱动已运行的 dev server，验证语音失败、提示丢失、错题本泄漏、打字题、断点续学、麦克风拒绝、触控尺寸 |

运行方式（不写项目内文件）：

```sh
node /private/tmp/ket-verify/logic-probe.mjs
node /private/tmp/ket-verify/early.mjs
node /private/tmp/ket-verify/midnight.mjs
node /private/tmp/ket-verify/day-sim.mjs
for z in Asia/Shanghai America/New_York Pacific/Kiritimati UTC; do TZ=$z node /private/tmp/ket-verify/tz-probe.mjs; done
node /private/tmp/ket-verify/ui-probe.mjs      # 需要 5173 已在跑
node /private/tmp/ket-verify/ui-probe2.mjs
node /private/tmp/ket-verify/ui-probe3.mjs
```

已有测试的实际运行情况（不是我新增的测试）：

- `npx vitest run tests/unit tests/data` 在干净基线 `b0663dc` 上 **52 passed**（19:31）。并发改动落地后同一命令 **51 passed / 1 failed**，失败项属于另一位代理的 course ID 兼容工作。
- `npx playwright test tests/e2e/child-learning.spec.js tests/e2e/learning-flow.spec.js --project=chromium --output=/private/tmp/ket-verify/pw-out -g "reduced four-word day|due reviews preserve|daily eight-word lesson resumes|hearing a reading hint|voice failure leaves listening"` → **5 passed (8.5s)**，复用已在跑的 5173，产物写到 `/private/tmp`；已核对 `test-results/` mtime 未变（仍为 19:24:07）。
- 我没有运行 `test:full-content`（图片门禁 74/1687 与本次结论无关），也没有跑 mobile 项目与整个 e2e 套件。

---

## 2. 可复现问题（按严重度）

### F1 [执行 · 高] 儿童每日复习会出现打字填空题

- 现象：`今天 → 复习老朋友` 里出现 `.spelling-form input`（`aria-label="输入填空答案"`），题目如 `School trip: destination = ___ (one word)`，必须拼出 `museum` 才能继续。
- 触发条件：家长先在家长区做过 `skill-4`（听力笔记填空）或 `skill-9`（邮件单词填空），这些题就会写入 `memory`，之后被儿童侧的计划接受并排期。
- 证据（行号）：
  - `src/data/skill-lessons.js:73-81`（第 79 行生成 `type: "input", acceptedAnswers`）→ 12 道 `skill-4-*` / `skill-9-*`。
  - `src/utils/dailyPlan.js:14`：到期复习只按“id 是否在三个注册表里”过滤，`courseQuestionById` 也算合法 → 家长区题进入儿童计划。
  - `src/utils/dailyPlan.js:42`：非单词题被原样返回，`type: "input"` 保留。
  - `src/App.jsx:536`：`["spelling","input"].includes(question.type)` 渲染输入框。
- 复现（浏览器，实测输出）：
  1. 写入 `localStorage.sparks_learning_v2 = {"memory":{"skill-4-1":{"listening":{...due:"<今天>"...}}}}`；
  2. 打开 `#today` → 卡片显示“3 项到期复习”；
  3. 点“开始复习”，第 2 题即为输入框：`S5 review q2: {"prompt":"School trip: destination = ___ (one word)","hasAudio":true,"typingBox":true,"aria":"输入填空答案","optionCount":0}`。
- 风险：直接违背本轮验收范围（“当前不需要拼写”）；6 岁儿童遇到该题会卡住或乱输，进而把 `skill-4-*` 记成错误、进入错题本。
- 建议：在 `buildDailyPlan` 的过滤条件（`dailyPlan.js:10,14`）里排除 `type` 为 `input`/`spelling` 的题；或在 `reviewQuestions`（`dailyPlan.js:39-51`）里把这类题降级为词义/听力选择题；儿童侧入口再加一层“无打字”断言与 e2e 回归。

### F2 [执行 · 高] 语音不可用时听力题死锁，无跳过路径

- 现象：
  - `window.speechSynthesis` 不存在：点击“播放听力”后提示 `没有成功播放，请检查设备音量后重试。` + toast `这个浏览器暂不支持朗读…`，**3 个选项全部保持 disabled**，页面没有“跳过/下一题”按钮（探针统计 `escape/skip control present: 0`）。
  - `speechSynthesis.speak()` 静默返回、不触发 `onend`（Chrome 长句/语音未就绪时的已知表现）：提示停留在 `听完后再选择答案。`，2.5 秒后仍全部 disabled 且无报错。
- 证据（行号）：`src/App.jsx:417-431`（`listen()` 只有 `onEnd` 才 `setHeard(true)`）、`src/App.jsx:522-535`（听力控件）、`src/App.jsx:569-573`（`!heard` 时选项禁用）、`src/utils/audio.js:208-211`（无 speechSynthesis 直接返回 false）、`audio.js:235-273`（120ms 延时后 speak，`onend` 未触发时无超时兜底）。
- 复现：`page.addInitScript` 删除 `speechSynthesis`（或注入只吞掉 `onend` 的 `speak`）→ `#assessment` → “听力小挑战” → “播放听力” → 观察选项 disabled 数量。
- 风险：听力题同时出现在每日词汇小测（`vocabularyQuestions` 奇数下标，`src/data/curriculum.js:39-42`）、句子课、到期复习里，一旦设备语音不可用，当天计划无法完成，且孩子没有任何自助出路；现有 e2e 只覆盖了 `onerror` 路径（`tests/e2e/learning-flow.spec.js:272-287`），未覆盖“静默无回调”。
- 建议：`listen()` 增加超时兜底（例如 3–5 秒后若未 `onend` 且未报错，则允许作答并标注“使用文字提示”/不计听力独立掌握），并在 `!accepted` 或 `audioError` 时提供“跳过此题/看文字选项”的可点击出路。

### F3 [执行 · 中] 提示状态不随断点续学保存 → 听后理解被记成独立阅读

- 现象：先点“听这段文字”，再刷新页面并重新进入同一活动（会自动断点续学到同一题），提示状态丢失，答对后 `memory[id].reading.lastCorrect = true` 且 `successDays` 增加一天——本应“不计入独立阅读掌握”。
- 实测对照（同一入口 `#assessment → 阅读小挑战`，第一题）：
  - 不刷新：`{"step":0,"successDays":[],"lastCorrect":false}`，页面显示“本题记录为听后理解，不计入独立阅读掌握。”
  - 听 → 刷新 → 重进（resumes 到同一题，提示文字消失）→ 答对：`{"step":1,"successDays":["2026-10-11"],"lastCorrect":true}`。
- 证据（行号）：`src/App.jsx:370-372` 持久化快照只写 `{fingerprint, stage, index, responses, choice, guideAudio}`，**没有 `heard`**；`src/App.jsx:357-361` 恢复校验同样不含 `heard`；`src/App.jsx:387` 的 `hinted` 依赖 `heard || guideAudio`；`src/App.jsx:517-519` 提示 UI 也依赖 `heard`。有 guide 的故事课走 `guideAudio`（会被持久化）所以不受影响，但测评/复习里的“听这段文字”受影响。
- 复现：见 `ui-probe3.mjs`（A 不刷新 / B 刷新两组对照）。
- 风险：每刷新一次就能多记一个“独立阅读日”，3 次即可让该题计入掌握；对“提示不能虚增掌握”的验收目标来说是真实漏洞。
- 建议：把 `heard`（及其对应题号）纳入会话快照，或改为“只要听过本段 `passage` 就在本次会话内持久标记 `hinted`”（例如按 `question.id` 存一个 `hintedIds` 集合）。

### F4 [执行 · 中] 错题本先给中文释义，再考听力/词义 → 独立答对可虚增并直接达成“已掌握”

- 现象：`成长记录 → 再练一次` 列表对每个待复习词同时显示 `apple` 与 `苹果`（`src/App.jsx:952-979`，释义在 962-967 行）。点“复习”后，同一词的题目（`reviewQuestions` 造出的听力题或词义题）正确选项就是刚才显示的 `苹果`。
- 实测（`ui-probe.mjs` S3）：
  - 列表可见文本：`"apple | 苹果 | 复习"`；
  - 点“复习”后题目：`听一听，选择这个词的意思。`（听力题），选项 `["A 苹果","B 烘烤（用烤箱烤食物）","C 香蕉"]`；
  - 直接点“苹果” → `答对啦！`，`memory.l2_apple.listening.lastCorrect` 从 `false` 变 `true`。
  - 逻辑层再确认（`leak-mastery.mjs`）：听力已有 3 个成功日但 `lastCorrect:false` 的词，在“新的一天”重复上述操作后 `mastered` 变为 `["l2_apple"]`，同时该词从错题本消失。
- 证据（行号）：`src/App.jsx:962-967`（显示译文）、`src/App.jsx:1129-1142`（`review()` 组装题目，1133 行按 `!lastCorrect` 猜技能）、`src/utils/dailyPlan.js:39-51`。
- 风险：错题本的“纠错”证据不成立，掌握计数被污染；“已掌握”对家长是决策信号。
- 建议：错题列表只显示单词（或只显示题面），把中文释义留到反馈后再展示；或对该路径的作答强制 `hinted: true`（只用于订正、不计独立证据）。

### F5 [执行 · 中] 每日复习上限与新增排期不匹配，积压只增不减

- 机制：`recordEncounter`（`src/utils/learningProgress.js:57-64`）对每个新词同时建立 `reading` 与 `listening` 两条排期；每日计划把复习截断到 20 条并据此计算 `backlog`（`src/utils/dailyPlan.js:21-23`）。因此 8 个新词＝次日 16 条到期，再加该主题句子 6 题 + 短故事 3 题（进阶阶段再加 4 题）＝单日新增 25–29 条，而“今天”页每天只发 20 条。
- 实测（`day-sim.mjs`，孩子每天完成全部任务、全部答对）：
  - 第 2 天即 `new=4, review=20, backlog=5`（新词从 8 降到 4）；
  - 第 40 天 backlog 263、第 120 天 644、第 240 天 1151（`day-sim-long.mjs`），**从未下降**；
  - 长期需求下限：1687 词 × 2 技能 ÷ 60 天 ≈ 56 条/天 > 20 条/天上限。
- 证据（行号）：`src/utils/dailyPlan.js:14,21-23`；`src/utils/learningProgress.js:55-64,96-102`；`src/components/DailyLearning.jsx:25`（只发 `plan.review`）。
- 补充（[阅读]）：`成长记录` 页的“复习到期内容”按**当前**到期队列每次取 20 条（`src/App.jsx:947`），理论上可以反复点击额外清队列；但“今天”页的计划是当日冻结的 20 条，且 UI 没有任何“去清积压”的引导，所以日常路径仍会长期积压。
- 建议：要么把每日上限改为“按可支配时长/积压比例动态调整”（例如 backlog>40 时提高到 30 条并暂停新词），要么把 `recordEncounter` 的双技能排期错开（新词当天只排一个技能，第二天再排另一个），要么在“今天”页显式给出“继续清积压”入口并显示趋势。

### F6 [执行 · 中] 84 道故事理解题答案位置固定

- 实测：12 个短故事的答案序列**全部**是 `0,1,2`；12 个进阶故事**全部**是 `0,1,2,0`（脚本 `content-consistency` 输出 `distinct short-story answer patterns: [ '0,1,2' ]`、`distinct long-story answer patterns: [ '0,1,2,0' ]`）。84 题分布 `[36,24,24]`。
- 证据（行号）：`src/data/child-course.js:112-115`（短故事题直接继承数据里的 `answer`）、`src/data/child-reading.js:6,11,16,21,26,31,36,41,46,51,56,61`；两组独立子代理逐题核对后同样只报了这一个系统性模式问题。
- 风险：只要记住“第 1 题选第 1 个、第 4 题选第 1 个”就能在故事题上满分，理解证据失真（这不是措辞错误，答案键本身经核对无措辞问题）。
- 建议：出题/构建时按题打乱选项（保留 `answer` 同步重算），或在数据里显式打散位置；加一条“同一主题内答案位置不得固定”的数据测试。

### F7 [执行逻辑 · 中] 答错清空全部成功日 + 点选后不可撤销

- 实测：某技能在 4 个不同日期独立答对后，一次答错 → `successDays: []`、`step: 0`、`lastCorrect:false`、退出 `mastered`（`logic-probe.mjs` “mastery gate”一节的输出）。提示型答对则保留 `successDays` 只把 `step` 归零（`logic-probe.mjs` hinted 输出）。
- 证据（行号）：`src/utils/learningProgress.js:74`（`successDays: correct ? successDays : []`）、`:75`（`step` 归零）、`:77-80`；UI 上点选后选项立即锁定（`src/App.jsx:569-573`，`choice !== null` 即禁用），没有撤销/“我点错了”。
- 风险：README 第 11 行写“答错或使用提示缩短间隔”，实际是**清空累计日**。对 6 岁儿童误触（点错选项、手指滑动）而言，一次误触抹掉数周证据，且错题本里只表现为“要重新复习”。
- 建议：文案与行为对齐（至少说明会重置）；或改为“答错回退 1–2 个档位但保留已获得的成功日”；提供一次性“点错了，撤销本题”按钮（尤其在首次答错时）。

### F8 [执行 · 低] 跨午夜 4 分钟可记成 2 个学习日

- 实测（`midnight.mjs`）：23:55 认识新词 → 23:58 答对（`successDays:["2026-10-12"]`, due 10-13）→ 00:02 同一词再答对（`successDays:["2026-10-12","2026-10-13"]`, step 2, due 10-15）。判定依据是 `newDay && old.due <= day`（`src/utils/learningProgress.js:72-73`），只按日历日而不是经过时长。
- 可达路径：晚上完成词汇小测后页面跨过午夜（`DailyLearning.jsx:9-14` 每分钟刷新 `date`），新一天的“复习老朋友”会把该词列为到期，孩子/家长再点一次即可。
- 风险：低（需要深夜学习或设备时钟异常）；但配合 F3/F4 的路径，可更快堆出“3 个不同日期”。设备时间被错误设置时同理。
- 建议：把“同一技能两次计入之间至少间隔 N 小时”作为附加条件，或把 `localDay` 切换点按“上次学习时间 + 4 小时”作为一个会话日。

### F9 [执行 · 低] 阶段检查复用单元题 ID（1867 题 → 1795 唯一）

- 实测：`curriculum.js` 的 `courseLessons` 共 1867 题、唯一 ID 1795，重复 72 条（`grammar-be-1` 等每组 2 次），刚好等于 12 个 `checkpoints` 各复制的 3 道 grammar + 3 道 skill 题。
- 证据（行号）：`src/data/curriculum.js:74-84`（`checkpoints` 展开 `grammarLessons`/`skillLessons` 的 questions）、`:95-96`（`courseQuestionById` 按 ID 建表，重复被静默覆盖）。
- 风险：阶段检查与其单元课共享同一份 `memory`/间隔复习记录——在检查里答对等于给该单元课题目记账，反之亦然；“阶段检查”作为独立评估的解释力被削弱。
- 建议：给 checkpoint 的题目派生新 ID（如 `checkpoint-4-skill-1`）或直接共用但明确说明共享记录。

### F10 [执行 · 低] 数据卫生：`bag` 跨主题、`vocab-l12_bag` 题 ID 重复

- 实测：12 个主题共 96 个词位但只有 95 个唯一 `word.id`——`l12_bag` 同时出现在 school（`src/data/child-course.js:27`）与 shopping（`:69`）。因此 `childLessons` 有 252 道题但 `childQuestionById` 只有 251 条，重复项 `vocab-l12_bag` 指向 school 与 shopping 两个词汇课。
- 影响：目前 `check()` 用 `wordId` 记账（`src/App.jsx:387`），所以掌握与排期不受影响；受影响的是 `childQuestionById` 的展示/映射（`Progress` 的 `questionRegistry`）。另外 shopping 主题的“今天新词”在 school 之后只会显示 7 个新词。
- 建议：替换其中一个主题的 `bag`（或显式允许跨主题复用并让数据测试接受 95），并加一条“child question id 唯一”的数据测试。

### F11 [执行 · 低] 主题内词句覆盖：`sock` / `mouth`

- 实测（复数容错匹配）：12 主题的“听读句子”基本覆盖本主题 8 词，例外是 `clothes` 缺 `sock`、`body` 缺 `mouth`；`mouth` 在 body 的句子、短故事、进阶故事中**一次都没出现**（`sock` 至少在 clothes 进阶故事里出现）。
- 证据（行号）：`src/data/child-course.js:52`（clothes 句子）、`:58`（body 句子）、`:59`（body 短故事）、`src/data/child-reading.js:40`（body 进阶故事）。
- 风险：这两个词只有词汇卡/照片，没有语境复现，与本项目“听读为主、句子巩固”的设计不一致。
- 建议：在对应主题句子或故事里各补一处自然语境，并加一条“每个主题 8 词至少在本主题句子中出现一次”的数据测试。

### F12 [执行 · 低] 未接线的旧代码保留相反的掌握策略

- 实测导入图：`src/main.jsx → App.jsx` 只引用 `WordIllustration / CourseHub / ProductionWorkspace / CourseAssessment / DailyLearning`；`WordLearn.jsx`、`QuizArena.jsx`、`ParentDashboard.jsx`、`StickerBook.jsx`、`Navbar.jsx`、`Mascot.jsx` 无任何 import（grep 无命中），`src/data/progress.js` 无任何引用者。
- 其中包含拼写游戏（`src/components/WordLearn.jsx:108,116` “Can you spell…”）与“答对 2 次即掌握”（`src/data/progress.js:50,78`），与当前“不拼写 + 三日独立掌握”的策略相反。
- 风险：当前不可达，但一旦被重新接线会直接破坏掌握口径；`src/data/progress.js` 还写另一套 `ket_progress` 存储。
- 建议：删除或加显式注释/测试守卫（例如“这些组件不得被 App 引用”），本次不改。

### F13 [执行 · 低] 手机端触控目标偏小（实测尺寸）

| 位置 | 尺寸 | 建议下限 |
|---|---|---|
| 主“今天/学习天地/KET 小测/成长记录”链接（390px 宽） | 52–76 × **34** | 44 |
| 句子/故事逐句朗读按钮 `.icon-button` | **38 × 38** | 44 |
| 设置齿轮 `.icon-button` | **38 × 38** | 44 |
| “今天”页四个任务按钮 | 90–113 × 42–43 | 44（`.primary/.secondary/.quiet-button { min-height:42px }`，`src/index.css:277-289`） |
| 答案选项 | 318 × 58 | 优 |
| “播放听力” | 64 高（`src/index.css:774`） | 优 |
| 横向溢出（今天/学习天地/测验，390px 与 1280px） | **0px** | — |

- 证据：`src/index.css:139-146`（nav 链接 `padding:10px 16px; font-size:14px`）、`:156-166`、`:277-289`、`:701-703`、`:774`、`:1449`、`:1606-1611`。
- 结论：布局可用、无溢出；但 34–42px 的点击目标低于儿童设备常用建议，配合 6 岁的手指精度会明显增加误触，而误触的代价见 F7。

### F14 [执行 · 低] 本地存储无清理策略

- 实测：`dailyPlans` 每天一条，400 天约 50 KB；模拟 240 天时整个 `dailyPlans` 序列化约 243 KB，`memory` 802 条（最终会到 3374+ 条技能项）。`sessions` 有 `slice(-100)` 上限（`src/App.jsx:1271`），`dailyPlans`/`memory` 没有。
- 建议：只保留最近 N 天 `dailyPlans`（例如 90 天）；`memory` 可对长期不再到期的已掌握项做压缩（保留 `successDays.length` 与 `due` 即可，但注意与 F3/F7 的语义）。

### F15 [阅读 · 低] 自主操作仍依赖识字 / 周末任务不“轻量”

- `src/components/DailyLearning.jsx:22-32`：四个任务按钮只有中文标签（图标不表意），没有任何语音引导；6 岁儿童若不识字，无法判断“开始学习/听读句子/打开故事”的区别，需要家长先教一次位置。
- `DailyLearning.jsx:23` 在周日显示“轻量复习日”，但 `:27-28` 仍然把 6 句 + 故事任务设为可用（只有新词被禁用），与“轻量”标签不一致。
- 这两条只通过阅读得出，未做可用性实验。

---

## 3. 各审计维度的实际结果

### 3.1 同日重复 / 提前复习 / 提示（正常路径）——[执行] 通过

`logic-probe.mjs` 输出（节选）：

```
after 1st correct: {"step":1,"successDays":["2026-10-12"],"due":"2026-10-13",...}
after 5 more same-day corrects: step=1 successDays=1 due=2026-10-13        # 同日重复不推进
hinted correct same day: {"step":0,"successDays":["2026-10-12"],"lastCorrect":false}

# 提前复习（early.mjs）：10-13 按时答对后 due=10-15，10-14 提前一天再答对
after on-time 10-13 correct:         step=2 successDays=[10-12,10-13] due=2026-10-15
after EARLY   10-14 correct:         step=2 successDays=[10-12,10-13] due=2026-10-15   # 不推进、不加天数
after on-time 10-15 correct:         step=3 successDays=[10-12,10-13,10-15] due=2026-10-19
```

提前复习只更新 `lastDay`/`lastCorrect`，不改 `step`/`successDays`/`due`（`src/utils/learningProgress.js:72-80`）；次日按时再答仍可正常推进。

掌握门槛：听力与阅读各需 ≥3 个不同成功日且最近一次独立答对（`src/utils/learningProgress.js:17-19,82-88`）；实测 4 天×2 技能后 `mastered=["l2_apple"]`，一次答错后立即移除。间隔档位 `reviewGaps=[1,2,4,7,16,30,60]`（`:55`）对应 README 的“第 1、3、7、14、30、60 天”节点（`:75,78`），实测 step 7 → `+60` 天，一致。

### 3.2 听力与阅读分别排期——[执行] 通过

- `memory[wordId]` 按 `reading` / `listening` 两条记录（`learningProgress.js:60-63,76-81`）；
- `dueReviews` 返回 `{id, skill}`（`:96-102`），计划保留 `skill`（`dailyPlan.js:23`），`reviewQuestions` 按 skill 生成听力（带 `audio`/`type:"listening"`）或词义题（`dailyPlan.js:46-48`）；
- `Progress` 页逐条标注“听力/阅读 · 已独立答对 N 个学习日 · due”（`App.jsx:947`）。
- 实测：`e2e` 子集 “due reviews preserve listening versus reading and survive a reload” 通过（`tests/e2e/child-learning.spec.js:158-181`）；单测断言只答 `listening` 时不会凭空产生 `reading` 记录（`tests/unit/spaced-review.test.js:38-39`）。

### 3.3 跨日与时区——[执行] 通过

- `localDay` 用本地日历日、`due` 用 `YYYY-MM-DD` 字符串比较（`learningProgress.js:14-16,96-101`），`validDay` 用本地正午回环校验（`:20-24`），设计上抗 DST 与 UTC 偏移。
- 6 个时区实测（含 UTC+14、半小时 DST、南半球夏令时）`localDay/dayAfter/validDay` 全部一致；跨月/跨年（10-31→11-01、12-31→2027-01-01）正确。
- 已知弱点只有 F8（午夜边界按日历日判定）与“设备时钟被改”这类客户端固有限制（[阅读]）。
- 时区变更（旅行）不会损坏记录：`day` 不匹配时只是重建当天计划，旧 `dailyPlans` 保留，`memory` 的 `due` 仍可比较（[阅读] + 局部执行）。

### 3.4 断点续学——[执行] 通过

- 每日新词课：进入 → 下一个单词（apple→banana）→ 返回 → reload → 重进，恢复到 `banana`（`ui-probe2.mjs` S6；与 `tests/e2e/child-learning.spec.js:39-63` 一致）。
- 实现：会话快照按 `sparks_activity_<lessonId>` 存 `{fingerprint, stage, index, responses, choice, guideAudio}`，指纹含词表与题 ID（`App.jsx:355-372`）；无 lesson 的活动（当天复习）指纹额外包含 `localDay()`。
- 已知缺口就是 F3（`heard` 不持久化）；另外活动完成进入 result 阶段后快照不再被接受（`App.jsx:360` 只接受 `learn/quiz/guide`），重进会从头开始（`completed` 已记账，重复劳动但不丢进度）。

### 3.5 错题本——[执行] 部分通过

- 正常路径：答错 → `review` 去重加入（`learningProgress.js:89-91`）；独立答对且各技能 `lastCorrect` → 移出；单词错题走 `reviewQuestions`，题目错题原样重放（`App.jsx:1132-1137`），因此阅读错题会带着原 `passage` 复现（`tests/e2e/learning-flow.spec.js:358-381`）。
- 问题：F4（列表泄漏中文释义）使“订正”能虚增独立证据。
- 未验证：错题本没有“按错因分类/历史快照”，我没有评估其长期可用性。

### 3.6 录音与语音失败——[执行] 部分通过

- 语音**成功路径**：mock 下 `en-GB`、语速、逐句播放均正确（既有 e2e `learning-flow.spec.js:176-211,258-270`，我未重跑全部）。
- 语音**失败路径**：`onerror` 会提示且不计分（`audio.js:256-266`，`App.jsx:387` 的 `hinted` 同样不受影响；e2e 274-284 通过）→ 但 `onend` 静默缺失与 API 缺失会导致死锁 **F2**。
- 录音：麦克风被拒绝时提示“暂时无法使用麦克风。允许麦克风权限，或者直接大声练习。”（实测 S7），不产生 `audio` 元素；`record()` 有 `waitingForMic` 防重入、60 秒自动停止、卸载时 `stop()` + 释放 `ObjectURL`（`App.jsx:646-704`）[阅读]；录音成功回放与导航后停止音轨由既有 e2e 覆盖（`learning-flow.spec.js:315-356`），我未用真实麦克风复跑。
- **未验证**：真实设备发音准确度/音色、真实录音质量（README 第 73 行也已声明不能证明）。

### 3.7 12 主题词/句/故事/进阶故事一致性——[执行] 通过（含 3 条低风险项）

- 结构：12 主题 × （8 词 + 6 句 + 3 题短故事 + 4 题进阶故事）= 48 项活动、252 题；短故事 40–50 词、进阶故事 103–113 词，与 README 第 29 行“30–60 词 / 103–113 词”一致；每个主题都有进阶故事（`lessons w/o longStory: 0`）。
- 答案键：两个独立子代理逐题核对 36 + 48 题，**没有发现任何答案位置与原文不符**；仅 2 处措辞层面的推断题（`child-reading.js:26` “放不下的书放在哪里”、`:56` “谁会开车来接他们”），声明答案仍是唯一可支持项。
- 角色/语境：13 个人名各自只出现在本主题的短故事与进阶故事中，无跨主题串用；角色与主题匹配。
- 问题项：F6（答案位置固定）、F10（`bag` 重复）、F11（`sock`/`mouth` 语境缺失）。
- 注意：以上是**代理阅读核对**，不是教师语义审阅，也不代表家长签字。

### 3.8 桌面 / 手机自主操作——[执行] 基本可用

- 390×844 与 1280×900 下，`#today`、`#learn`、句子引导页、测验页横向溢出均为 **0px**；答案选项 318×58、播放听力 64 高、任务按钮 42–43 高（`ui-probe*.mjs`）。
- 断点续学在移动尺寸同样可用（e2e mobile 项目覆盖全部用例，我未单独跑 mobile 项目）。
- 弱点：F13（34–42px 触控目标）、F15（按钮仅中文文字、无语音引导）。
- **未验证**：真实手机浏览器（iOS Safari 语音手势限制、Android WebView 无语音包）、触屏误触率、家长实际陪学流程。

---

## 4. 未验证 / 工具与约束限制

1. 真实设备 TTS 发音听感、音色一致性、录音回放质量——**无法用自动化证明**，本报告不做任何声称。
2. 教师/家长逐词语义审阅——本报告的语义结论来自代理阅读（两个子代理 + 我），**不是教师审阅**。
3. 未运行 `npm run test:functional` / `test:acceptance` / `test:pages` / `test:full-content`（会覆盖 `dist` / `dist-pages` / `test-results`，且全词库图片门禁 74/1687 与本次范围无关）。
4. 未运行 mobile Playwright 项目、未在真机验证；未验证生产构建产物（`dist` 未触碰）。
5. 未跑家长区完整课程路径（219 词汇课 / 24 语法 / 12 检查 / 生产任务），只按需触碰了 `skill-4/9` 的数据链路。
6. 并发风险：另一位代理正在改 `curriculum.js`（课程 ID 兼容）与词库元数据，浏览器探针与之共享同一个 dev server 和 localStorage 语义；本报告所有 hash 与时间点已标注，最终复核应在冻结修订上重跑 §1 的探针。
7. 我的探针脚本在 `/private/tmp/ket-verify/`，属于本机临时文件，可能被清理；关键复现步骤已内联在 §2。

---

## 5. 建议的处理顺序（供主任务实施）

1. **F1**：在 `buildDailyPlan`/`reviewQuestions` 层面拦截 `input`/`spelling` 题（改 2 行即可），并加“儿童路径永不出打字题”的 e2e。
2. **F2**：`listen()` 增加超时/失败兜底与“跳过此题”出路；补一条“`speak` 永不回调”的 e2e。
3. **F3 + F4**：把提示状态并入会话快照；错题列表去掉中文释义或把该路径标记为 `hinted`。
4. **F5**：调整每日上限/新词排期策略，或在“今天”页给出清积压入口与趋势显示。
5. **F6**：构建期打乱故事选项位置，并加数据测试。
6. **F7/F8**：明确答错语义（重置 vs 降档），提供一次撤销；跨午夜加最短间隔。
7. 其余低风险项（F9–F15）按维护窗口处理；F12 建议直接删除或加“禁止引用”守卫。
