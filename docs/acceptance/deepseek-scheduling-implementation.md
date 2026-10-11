# F5 每日复习积压整改实施说明（DeepSeek / 2026-10-11）

- 基线：`433ab40`（主任务已修复 F1–F4：儿童不打字、语音失败跳过、提示跨刷新保留、错题本不再先给答案）。本文件是 F5（每日复习积压只增不减）的范围受限实现说明。
- 允许并实际修改的文件（仅这些）：`src/utils/dailyPlan.js`、`src/utils/learningProgress.js`、`src/components/DailyLearning.jsx`、`tests/unit/spaced-review.test.js`；新增 `tests/unit/daily-load.test.js`、`docs/acceptance/deepseek-scheduling-implementation.md`。
- 未修改：`src/App.jsx`、`src/data/*`、其它测试/文档/图片；未提交、未推送、未启停服务、未清理文件；只跑了限定单测（`tests/unit` + `tests/data`），未跑 `dist`/`test-results`/`dist-pages` 相关全量命令。
- 参数说明：以下所有阈值（每批 10 题、每日 30 题、8/4/2 新词、满负荷边界 25、维护间隔 120/180/365 天）都是**教学初值，不是科学定律**，可按实际反馈调整。
- 主任务复核注：下文模拟由代理交付，主任务已重跑对应测试；它们采用每天全部答对的假设，不证明真实儿童效果或任意初始积压一定收敛。原稿中的单调下降、清零时间和长期可持续推论已校正。后续主任务额外修正了旧记录完成状态判断，见独立复核文档。

---

## 1. 改了什么（按文件）

### 1.1 `src/utils/learningProgress.js`

| 位置 | 改动 | 原因 |
|---|---|---|
| `:67-68` | `reviewGaps = [1,2,4,7,16,30,60,120,180,365]`，新增 `maxReviewStep = reviewGaps.length`（=10） | 已掌握后按 120/180/365 天维护；前 7 档不变 |
| `:48` | `item.step <= maxReviewStep`（原 `<= 7`） | 兼容旧 7 档记录，同时接受新维护档 |
| `:88` | `Math.min((old?.step || 0) + 1, maxReviewStep)` | step 可推进到 10，之后封顶 |
| `:22-30` | `validDay` 增加按日期字符串缓存 | 每次答题都会重算整份 memory 的日期合法性；缓存后 3374 条记录的计划构建实测中位 7.8ms（见 §3.5） |

兼容性：旧记录 `step ≤ 7` 原样通过校验；步进 7 → 8 时下一次到期由 +60 变为 +120，即“已掌握 60 天后进入 120/180/365 维护”。

### 1.2 `src/utils/dailyPlan.js`（核心）

| 位置 | 内容 |
|---|---|
| `:8-15` | 参数：`REVIEW_BATCH_SIZE=10`、`REVIEW_DAILY_LIMIT=30`、`FORECAST_DAYS=7`、`CATCHUP_RATIO=2`、`NEW_WORD_FULL_LIMIT=25`、`NEW_WORD_TARGETS={full:8,reduced:4,minimum:2}` |
| `:28-39` | `forecastFrom`：单次遍历 memory，把每个“可进入儿童复习”的排期落到未来 7 天的第一个到期日；**过滤掉家长打字题**（`childReviewAllowed`） |
| `:47-59` | `familiarLessons`：只有“该课已完成且每道题都有记录”的课时才算熟悉，重复读不会新建排期 |
| `:61-71` | `newWordCandidates`：主题词优先，不足 `minimum` 时从词库补齐，保证“不长期零新词” |
| `:119-126` | 新词档位：`pressure < 25 → 8`；`25 ≤ pressure ≤ 60 → 4`；`pressure > 60 → 2`；周末 0（沿用原有设计） |
| `:127-131` | 负荷高（`pressure > 60`）时优先换成熟悉课；只熟悉一项时另一项显式留空（`""`）。尚无任何熟悉课时仍提供主题课，并如实计算新题数。该规则同样作用于周六/周日 |
| `:133` | `newQuestions` 永远按“实际提供的课”里还没记录的题数计算（周末不再报 0，但周六/周日仍可读到新题时如实计数） |
| `:158-166` | `planReadingLessons(plan, theme, lessonById)`：把“今天提供哪两节阅读课”集中到一个可测函数。`undefined`（本功能之前保存的旧计划）→ 回退到主题自带的句子/故事；`""` 才表示“今天不提供新阅读题”；找不到的 id 也回退到主题默认 |
| `:99-145` | 计划字段新增：`reviewLimit`、`batchSize`、`pressure`、`forecast`（7 个数）、`sentencesLessonId`、`storyLessonId`、`newQuestions`、`familiar`；`review` 上限由 20 提升到 30 |
| `:180-202` | `reviewBatch`：把当日列表切成**固定批次**（10 题一批），返回 `answered/remaining/total/batchIndex/batches/batch/unanswered/done`；`batch` 的成员与顺序在当前批次未答完前不变，只有整批答完才切到下一批 |
| `:204-218` | `reviewQuestions` 保持原有行为（打字题过滤、选项按批内序号轮转） |

