export const AVAILABLE_STICKERS = [
  {
    id: "first_step",
    name: "启航小能手",
    icon: "🚀",
    desc: "认识并听读了第 1 个英文单词",
    color: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%)",
    check: (p) => (p?.seen?.length || 0) >= 1,
  },
  {
    id: "phonics_explorer",
    name: "拼读小魔法师",
    icon: "🧱",
    desc: "用自然拼读认识满 8 个单词",
    color: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
    check: (p) => (p?.seen?.length || 0) >= 8,
  },
  {
    id: "sentence_listener",
    name: "句子小耳朵",
    icon: "🎧",
    desc: "完成第 1 节听读句子练习",
    color: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    check: (p) => (p?.completed || []).some((id) => id.includes("sentences")),
  },
  {
    id: "story_reader",
    name: "故事小书虫",
    icon: "📖",
    desc: "读完第 1 篇英文生活小故事",
    color: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
    check: (p) => (p?.completed || []).some((id) => id.includes("story")),
  },
  {
    id: "breakfast_buddy",
    name: "营养早餐家",
    icon: "🍎",
    desc: "完成早餐主题听读或启蒙课",
    color: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
    check: (p) =>
      (p?.completed || []).some((id) => id.startsWith("child-breakfast") || id === "food"),
  },
  {
    id: "animal_friend",
    name: "动物好朋友",
    icon: "🐰",
    desc: "完成动物主题听读或启蒙课",
    color: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
    check: (p) =>
      (p?.completed || []).some((id) => id.startsWith("child-animals") || id === "animals"),
  },
  {
    id: "day_streak_3",
    name: "三天小达人",
    icon: "🌟",
    desc: "累计 3 天坚持听读英语",
    color: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    check: (p) => Object.keys(p?.days || {}).length >= 3,
  },
  {
    id: "day_streak_7",
    name: "一周小冠军",
    icon: "🏆",
    desc: "累计 7 天坚持听读英语",
    color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    check: (p) => Object.keys(p?.days || {}).length >= 7,
  },
  {
    id: "words_25",
    name: "单词二十五星",
    icon: "🌱",
    desc: "累计认识 25 个英文单词",
    color: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
    check: (p) => (p?.seen?.length || 0) >= 25,
  },
  {
    id: "words_50",
    name: "单词五十星",
    icon: "🌿",
    desc: "累计认识 50 个英文单词",
    color: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
    check: (p) => (p?.seen?.length || 0) >= 50,
  },
  {
    id: "words_95",
    name: "主题大满贯",
    icon: "🎈",
    desc: "认识全部 95 个儿童主题核心词",
    color: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    check: (p) => (p?.seen?.length || 0) >= 95,
  },
  {
    id: "long_story_star",
    name: "进阶阅读家",
    icon: "🦉",
    desc: "完成第 1 篇百词进阶故事阅读",
    color: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    check: (p) => (p?.completed || []).some((id) => id.includes("long-story")),
  },
  {
    id: "master_first",
    name: "记忆小金冠",
    icon: "👑",
    desc: "跨日独立复习掌握第 1 个单词",
    color: "linear-gradient(135deg, #facc15 0%, #ca8a04 100%)",
    check: (p) => (p?.mastered?.length || 0) >= 1,
  },
  {
    id: "master_10",
    name: "闪耀记忆星",
    icon: "✨",
    desc: "跨日独立复习掌握 10 个单词",
    color: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
    check: (p) => (p?.mastered?.length || 0) >= 10,
  },
  {
    id: "words_200",
    name: "KET 小探险家",
    icon: "🎓",
    desc: "累计认识 200 个 KET 词汇",
    color: "linear-gradient(135deg, #c084fc 0%, #9333ea 100%)",
    check: (p) => (p?.seen?.length || 0) >= 200,
  },
];

export const STICKER_COUNT = AVAILABLE_STICKERS.length;

export function computeUnlockedStickers(progress) {
  return AVAILABLE_STICKERS.filter((sticker) => sticker.check(progress)).map(
    (sticker) => sticker.id,
  );
}
