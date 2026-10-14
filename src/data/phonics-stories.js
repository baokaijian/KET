import { WORD_FAMILIES } from "./phonics.js";

/**
 * Decodable Phonics Rhyming Stories (自然拼读韵律短文) for 6-year-old first graders.
 * Combines high-frequency KET words from the same phonics family into short,
 * rhythmic, easy-to-decode stories so children learn words in context without rote memorization.
 */
export const phonicsStories = [
  {
    id: "phonics-story-short-a",
    title: "戴帽子的胖小猫",
    englishTitle: "The Cat in a Hat",
    family: WORD_FAMILIES.short_a,
    highlightWords: ["cat", "hat", "bag", "apple", "hand", "dad", "man", "lamp"],
    passage:
      "Dad has a big red bag. A little cat sits on a mat near the lamp. The cat puts on a funny hat! Dad takes an apple in his hand. The happy cat jumps into the bag.",
    translation:
      "爸爸有一个红色的大包。一只小猫坐在台灯旁的垫子上。小猫戴上了一顶有趣的帽子！爸爸手里拿着一个苹果。快乐的小猫跳进了包里。",
  },
  {
    id: "phonics-story-short-u",
    title: "太阳下的小鸭子",
    englishTitle: "A Duck in the Sun",
    family: WORD_FAMILIES.short_u,
    highlightWords: ["sun", "duck", "run", "jump", "bus", "lunch", "mother", "brother"],
    passage:
      "The warm sun is up in the sky. My brother and mother take a bus to the park. We see a yellow duck run and jump by the water. At noon, we eat a yummy lunch under the sun.",
    translation:
      "温暖的太阳升上了天空。哥哥和妈妈坐公交车去公园。我们看见一只黄小鸭在水边跑跑跳跳。中午，我们在阳光下吃美味的午餐。",
  },
  {
    id: "phonics-story-ir-sh",
    title: "小鸟与花衬衫",
    englishTitle: "The Bird and the Shirt",
    family: WORD_FAMILIES.ir_er_ur,
    highlightWords: ["bird", "shirt", "skirt", "girl", "fish", "shop", "shoe", "water"],
    passage:
      "A little girl wears a blue skirt and a clean white shirt. She walks past a small shop with her teacher. A singing bird sits in a tree, and a red fish swims in the water.",
    translation:
      "一个小女孩穿着蓝色短裙和干净的白衬衫。她和老师走过一家小商店。一只唱歌的小鸟停在树上，一条红鱼在水里游。",
  },
  {
    id: "phonics-story-ai-ay",
    title: "雨中的小火车",
    englishTitle: "A Train in the Rain",
    family: WORD_FAMILIES.ai_ay,
    highlightWords: ["rain", "train", "play", "pay", "day", "always", "say"],
    passage:
      "It is a rainy day, so we cannot play outside. Dad and I go to the station to take a fast train. Dad goes to pay for the ticket. We always say hello to the driver and watch the rain on the window.",
    translation:
      "今天是个雨天，我们不能在外面玩。爸爸和我去车站坐快车。爸爸去付车票钱。我们总是向司机问好，看着车窗上的雨水。",
  },
  {
    id: "phonics-story-ee-oo",
    title: "房间里的故事书",
    englishTitle: "A Book in My Room",
    family: WORD_FAMILIES.oo_family,
    highlightWords: ["book", "look", "room", "school", "tree", "sleep", "cheese", "afternoon"],
    passage:
      "After school in the afternoon, I go into my quiet room. I eat some bread and cheese. Then I look at a picture book about a tall green tree. At night, I close my book and go to sleep.",
    translation:
      "下午放学后，我走进安静的房间。我吃了一点面包和奶酪。接着我看了一本关于绿色大树的图画书。到了夜里，我合上书去睡觉。",
  },
  {
    id: "phonics-story-magic-e",
    englishTitle: "A Cake on the Plate",
    title: "盘子里的美味蛋糕",
    family: WORD_FAMILIES.magic_e,
    highlightWords: ["cake", "plate", "name", "make", "nose", "rice", "nice", "time", "bicycle"],
    passage:
      "It is time to make a nice birthday cake at home! We put the sweet cake on a white plate. I smell it with my nose. After we eat rice for dinner, we write my name on the cake.",
    translation:
      "到时间在家里做一个美味的生日蛋糕啦！我们把香甜的蛋糕放在白盘子里。我用鼻子闻了闻。晚饭吃完米饭后，我们在蛋糕上写下我的名字。",
  },
];