关键设计（针对主任务指出的回归）：

- **批次稳定**：`reviewBatch` 不再“按 pending 动态裁剪”。因此同一批次的题 ID、选项顺序、答案位置都稳定 → `App.jsx` 的会话指纹（含 `options/answer`）不变 → 断点重进恢复原快照（含 `heard` 提示状态）→ 不会把“听后理解”记成独立阅读。
- **已答不重复**：主任务复核后，`answered` 要求该技能当天已作答、不是仅接触记录，且已排到未来日期；单凭 `lastDay` 不再判为完成。批次内断点仍靠快照 index 恢复。
- **每日上限**：当日列表 ≤30，批次 ≤10，因此“每日通常最多 30 题、每批最多 10 题”由数据结构保证。

### 1.3 `src/components/DailyLearning.jsx`

- `:7-16`：复习卡片文案显示“X 项到期复习 · 本批还剩 N 题 · 共 M 批，答完一批再换下一批 · 另有 K 项保留在队列中”，答完当前批后按钮变“继续复习”，当天额度用完显示“今天已完成 N 项复习，剩下的明天再来”。
- `:33-37`：用 `planReadingLessons` 解析今天的句子/故事课（旧计划 `undefined` → 主题默认，`""` → 今天不提供），并用 `reviewBatch` 决定当前批与批次号；`catchingUp` 同时识别 `plan.familiar`（周末也可能熟悉阅读）与旧计划（旧计划不带新字段，不冒充“熟悉课”）。
- `:44`：复习活动 id/标题按批次固定（`daily-review-<day>-b<index>` / “复习老朋友 · 第 N 批”），保证同一批会话键稳定。
- `:46-47`：某项不熟悉时该卡片显示“积压偏高，今天先不加新的…题”，且**不给按钮**，不再出现“说不新增却有新题”。
- `:50`：脚注如实显示“今天最多新增 N 道阅读题”。

---

## 2. 需求对照

