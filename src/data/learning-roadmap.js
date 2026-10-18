/**
 * 4-Stage Progressive English & Phonics Learning Roadmap
 * (Pre-A1 自然拼读启蒙 → A1 基础生活交际 → A2 剑桥 KET 核心读写 → B1 衔接长文阅读与篇章写作)
 */

export const LEARNING_STAGES = [
  {
    id: "stage-1-phonics",
    order: 1,
    cefr: "Pre-A1 · 启蒙破冰",
    duration: "第 1–3 个月（每日 20–25 分钟）",
    title: "阶段一：自然拼读与音素解码",
    subtitle: "Letter Sounds · CVC 拼词 · Magic E · 韵律绘本",
    goal: "建立音素意识（Phonemic Awareness）与字母音形对应，掌握短元音 CVC 连读与魔法 e 规律，实现“见词能拆音、听音能拼读”，告别死记硬背字母。",
    targetPage: "learn",
    targetSection: "phonics-workshop-section",
    actionLabel: "进入自然拼读工坊",
    milestones: [
      "掌握 26 个英文字母核心音素与 12 组高频字母组合（sh/ch/th/ee/ea/ai/oo/ar）",
      "使用 CVC 拼词轮盘自由拼读 35+ 个基础三明治核心词（如 cat, bed, pig, dog, sun）",
      "理解 Magic E（静音 e）让短元音变字母本音的规律（如 cap→cape, kit→kite）",
      "跟读并点读 6 篇自然拼读同音家族韵律短文与 95 个儿童生活主题图词",
    ],
  },
  {
    id: "stage-2-communication",
    order: 2,
    cefr: "A1 · 基础交际",
    duration: "第 4–9 个月（每日 25–30 分钟）",
    title: "阶段二：高频词积累与自然生活交流",
    subtitle: "12 大生活主题 · 情景对话模拟 · 基础句型开口说",
    goal: "围绕早餐、家庭、学校、公园、天气、购物与出行等 12 个真实生活场景，从认读单词过渡到听懂完整句子，并在真实情景对话中自然回应与礼貌表达。",
    targetPage: "learn",
    targetSection: "dialogue-simulator-section",
    actionLabel: "进入情景交际对话舱",
    milestones: [
      "完成 12 个儿童生活主题的认识新词、听读句子与生活小故事（共 48 节启蒙课）",
      "掌握 6 大真实生活场景的多轮自然对话（问候交友、礼貌点餐、公园问路、购物询价等）",
      "熟练运用 be 动词、一般现在时、There be 句型与常见礼貌请求（Could I / Would you like）",
      "能围绕熟悉话题录制 2–3 句连贯口语回答，说出喜好并给出简单理由",
    ],
  },
  {
    id: "stage-3-ket-core",
    order: 3,
    cefr: "A2 · 剑桥 KET 核心",
    duration: "第 10–18 个月（每日 30 分钟）",
    title: "阶段三：KET 考纲全面突破与引导写作",
    subtitle: "1687 核心词 · 24 节核心语法 · 邮件与故事写作脚手架",
    goal: "系统覆盖剑桥 A2 Key (KET) 12 大单元 1687 个考纲词汇与核心时态语法，读懂生活告示、信件与对话细节，并借助句型脚手架独立写出 25 词邮件与 35 词故事。",
    targetPage: "learn",
    targetSection: "guided-writing-section",
    actionLabel: "进入引导写作与系统课",
    milestones: [
      "分单元掌握 217 节单主题词汇课，跨 3 个不同学习日独立听懂、读懂核心词",
      "通关 24 节核心语法课（一般过去时、将来时、现在完成时、比较级、情态动词与从句）",
      "完成阅读 Part 1–5 与听力 Part 1–5 专项训练及 12 个单元阶段检查（正确率 ≥ 80%）",
      "运用“开头问候 + 细节展开 + 逻辑连接词 + 结尾”脚手架完成 25 词邮件与 35 词三步故事",
    ],
  },
  {
    id: "stage-4-long-reading",
    order: 4,
    cefr: "A2+ → B1 · 深度读写",
    duration: "第 19–24+ 个月（每日 30–35 分钟）",
    title: "阶段四：长文深度阅读与篇章观点表达",
    subtitle: "150–250 词跨学科长文 · 阅读策略 · 段落论述写作",
    goal: "从百词短故事进阶到 150–250 词的多段落科普、环保、文化与校园纪实长文，掌握略读主旨（Skimming）、查读细节（Scanning）与推理判断，能撰写结构完整的观点短文。",
    targetPage: "learn",
    targetSection: "long-reading-section",
    actionLabel: "进入分级长文阅读馆",
    milestones: [
      "精读 12 篇百词进阶生活故事，并完成 6 篇 150–250 词跨学科多段深度长文阅读",
      "掌握段落连接词（however, because, therefore, although, finally）在长文中的逻辑作用",
      "准确回答长文的主旨归纳题（Main Idea）、细节定位题（Detail）与逻辑推断题（Inference）",
      "使用“主题句 Topic Sentence + 理由与例子 + 总结句”结构撰写 50–60 词观点短文或读书分享",
    ],
  },
];

