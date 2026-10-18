import { countEnglishWords } from "../utils/learningProgress.js";

/**
 * Progressive Guided Writing Scaffolds & Real-Time Coach
 * Supports learners from sentence building -> 25-word KET Email -> 35-word KET Story -> 50-word B1 Opinion Paragraph
 */

export const WRITING_SCAFFOLDS = {
  email: {
    label: "25 词日常邮件脚手架 (KET Part 6 Email)",
    structureTip: "邮件四步法：① 称呼与问候 → ② 回应第 1、2 个要点 → ③ 回应第 3 个要点或提问 → ④ 礼貌结尾署名。",
    groups: [
      {
        category: "① 开头问候 (Greetings)",
        items: [
          { en: "Hi Alex,", zh: "嗨，Alex，" },
          { en: "Thanks for your email!", zh: "谢谢你的来信！" },
          { en: "I would love to come with you.", zh: "我很乐意和你一起去。" },
        ],
      },
      {
        category: "② 时间、地点与安排 (Plans & Details)",
        items: [
          { en: "Let's meet at the park gate at ten o'clock on Saturday.", zh: "我们周六十点在公园门口见吧。" },
          { en: "I will bring some delicious sandwiches and fresh apples.", zh: "我会带一些美味的三明治和新鲜苹果。" },
          { en: "We can go there by bus because it is fast and safe.", zh: "我们可以坐公交车去，因为既快又安全。" },
        ],
      },
      {
        category: "③ 原因与连接词 (Connectors)",
        items: [
          { en: "because", zh: "因为（说明理由）" },
          { en: "so", zh: "所以（引出结果）" },
          { en: "also", zh: "而且；还" },
          { en: "instead", zh: "作为替代；改去" },
        ],
      },
      {
        category: "④ 结尾互动与署名 (Closings)",
        items: [
          { en: "Could you bring some water or juice?", zh: "你能带些水或果汁吗？" },
          { en: "See you soon!", zh: "回头见！" },
          { en: "Best wishes, Mia", zh: "祝好，Mia" },
        ],
      },
    ],
  },
  story: {
    label: "35 词三步看图故事脚手架 (KET Part 7 Story)",
    structureTip: "故事三幕剧：① 起因（时间+人物+地点，使用过去时）→ ② 经过（遇到了什么小插曲+如何解决）→ ③ 结尾（结果与心情）。",
    groups: [
      {
        category: "① 故事开篇：时间与背景 (Beginning)",
        items: [
          { en: "Last Saturday morning, Tom went to the park with his family.", zh: "上周六早上，Tom 和家人去了公园。" },
          { en: "It was a bright and sunny afternoon.", zh: "那是一个阳光明媚的下午。" },
          { en: "Yesterday after school, Lucy walked home with her best friend.", zh: "昨天放学后，Lucy 和好朋友一起走路回家。" },
        ],
      },
      {
        category: "② 情节推进与转折 (Middle & Action)",
        items: [
          { en: "Suddenly, dark clouds appeared and it started to rain.", zh: "突然，乌云出现并开始下雨。" },
          { en: "Then, they looked everywhere under the trees and benches.", zh: "接着，他们在树下和长椅下到处寻找。" },
          { en: "Luckily, a kind teacher helped them solve the problem.", zh: "幸运的是，一位好心的老师帮他们解决了问题。" },
        ],
      },
      {
        category: "③ 叙事时间连接词 (Time Connectors)",
        items: [
          { en: "First,", zh: "首先，" },
          { en: "Then,", zh: "接着，" },
          { en: "After that,", zh: "在那之后，" },
          { en: "Finally,", zh: "最后，" },
        ],
      },
      {
        category: "④ 故事结局与感受 (Ending & Feelings)",
        items: [
          { en: "Finally, they found the lost bag and smiled happily.", zh: "最后，他们找到了丢失的包，开心地笑了。" },
          { en: "Although their plan changed, everyone had a wonderful day.", zh: "虽然计划改变了，但大家度过了美好的一天。" },
        ],
      },
    ],
  },
  opinion: {
    label: "50 词长文观点与读书分享脚手架 (B1 段落写作)",
    structureTip: "汉堡包段落法：① 主题句（Topic Sentence 亮明观点）→ ② 两个支撑理由与例子（First... / For example...）→ ③ 总结句（In short...）。",
    groups: [
      {
        category: "① 主题句亮明观点 (Topic Sentence)",
        items: [
          { en: "In my opinion, reading English stories every day is a great habit.", zh: "在我看来，每天读英文故事是一个好习惯。" },
          { en: "My favourite book is about how honeybees help our planet.", zh: "我最喜欢的书是关于蜜蜂如何帮助地球的。" },
        ],
      },
      {
        category: "② 理由与举例展开 (Supporting Details)",
        items: [
          { en: "First, it helps me learn new words naturally in context.", zh: "首先，它帮我在语境中自然学会新词。" },
          { en: "For example, I learned how seeds grow into tall flowers in spring.", zh: "例如，我学到了种子在春天如何长成高大的花朵。" },
          { en: "Moreover, we can share interesting ideas with our friends at school.", zh: "此外，我们可以在学校和朋友分享有趣的想法。" },
        ],
      },
      {
        category: "③ 逻辑递进与转折 (Advanced Connectors)",
        items: [
          { en: "However,", zh: "然而，" },
          { en: "For example,", zh: "例如，" },
          { en: "In addition,", zh: "此外，" },
          { en: "Therefore,", zh: "因此，" },
        ],
      },
      {
        category: "④ 总结收尾 (Concluding Sentence)",
        items: [
          { en: "In short, reading opens a big window to the wonderful world.", zh: "简而言之，阅读为我们打开了一扇通往奇妙世界的大窗。" },
          { en: "That is why I strongly recommend this activity to everyone.", zh: "这就是为什么我向大家强烈推荐这项活动。" },
        ],
      },
    ],
  },
};