| 要求 | 实现 | 证据 |
|---|---|---|
| 无积压 8 新词 + 6 句 + 短文 | `pressure < 25` → 8 词，句子/短文为主题新课 | 单测 `keeps a normal day at eight words, six sentences and the short story`；浏览器 A 例 |
| 不能长期零新词 | 档位最低 2 词，且主题词不足时从词库补齐 | 单测 `tops new words up to the daily minimum…`、`never stops new words while a theme's own stories are still waiting`；240 天模拟 `daysWithFewerThanTwoNewWords: 0` |
| 复习每批最多 10 题 | `REVIEW_BATCH_SIZE=10` + 固定切片 | 单测 `moves reviews in fixed batches…`、`caps reviews at thirty a day…` |
| 每日通常最多 30 题 | 当日列表 `slice(0, 30)` | 全部模拟 `reviewCount ≤ 30`；浏览器 B 例显示“共 3 批” |
| 今日页能继续后续批次且断点恢复 | 固定批次 + 快照复用 | 浏览器 B 例：答 3 题 → 返回显示“已完成 3 / 30 · 本批还剩 7 题” → 继续复习 → 头部 `4 / 10`，会话指纹 `sameFingerprint: true` |
| 已答批次不重复要求 | `answered` 由当日 `lastDay` 推导，只在整批答完后换批 | 单测 `keeps a batch's members, order and id stable…`、`keeps each daily batch fixed…` |
| 未来至少 7 天已知负荷降量 | `forecast`（7 天）+ `pressure` 控制 8/4/2 档 | 单测 `forecasts the next seven days…`；模拟 §3 |
| 积压高时熟悉故事听读、不新增 9 题 | `pressure > 60` → 熟悉课，`newQuestions = 0` | 单测 `switches a heavy queue to familiar stories…`、`does not add nine new questions on a heavy weekend either`；浏览器 C 例“今天最多新增 0 道阅读题” |
| 不硬锁课程 | 高负荷仍给最低 2 个新词、主题线继续（词库兜底） | 240 天模拟 `seen` 持续增长（300 词库例 302→654） |
| 家长 typing 负荷不影响降量 | 预测与当日列表都过滤 `input/spelling` | 单测 `keeps parent typing practice out of the child load forecast…` |
| 周末不能漏算新题 | `newQuestions` 按实际提供的课计算 | 单测 `counts the reading questions a weekend still offers…`（周六/周日都如实报 9）；模拟中每天都校验 `createdQuestions === plan.newQuestions` |
| 已掌握 60 天后 120/180/365 维护，兼容旧 7 档 | `reviewGaps` 扩展 + `maxReviewStep` | 单测 `keeps the original seven intervals and adds 120/180/365-day maintenance for old records` |
| 保留听读独立排期 / 三次不同到期日掌握 / 同日·提前·提示不推进 / 不打字 | 未改这些语义（F1–F4 修复保持） | `tests/unit/spaced-review.test.js` 24 项全部通过 |
| 旧当日计划（无 `sentencesLessonId/storyLessonId`）不丢阅读入口 | `planReadingLessons`：`undefined` → 主题默认；只有 `""` 才是“今天不提供” | 单测 `keeps reading entries for a stored plan written before the lesson fields existed`；浏览器 `ui-probe7.mjs`（见 §3.7） |

---

## 3. 可复现验证与结果

只跑限定单测（不写 `dist`/`test-results`）：

```sh
npx vitest run tests/unit tests/data            # 8 files / 83 tests passed
npx vitest run tests/unit/daily-load.test.js    # 模拟与性能
node /private/tmp/ket-verify/ui-probe5.mjs      # 浏览器：批次稳定/断点/重负荷周末（复用已在跑的 5173）
node /private/tmp/ket-verify/ui-probe6.mjs      # 浏览器：满维护队列性能
node /private/tmp/ket-verify/ui-probe7.mjs      # 浏览器：旧当日计划兼容
```

### 3.1 240 天模拟 · 300 词库（初始 280 项人工积压）

```
[240d/300-word] {"first":{"day":0,"mode":"learn","newWords":2,"reviewCount":30,"backlog":280,"pressure":320,
  "newQuestions":9,"plannedNewQuestions":9,"mastered":30,"seen":302},
  "last":{"day":239,"mode":"catchup","newWords":2,"reviewCount":30,"backlog":28,"pressure":80,
  "newQuestions":0,"plannedNewQuestions":0,"mastered":646,"seen":654},
  "seriesEvery30Days":[280,215,113,77,50,90,11,9,28],"peakBacklog":280,"finalBacklog":28,
  "meanLast30Backlog":27,"catchupDays":164,"daysWithFewerThanTwoNewWords":0,
  "seen":654,"mastered":646,"memoryKeys":726}
```

结论：本次模拟积压从 280 降到 28，但采样序列有多次反弹，并非单调下降；新词在模拟的学习日均 ≥2；掌握词从 30 增到 646；每天复习 ≤30。

### 3.2 240 天模拟 · 从零开始的全 1687 词库