export const WEEKLY_SCHEDULE = [
  {
    id: "weekday-core",
    days: "周一至周五 · 每日微习惯",
    duration: "约 25–30 分钟（可分 2–3 次完成）",
    title: "拼读热身 + 间隔复习 + 主题听说 + 微表达",
    steps: [
      {
        time: "5 分钟",
        name: "自然拼读解码热身",
        detail: "在【今天】或【自然拼读工坊】点读积木、拨动 CVC 拼词轮盘，唤醒耳朵与发音记忆。",
      },
      {
        time: "8 分钟",
        name: "老朋友间隔复习",
        detail: "完成每批最多 10 题的到期听力与阅读复习，答错立即“再试一次”，守住长期记忆。",
      },
      {
        time: "10 分钟",
        name: "新词、句子与短故事听读",
        detail: "认识当日新词，先听原声再理解语境，点读短故事里带下划线的生词。",
      },
      {
        time: "5 分钟",
        name: "开口交际或造句微写作",
        detail: "在【情景交际对话舱】完成 1 组对话，或在【写作工坊】用连接词拼出 2–3 个完整句子。",
      },
    ],
  },
  {
    id: "saturday-story",
    days: "周六 · 综合阅读与写作日",
    duration: "约 25–30 分钟",
    title: "不加强制新词 · 沉浸长文阅读与故事创编",
    steps: [
      {
        time: "12 分钟",
        name: "分级长文深度阅读",
        detail: "在【分级长文阅读馆】选择一篇 150–250 词科普或成长长文，练习略读主旨与查读细节。",
      },
      {
        time: "10 分钟",
        name: "引导式邮件/故事写作",
        detail: "在【引导式写作工坊】使用句型脚手架完成一篇 25 词邮件或 35 词小故事，并逐项自查。",
      },
      {
        time: "5 分钟",
        name: "口语录音自我展示",
        detail: "围绕本周主题录下 30 秒英文分享，回听自己的声音并勾选自评。",
      },
    ],
  },
  {
    id: "sunday-light",
    days: "周日 · 轻量回顾与贴纸奖励日",
    duration: "约 15–20 分钟",
    title: "重温熟悉故事 · 收集魔法贴纸 · 保持轻松语感",
    steps: [
      {
        time: "10 分钟",
        name: "重读喜爱的熟悉故事",
        detail: "不安排新阅读题，挑选最喜欢的一篇韵律绘本或生活故事跟读模仿语音语调。",
      },
      {
        time: "5 分钟",
        name: "魔法贴纸屋创作",
        detail: "去【成长记录】查看本周解锁的新徽章，将贴纸拖进森林、太空或深海画布装扮场景。",
      },
    ],
  },
];

export function computeStageProgress(progress = {}, curriculum = null) {
  const seenCount = (progress.seen || []).length;
  const completed = new Set(progress.completed || []);
  const masteredCount = (progress.mastered || []).length;
  const selfReviewsCount = (progress.selfReviews || []).length + (progress.draft?.trim() ? 1 : 0);

  const childThemeDone = [...completed].filter((id) => id.startsWith("child-")).length;
  const phonicsDone = [...completed].filter((id) => id.startsWith("phonics-")).length;
  const dialogueDone = [...completed].filter((id) => id.startsWith("dialogue-")).length;
  const longReadingDone = [...completed].filter(
    (id) => id.includes("long-story") || id.startsWith("long-passage-"),
  ).length;
  const courseDone = [...completed].filter(
    (id) =>
      id.startsWith("vocabulary-") ||
      id.startsWith("grammar-") ||
      id.startsWith("skill-") ||
      id.startsWith("checkpoint-"),
  ).length;
  const totalCourseLessons = curriculum?.courseLessons?.length || 265;

  // Stage 1: Phonics & 95 child theme words
  const stage1Score = Math.min(
    100,
    Math.round((Math.min(seenCount, 95) / 95) * 70 + (Math.min(phonicsDone, 6) / 6) * 30),
  );

  // Stage 2: 48 child theme lessons + 6 situational dialogues
  const stage2Score = Math.min(
    100,
    Math.round((Math.min(childThemeDone, 48) / 48) * 70 + (Math.min(dialogueDone, 6) / 6) * 30),
  );

  // Stage 3: KET course lessons + mastered words + writing self-reviews
  const stage3Score = Math.min(
    100,
    Math.round(
      (Math.min(courseDone, totalCourseLessons) / totalCourseLessons) * 60 +
        (Math.min(masteredCount, 200) / 200) * 25 +
        (Math.min(selfReviewsCount, 6) / 6) * 15,
    ),
  );

  // Stage 4: 12 growing stories + 6 graded long passages + writing tasks
  const stage4Score = Math.min(
    100,
    Math.round((Math.min(longReadingDone, 18) / 18) * 75 + (Math.min(selfReviewsCount, 8) / 8) * 25),
  );

  return {
    "stage-1-phonics": {
      percent: stage1Score,
      summary: `已认识 ${Math.min(seenCount, 95)} / 95 个启蒙核心词 · 完成 ${phonicsDone} 项拼读闯关`,
    },
    "stage-2-communication": {
      percent: stage2Score,
      summary: `已完成 ${childThemeDone} / 48 节主题听读 · 完成 ${dialogueDone} / 6 个情景交际对话`,
    },
    "stage-3-ket-core": {
      percent: stage3Score,
      summary: `已通过 ${courseDone} 节 KET 课程 · 掌握 ${masteredCount} 词 · 完成 ${selfReviewsCount} 次写作自查`,
    },
    "stage-4-long-reading": {
      percent: stage4Score,
      summary: `已精读 ${longReadingDone} / 18 篇进阶与长文篇章 · 持续拓展段落读写`,
    },
  };
}