export const GUIDED_WRITING_TASKS = [
  {
    id: "guided-email-picnic",
    kind: "email",
    stageLabel: "A2 · KET 邮件写作（Part 6）",
    title: "回复朋友的周末野餐邀请",
    minWords: 25,
    prompt: "你的朋友 Alex 写信邀请你周六去公园野餐。请给 Alex 写一封英文回复邮件（至少 25 词）：",
    points: [
      "感谢他的邀请并表示很乐意参加",
      "说明周六几点在哪里集合",
      "告诉他你会带什么食物或饮料",
    ],
    example:
      "Hi Alex, Thanks for your email! I would love to come to the picnic on Saturday. Let's meet at the park gate at ten o'clock. I will bring some sandwiches and fresh apple juice. See you soon!",
  },
  {
    id: "guided-story-rainy-adventure",
    kind: "story",
    stageLabel: "A2 · KET 看图叙事故事（Part 7）",
    title: "三步故事：公园里的雨天奇遇",
    minWords: 35,
    prompt: "根据以下三个情节线索，按时间顺序写一篇英文小故事（至少 35 词，注意使用过去时）：",
    points: [
      "起因：上周六早上，Tom 和妹妹去公园放风筝",
      "经过：突然下起大雨，他们跑进小亭子并遇到一只躲雨的小狗",
      "结尾：雨停后彩虹出现，小狗的主人赶来感谢他们",
    ],
    example:
      "Last Saturday morning, Tom and his sister went to the park to fly a kite. Suddenly, dark clouds appeared and heavy rain started to fall. They ran into a small pavilion and found a wet little dog there. Soon the rain stopped, and the dog's owner came and thanked them happily.",
  },
  {
    id: "guided-opinion-reading",
    kind: "opinion",
    stageLabel: "A2+ → B1 · 进阶观点与读书报告",
    title: "观点短文：我最喜欢的课外活动或故事",
    minWords: 45,
    prompt: "写一段结构完整的英文短文（至少 45 词），介绍一项你最喜欢的活动或一本读过的故事书：",
    points: [
      "主题句：开门见山说明你最喜欢的活动或故事是什么",
      "支撑细节：用 First / Because / For example 给出两个具体理由或例子",
      "总结句：表达你的收获或向朋友发出推荐",
    ],
    example:
      "In my opinion, reading English nature stories is my favourite activity after school. First, it helps me learn many useful words without rote memorization. For example, I learned how honeybees dance to tell their friends where flowers are. In short, reading makes me curious and happy every day.",
  },
];

const CONNECTOR_PATTERNS = [
  "because",
  "but",
  "so",
  "and",
  "when",
  "after",
  "before",
  "first",
  "then",
  "finally",
  "however",
  "although",
  "instead",
  "for example",
  "moreover",
];

export function analyzeWritingDraft(rawText = "", minWords = 25) {
  const text = String(rawText || "").trim();
  const wordCount = countEnglishWords(text);
  const sentences = text
    ? text
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const lower = text.toLowerCase();
  const usedConnectors = CONNECTOR_PATTERNS.filter((conn) =>
    new RegExp(`\\b${conn}\\b`, "i").test(lower),
  );
  const startsWithCapital = text.length > 0 && /^[A-Z]/.test(text);
  const endsWithPunctuation = text.length > 0 && /[.!?]["']?$/.test(text);
  const meetsWordCount = wordCount >= minWords;

  const suggestions = [];
  if (!text) {
    suggestions.push("点击上方“句型脚手架”积木块，或直接输入第一句英文开始创作吧！");
  } else {
    if (!meetsWordCount) {
      suggestions.push(`当前 ${wordCount} 词，距离目标还差 ${minWords - wordCount} 词，可以再补充一个时间、地点或原因细节。`);
    }
    if (!startsWithCapital) {
      suggestions.push("注意英文篇章或句子开头第一个字母要大写哦（如 Hi / Last / In）。");
    }
    if (!endsWithPunctuation) {
      suggestions.push("句子结尾记得加上英文句号 (.)、感叹号 (!) 或问号 (?)。");
    }
    if (usedConnectors.length === 0) {
      suggestions.push("试着加入 because、so、but、first 或 finally 等连接词，让句子之间的逻辑更顺畅！");
    }
    if (sentences.length < 3 && wordCount >= 10) {
      suggestions.push("建议分成 3 个以上完整句子，分别对应题目的三个要点。");
    }
  }

  return {
    wordCount,
    minWords,
    meetsWordCount,
    sentenceCount: sentences.length,
    startsWithCapital,
    endsWithPunctuation,
    usedConnectors,
    suggestions,
  };
}