```
[240d/full bank] {"first":{"day":0,"newWords":8,"reviewCount":0,"backlog":0,"pressure":0,"newQuestions":9},
  "mid":{"day":119,"mode":"catchup","newWords":2,"reviewCount":30,"backlog":10,"pressure":65,"newQuestions":0},
  "last":{"day":239,"mode":"catchup","newWords":2,"reviewCount":26,"backlog":0,"pressure":63,"newQuestions":0},
  "peakBacklog":66,"finalBacklog":0,"catchupDays":103,"learnDays":69,"weekendDays":68,
  "minNewWordsOnLearningDays":2,"seen":458,"mastered":452}
```

结论：本次模拟峰值积压 66，期末为 0；学习日最少 2 个新词。240 天仅接触 458 词，不代表在该时间内教完或掌握全部 1687 词。

### 3.3 20 / 30 / 100 项积压

```
[backlog 20/30/100] {"20":{"review":20,"backlog":0,"digestDay":0,"peak":20,"final":18,"seen":108,
   "series":"0,15,10,10,12,16,0,0,7,12,9,14,18,0,0,12,6,8,20,18"},
 "30":{"review":30,"backlog":0,"digestDay":0,"peak":38,"final":38,"seen":106,
   "series":"0,17,0,17,20,10,0,0,12,16,10,3,2,1,0,1,11,30,31,38"},
 "100":{"review":30,"backlog":70,"digestDay":28,"peak":91,"final":72,"seen":138,
   "series":"70,83,78,91,72,62,62,69,64,57,36,25,28,32,48,40,20,11,8,18,39,41,36,46,50,30,28,10,0,0,5,20,9,17,14,10,5,18,26,61,62,79,80,85,72"}}
```

结论：20/30 项的首日全部纳入额度，但后续仍有新的到期负荷；100 项场景第 28 天首次清零，之后反弹，45 天期末仍为 72。该清零时间只适用于本模拟的初始分布与持续学习假设，不是固定教学保证。

### 3.4 漏学一周后恢复

```
[missed week] {"backlogsDuring":[25,43,55,66,89,108,125],
  "firstDaysAfter":[{"mode":"light","newWords":0,"backlog":133},{"mode":"catchup","newWords":2,"backlog":98},
    {"mode":"catchup","newWords":2,"backlog":88},{"mode":"catchup","newWords":2,"backlog":86},
    {"mode":"catchup","newWords":2,"backlog":82}],
  "masteredBefore":146,"masteredAfter":184,"finalBacklog":13}
```

结论：漏学期间只累积到期项（不清零已掌握：146 → 184 反而增长）；恢复后自动进入“熟悉故事 + 2 新词”，积压回落到 13。

### 3.5 首页性能（1687 词 × 2 技能 = 3374 条排期）

```
[performance] {"perBuildMs":8.16,"perForecastMs":1.9,"forecast":[1800,56,56,56,57,56,57],"review":30,"pressure":1800}
```

（多次运行 `perBuildMs` 在 7.8–8.4ms、`perForecastMs` 在 1.5–2.5ms 之间波动。）

浏览器实测（`ui-probe6.mjs`，真实 localStorage + 真实模块）：

```
seed memory keys: 1687 words / 3374 records
first paint to today cards (ms): 422
in-page buildDailyPlan: {"medianMs":7.8,"maxMs":10.1,"review":30,"newWords":0,"mode":"light","pressure":1744}
```

结论：满维护队列下计划构建中位 7.8ms（App 每渲染还会再 normalize 一次，量级相同），今日页首个可交互约 0.4s（dev server，含冷启动），不构成卡顿。

### 3.6 浏览器端批次稳定与断点恢复（`ui-probe5.mjs`）

A. 25 项到期（与既有 e2e 相同的前置）：

```
A today cards: "复习老朋友 | 25 项到期复习 · 本批还剩 10 题 · 共 3 批，答完一批再换下一批 | 开始复习 |
 认识新朋友 | 4 个新词 · 听音与认读，不用拼写 | 开始学习 | …"
```

B. 45 项到期，答 3 题后返回再进入：

