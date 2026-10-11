import { imageReviews } from "./image-reviews.js";
import { withCorrectMeaning } from "./ket-meanings.js";
import { withVocabularyMetadata } from "./vocabulary-metadata.js";
import { additionalImages } from "./additional-images.js";

// Reviewed starter content; legacy vocabulary is not assumed to be reviewed.
const entries = [
  [
    "apple",
    "苹果",
    "/ˈæp.əl/",
    "Can I have an apple, please?",
    "请给我一个苹果，好吗？",
    "A single red apple with a green leaf.",
  ],
  [
    "banana",
    "香蕉",
    "/bəˈnɑː.nə/",
    "This banana is yellow.",
    "这根香蕉是黄色的。",
    "One ripe yellow banana.",
  ],
  [
    "bread",
    "面包",
    "/bred/",
    "I have bread for breakfast.",
    "我早餐吃面包。",
    "A loaf of bread with cut slices.",
  ],
  [
    "milk",
    "牛奶",
    "/mɪlk/",
    "There is some milk in the glass.",
    "玻璃杯里有一些牛奶。",
    "A clear glass filled with white milk.",
  ],
  [
    "cat",
    "猫",
    "/kæt/",
    "The cat is sitting.",
    "猫正坐着。",
    "A domestic tabby cat sitting.",
  ],
  [
    "dog",
    "狗",
    "/dɒɡ/",
    "This dog is my friend.",
    "这只狗是我的朋友。",
    "A golden retriever dog sitting.",
  ],
  [
    "rabbit",
    "兔子",
    "/ˈræb.ɪt/",
    "The rabbit has long ears.",
    "兔子有长耳朵。",
    "A white rabbit with long upright ears.",
  ],
  [
    "fish",
    "鱼",
    "/fɪʃ/",
    "The fish is swimming.",
    "鱼正在游泳。",
    "A live orange goldfish swimming underwater.",
  ],
  [
    "book",
    "书（名词）",
    "/bʊk/",
    "I read a book after school.",
    "我放学后读一本书。",
    "An open hardcover book with visible pages.",
  ],
  [
    "pencil",
    "铅笔",
    "/ˈpen.səl/",
    "I write with a pencil.",
    "我用铅笔写字。",
    "A sharpened yellow wooden graphite pencil.",
  ],
  [
    "bicycle",
    "自行车",
    "/ˈbaɪ.sɪ.kəl/",
    "I ride my bicycle to the park.",
    "我骑自行车去公园。",
    "A green bicycle with two wheels in side view.",
  ],
  [
    "bus",
    "公共汽车",
    "/bʌs/",
    "We go to school by bus.",
    "我们乘公共汽车上学。",
    "A red city passenger bus.",
  ],
];

const ids = [
  "l2_apple",
  "l2_banana",
  "l2_bread",
  "l2_milk",
  "l12_cat",
  "l12_dog",
  "l12_rabbit",
  "l2_fish",
  "l10_book",
  "l12_pencil",
  "l7_bicycle",
  "l5_bus",
];
export const learningWords = entries.map(
  (
    [word, translation, phonetic, sentence, sentenceTranslation, alt],
    index,
  ) => withVocabularyMetadata({
    id: ids[index],
    word,
    translation,
    phonetic,
    sentence,
    sentenceTranslation,
    speechText: word,
    contentReviewed: true,
    image: {
      src: `word-images/${ids[index]}.webp`,
      alt,
      meaning: translation,
      reviewStatus: imageReviews[word]?.status || "pending",
    },
  }),
);
export const lessons = [
  {
    id: "food",
    title: "我的早餐",
    english: "Breakfast time",
    description: "学会食物名称，试着礼貌点餐。",
    minutes: 5,
    words: learningWords.slice(0, 4),
    accent: "green",
  },
  {
    id: "animals",
    title: "动物朋友",
    english: "Animal friends",
    description: "认识四位朋友，说说它们的样子。",
    minutes: 5,
    words: learningWords.slice(4, 8),
    accent: "blue",
  },
  {
    id: "everyday",
    title: "上学的一天",
    english: "A school day",
    description: "从读书、写字到出行，英语就在身边。",
    minutes: 5,
    words: learningWords.slice(8),
    accent: "coral",
  },
];
export const wordById = Object.fromEntries(
  learningWords.map((word) => [word.id, word]),
);
export const abilityQuestions = [
  {
    id: "listen-breakfast",
    skill: "listening",
    audio: "For breakfast, I have bread and milk.",
    prompt: "她早餐吃了什么？",
    options: ["Bread and milk", "An apple and a banana", "Fish and bread"],
    answer: 0,
    explanation: "听到 bread and milk，也就是面包和牛奶。",
    wordId: learningWords[2].id,
  },
  {
    id: "listen-travel",
    skill: "listening",
    audio: "My school is far away. I go to school by bus.",
    prompt: "他怎样去学校？",
    options: ["By bicycle", "By bus", "On foot"],
    answer: 1,
    explanation: "by bus 表示乘公共汽车。",
    wordId: learningWords[11].id,
  },
  {
    id: "listen-pet",
    skill: "listening",
    audio: "My rabbit is white. It has long ears.",
    prompt: "她在说哪个动物？",
    options: ["A dog", "A cat", "A rabbit"],
    answer: 2,
    explanation: "rabbit 是兔子；long ears 是长耳朵。",
    wordId: learningWords[6].id,
  },
  {
    id: "read-notice",
    skill: "reading",
    passage: "LIBRARY\nPlease be quiet. You can borrow three books.",
    prompt: "这张告示告诉你什么？",
    options: [
      "You can borrow three books.",
      "You must buy a book.",
      "You can play music here.",
    ],
    answer: 0,
    explanation: "borrow 是借阅。告示说可以借三本书，并请保持安静。",
  },
  {
    id: "read-email",
    skill: "reading",
    passage:
      "Hi Sam,\nLet’s meet at the park at ten on Saturday. Bring your bicycle!\nLucy",
    prompt: "What should Sam bring?",
    options: ["A book", "A bicycle", "Some milk"],
    answer: 1,
    explanation: "Bring your bicycle! 意思是带上你的自行车。",
    wordId: learningWords[10].id,
  },
  {
    id: "read-story",
    skill: "reading",
    passage:
      "Ben has a cat called Tom. Every day, Ben reads a book after school. Tom sits next to him.",
    prompt: "When does Ben read?",
    options: ["Before breakfast", "On Sunday only", "After school"],
    answer: 2,
    explanation: "after school 表示放学后。短文说 Ben 每天放学后读书。",
    wordId: learningWords[8].id,
  },
];
export const writingTask = {
  prompt: "你的朋友 Alex 想了解你的周末。写一封至少 25 个英文单词的邮件。",
  points: ["你周末去哪里？", "你和谁一起去？", "你在那里做什么？"],
  example:
    "Hi Alex, On Saturday I go to the park with my family. We ride our bicycles and play together. I really enjoy it. What do you do at the weekend?",
};
export const speakingPrompts = [
  "What do you like to eat for breakfast?",
  "Tell me about an animal you like.",
  "How do you go to school?",
];
export function dictionaryEntry(word) {
  const entry = withCorrectMeaning(word);
  const reviewed = wordById[word.id];
  return {
    ...entry,
    phonetic: reviewed?.phonetic || "",
    image: reviewed?.image || additionalImages[word.id] || null,
    contentReviewed: true,
    sentence: reviewed?.sentence || "",
    sentenceTranslation: reviewed?.sentenceTranslation || "",
  };
}