```
B review card: "… 30 项到期复习 · 本批还剩 10 题 · 共 3 批 … 另有 15 项保留在队列中"
B batch size in practice header: "1 / 10"
B snapshot after 3 answers: {"key":"sparks_activity_daily-review-2026-10-12-b0","stage":"quiz","index":3,
  "responses":3,"questionIds":["scheduled-l1_a_an-listening", … 10 个]}
B after return, review card: "… 已完成 3 / 30 项 · 本批还剩 7 题 …"
B resumed header: "4 / 10"
B resumed snapshot: {"key":"sparks_activity_daily-review-2026-10-12-b0","index":3,"responses":3,
  "sameFingerprint":true,"questionIds":[… 同一批 10 个]}
```

结论：批次成员、顺序、会话键、指纹全部不变（`sameFingerprint: true`），重进从第 4 题继续，已答 3 题不再要求，提示状态随同一快照保留。

C. 重负荷周六（140 项到期）：

```
C heavy Saturday page: "… 综合故事日 | 复习老朋友 | 30 项到期复习 · 本批还剩 10 题 · 共 3 批 … 另有 119 项保留在队列中 |
 认识新朋友 | 今天不安排强制新词 | 熟悉句子听读 | 6 个学过的句子 · 只复习，不加新题 … |
 熟悉故事听读 | 读过的故事 · 不再新增理解题 · 3 道理解题 … | 今天最多新增 0 道阅读题 …"
C overflow: 0
```

### 3.7 240 天模拟 · 1687 词全部已学的维护负荷（本项按验收要求新增）

前置：1687 词全部写入 memory（读/听两条，step 2–7 混合，到期日分布在 −30…+29 天，即约一半已经到期），48 项儿童活动标记已完成，但阅读题记忆尚未写入；之后不引入新词，仍出现 10 条首次阅读题记录。

```
[240d/fully learned 1687] {"peakBacklog":2813,"firstBacklog":1714,"tailMaxBacklog":2143,
  "tailMeanBacklog":2044,"finalBacklog":1936,
  "minDailyReviews":30,"maxDailyReviews":30,"meanDailyReviews":30,
  "seriesEvery30Days":[1714,2793,2494,2390,2290,2237,2154,2142,1936],
  "dailyDemand":30.93,"tailDailyDemand":23.13,"tailSlope":-206,
  "catchupDays":171,"newQuestionRecords":10,"memoryKeys":1697,
  "seenWords":1687,"masteredWords":1687}
```

读法（报告要求公布峰值/尾部负荷）：

- **峰值**：第 30 天附近 2813 项（初始 1714 项已到期，前 30 天把大量 step 2–4 的记录推回短间隔，所以先冲到峰值）。
- **尾部**：最后 30 天均值 2044、最大 2143、期末 1936；**尾部斜率 −206 / 30 天（约 −6.9 项/天）**，即队列在持续消化而不是增长。
- **尾部日均需求 23.13 题 < 30 题上限**：只描述最后 30 天的观测窗口。期末仍有 1936 项积压，240 天测试没有验证其最终清零，也不能据此证明每日 30 题长期足以维护整库；更长时间的波峰、错误与漏学会改变结果。
- **每天都是 30/30**（min=max=30）：在存量消化期间孩子每天满额复习，`newWords=0`（没有新词可教）。
- `memoryKeys 1697` = 1687 词 + 10 道首次读到的儿童阅读题（这些题此前没有记录，读一次后不再新增）；`masteredWords=1687` 全部保持掌握。

### 3.8 旧当日计划兼容（主任务验收点，浏览器实测）

`ui-probe7.mjs`：写入一份**旧格式**当日计划（没有 `sentencesLessonId/storyLessonId`，也没有 F5 新增字段），固定当天为 2026-10-12 后打开今日页：

```
legacy plan cards: "复习老朋友 | 今天还没有到期的复习 | 开始复习 | 认识新朋友 | 8 个新词 · 听音与认读，不用拼写 |
 开始学习 | 听懂句子 | 6 个句子 · 先听，再理解 | 听读句子 | 阅读小故事 | 1 篇生活故事 · 3 道理解题 | 打开故事"
buttons: ["开始复习","开始学习","听读句子","打开故事"]
stored plan kept as-is (no lesson fields added): {"day":"2026-10-12","themeId":"breakfast","readingStage":1,
 "vocabularyLessonId":"child-breakfast-words","newWords":[8 个], "review":[],"backlog":0,"mode":"learn"}
sentences opened: 一起吃早餐 · 听读句子
story opened: "Ben sits at the table with his mum. He h"
```

结论：旧计划仍被原样沿用（不会被强制重建），句子与故事入口都在、都能打开；只有显式 `""` 才会显示“今天不加新题”。

---

## 4. 假设

1. 儿童每天会完成今日页给出的复习批次；模拟按“全部答对”推进（错误路径由 F7 语义单独覆盖）。
2. 到期积压的口径是 `due 项数 − 30`（当天额度之外的部分）。
3. `forecast` 只统计**已经写进 memory 的排期**；未来的作答会把条目重新排到更远的日期，因此预测是“已知排期的下限”。
4. 周末仍沿用“周六综合故事、周日轻量复习、不强制新词”的既有设计；周末若确实读了新题，`newQuestions` 会如实计数。
5. “熟悉课”定义为该课已完成且每道题都有记录（因此重复读不新增排期）。
6. 满负荷边界 25 是教学余量（给每日 30 题留 5 个空位）；它同时让既有 e2e「25 项到期 → 4 个新词」继续成立。

## 5. 限制与未验证（必须如实说明）

1. **预测只含已知排期**：`forecast` 无法预知“今天做完后会产生多少新到期”（儿童是否答题、答对答错都会改变未来排期），也无法预知新的课程题；因此它偏保守/滞后，是控制信号而不是精确排班表。
2. **100 项全 `step 0` 的积压**：本次模拟约四周首次清零，之后仍反弹；其他分布与错误率没有相同时间保证。
3. **模拟波动不是普遍均衡带**：部分场景出现 0～90 项波动，初始 300 词和整库维护场景的峰值远高于 90；不能把局部数字推广为全平台积压上界。
4. **全 1687 词已学后的维护负荷**（§3.7）：峰值 2813、期末 1936，所有模拟日复习量均为 30。尾部下降是特定窗口的观察，不是长期可持续或清零期限证明；满额复习是否适合真实六岁儿童仍未验证。
5. **未运行**：完整 e2e（含 mobile 项目）、`test:functional/acceptance/pages/full-content`、生产构建；未在真机/真语音上验证；未验证 Progress 页（`App.jsx`，不在允许范围）与今日页额度是否衔接——Progress 页仍按每次 20 条取当前队列，属既有行为。
6. **未改动**：`App.jsx` 的会话指纹与“跳过听力”逻辑、词库/题库内容、图片与既有文档。
7. 并发：主任务同时在改 `src/App.jsx`、`src/data/child-course.js`、`src/data/child-reading.js`、`src/data/curated-topics.js`（含 body 照片扩到 82 张、阅读改题内容指纹、故事答案位置、39 个主教学主题、儿童题唯一 ID）与部分测试；本说明的数字取自当前工作区（未提交）状态，复核时请在同一修订上重跑 §3 命令。

## 6. 复核建议

1. 先跑 `npx vitest run tests/unit tests/data`（预期 8 文件 / 83 通过）。
2. 再跑 `npx playwright test tests/e2e/child-learning.spec.js --project=chromium --output=/private/tmp/...`（复用已有服务），重点看 `a reduced four-word day…`（本次已用浏览器 A 例确认仍是“4 个新词”）、`due reviews preserve listening versus reading…`、以及主任务新增的提示/指纹/答案位置回归用例。
3. 如需调整节奏，只改 `NEW_WORD_FULL_LIMIT`、`NEW_WORD_TARGETS`、`REVIEW_DAILY_LIMIT`、`CATCHUP_RATIO`、`reviewGaps` 即可，语义与测试会同步暴露影响；若要把全词库维护存量更快清掉，需要单独决定是否放宽“每日通常 30 题”。
