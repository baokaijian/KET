import { allKetWords } from "./ket-words/index.js";
import { dictionaryEntry } from "./learning.js";
import { vocabularyQuestions } from "./curriculum.js";
import { growingStories } from "./child-reading.js";

const themes = [
  {
    id: "breakfast", title: "一起吃早餐", words: "apple|banana|bread|milk|egg|cheese|juice|water",
    sentences: [
      ["I have an apple and a banana.", "我有一个苹果和一根香蕉。"],
      ["The bread is on the plate.", "面包在盘子上。"],
      ["I drink milk with my breakfast.", "我吃早餐时喝牛奶。"],
      ["Mum gives me an egg and some cheese.", "妈妈给我一个鸡蛋和一些奶酪。"],
      ["Would you like some juice or water?", "你想喝一些果汁还是水？"],
      ["We eat together before we go to school.", "我们去学校之前一起吃饭。"],
    ],
    story: "Ben sits at the table with his mum. He has bread, an egg and a banana. Mum drinks water, but Ben likes milk. There is an apple on the plate. Ben gives it to Mum. They eat together before school.",
    questions: [["Ben 喜欢喝什么？", ["牛奶", "果汁", "水"], 0], ["Ben 把苹果给了谁？", ["老师", "妈妈", "姐姐"], 1], ["他们什么时候一起吃饭？", ["放学后", "睡觉前", "上学前"], 2]],
  },
  {
    id: "animals", title: "动物小伙伴", words: "cat|dog|rabbit|fish|bird|duck|horse|cow",
    sentences: [["The cat is sleeping on the chair.", "猫在椅子上睡觉。"], ["My dog likes to play with me.", "我的狗喜欢和我玩。"], ["The rabbit has two long ears.", "兔子有两只长耳朵。"], ["A small fish swims in the water.", "一条小鱼在水里游。"], ["The bird and the duck have wings.", "鸟和鸭子都有翅膀。"], ["We can see a horse and a cow.", "我们能看见一匹马和一头牛。"]],
    story: "Lucy visits a farm with Dad. A cow is eating, and a horse is walking. Lucy sees a duck near the water. A little bird sits in a tree. Before they go home, Lucy gives a rabbit some food. Its ears are very long.",
    questions: [["Lucy 和谁去农场？", ["爸爸", "妈妈", "老师"], 0], ["鸭子在哪里？", ["椅子上", "水边", "房间里"], 1], ["哪种动物的耳朵很长？", ["牛", "鸟", "兔子"], 2]],
  },
  {
    id: "school", title: "我的学校", words: "book|pencil|pen|bag|desk|teacher|school|friend",
    sentences: [["My book is inside my school bag.", "我的书在书包里面。"], ["I put my pencil on the desk.", "我把铅笔放在课桌上。"], ["Our teacher has a blue pen.", "我们的老师有一支蓝色钢笔。"], ["I walk to school with my friend.", "我和朋友步行去学校。"], ["We read a book together in class.", "我们在课堂上一起读一本书。"], ["Please put your bag beside your desk.", "请把书包放在课桌旁边。"]],
    story: "It is morning. Sam puts a book and a pencil in his bag. He walks to school with his friend Kim. Their teacher reads a story. Sam puts his bag beside his desk and listens. After the story, Sam and Kim talk about their favourite part.",
    questions: [["Sam 把什么放进包里？", ["书和铅笔", "食物和水", "玩具和球"], 0], ["谁读了故事？", ["Kim", "老师", "Sam"], 1], ["听完故事后他们做什么？", ["去睡觉", "去购物", "讨论喜欢的部分"], 2]],
  },
  {
    id: "family", title: "我爱我的家", words: "mother|father|sister|brother|family|grandmother|grandfather|baby",
    sentences: [["My mother is reading to the baby.", "我的妈妈在给宝宝读书。"], ["My father makes dinner for our family.", "我的爸爸为家人做晚饭。"], ["My sister and brother play together.", "我的姐姐和哥哥一起玩。"], ["We visit our grandmother on Sunday.", "我们星期天去看奶奶。"], ["Grandfather tells us a funny story.", "爷爷给我们讲一个有趣的故事。"], ["Everyone in my family helps at home.", "我家每个人都在家里帮忙。"]],
    story: "On Sunday, Mia visits her grandparents with her family. Grandfather tells a funny story. Her brother laughs, and her sister asks a question. Grandmother makes lunch. Mia helps her father put the plates on the table. Her mother sits beside the baby. Everyone has a lovely day.",
    questions: [["Mia 哪天去看祖父母？", ["星期天", "星期一", "星期五"], 0], ["谁做了午饭？", ["姐姐", "奶奶", "宝宝"], 1], ["Mia 帮忙做什么？", ["洗衣服", "读故事", "摆盘子"], 2]],
  },
  {
    id: "home", title: "房间里的发现", words: "house|room|door|window|chair|table|bed|lamp",
    sentences: [["There is a big window in my room.", "我的房间里有一扇大窗户。"], ["The lamp is on the small table.", "灯在小桌子上。"], ["My chair is next to the bed.", "我的椅子在床旁边。"], ["Please close the door of the house.", "请关上房子的门。"], ["I can see the garden through the window.", "我能透过窗户看见花园。"], ["I read in bed before I sleep.", "我睡觉前在床上读书。"]],
    story: "Tom has a small room in his house. His bed is beside the window. There is a lamp on the table. In the evening, Tom sits on a chair and reads. He closes the door because the baby is sleeping. Then he puts his book away and goes to bed.",
    questions: [["Tom 的床在哪里？", ["窗户旁边", "花园里", "门外"], 0], ["灯在哪里？", ["床下面", "桌子上", "椅子下面"], 1], ["Tom 为什么关门？", ["他要出门", "他很冷", "宝宝在睡觉"], 2]],
  },
  {
    id: "park", title: "公园探险", words: "park|tree|flower|ball|play|run|jump|walk",
    sentences: [["We walk to the park after lunch.", "我们午饭后步行去公园。"], ["A bird sits in the tall tree.", "一只鸟站在高高的树上。"], ["Please look at this beautiful flower.", "请看看这朵漂亮的花。"], ["I play with a ball on the grass.", "我在草地上玩球。"], ["We run and jump with our friends.", "我们和朋友一起跑、一起跳。"], ["We walk home when it gets dark.", "天黑的时候我们步行回家。"]],
    story: "After lunch, Anna and her brother walk to the park. They play with a ball under a tree. Anna sees a red flower but does not pick it. They run on the grass and jump over a little puddle. When it gets dark, they take their ball and walk home.",
    questions: [["他们什么时候去公园？", ["午饭后", "早餐前", "半夜"], 0], ["Anna 看见了什么？", ["一辆汽车", "一朵红花", "一所学校"], 1], ["天黑时他们做什么？", ["睡在树下", "继续踢球", "步行回家"], 2]],
  },
  {
    id: "clothes", title: "今天穿什么", words: "shirt|coat|hat|shoe|sock|dress|skirt|jacket",
    sentences: [["I put on my shirt in the morning.", "我早上穿上衬衫。"], ["My coat is warm and very soft.", "我的外套暖和又柔软。"], ["This hat keeps my head warm.", "这顶帽子让我的头暖和。"], ["I cannot find my other shoe.", "我找不到另一只鞋。"], ["My sister likes her new dress and skirt.", "我的姐姐喜欢她的新连衣裙和裙子。"], ["I wear a jacket when it is cold.", "天气冷时我穿夹克。"]],
    story: "It is cold today. Lily puts on a shirt and a warm coat. She finds one shoe by the door, but the other shoe is under her bed. Her little brother brings her hat. Lily says thank you. Now she is ready to go outside with her family.",
    questions: [["今天天气怎么样？", ["冷", "炎热", "很暖和"], 0], ["另一只鞋在哪里？", ["桌子上", "床下面", "窗户旁"], 1], ["谁拿来了帽子？", ["妈妈", "老师", "弟弟"], 2]],
  },
  {
    id: "body", title: "照顾好自己", words: "hand|head|eye|ear|mouth|nose|arm|leg",
    sentences: [["I wash my hands before I eat.", "我吃饭前洗手。"], ["My hat is on my head.", "我的帽子戴在头上。"], ["I use my eyes to read books.", "我用眼睛读书。"], ["I listen to music with my ears.", "我用耳朵听音乐。"], ["My nose helps me smell the flowers.", "我的鼻子帮助我闻到花香。"], ["I move my arms and legs when I swim.", "游泳时我移动手臂和腿。"]],
    story: "Before lunch, Max washes his hands. Then he sits down and eats slowly. After lunch, he goes outside. His eyes see a bright flower, and his nose smells it. He hears a bird with his ears. Max waves his arm to Mum, who is standing by the door.",
    questions: [["Max 吃饭前做什么？", ["洗手", "画画", "跑步"], 0], ["Max 用什么闻花香？", ["耳朵", "鼻子", "手臂"], 1], ["谁在门边？", ["爸爸", "老师", "妈妈"], 2]],
  },
  {
    id: "weather", title: "窗外的天气", words: "sun|rain|snow|wind|cloud|hot|cold|weather",
    sentences: [["The sun is bright in the sky.", "太阳在天空中很明亮。"], ["We stay inside because of the rain.", "因为下雨，我们待在屋里。"], ["White snow covers the garden today.", "今天白雪覆盖了花园。"], ["The wind moves the leaves on the tree.", "风吹动树上的叶子。"], ["A big cloud is above our house.", "一朵大云在我们房子上方。"], ["The weather can be hot or cold.", "天气可能热，也可能冷。"]],
    story: "In the morning, Eva looks out of the window. A big cloud covers the sun. Soon the rain starts, so Eva stays inside and reads. In the afternoon, the rain stops. The sun comes out again. Eva puts on her shoes and goes outside to play with her friend.",
    questions: [["早上是什么遮住了太阳？", ["云", "雪", "树叶"], 0], ["下雨时 Eva 做什么？", ["游泳", "在屋里读书", "骑车"], 1], ["下午为什么能出去玩？", ["她找到了书", "风很大", "雨停了"], 2]],
  },
  {
    id: "shopping", title: "一起去买东西", words: "shop|buy|money|price|bag|fruit|vegetable|pay",
    sentences: [["We go to the shop with Mum.", "我们和妈妈一起去商店。"], ["I want to buy some fresh fruit.", "我想买一些新鲜水果。"], ["Dad puts the money in his pocket.", "爸爸把钱放进口袋。"], ["What is the price of this bag?", "这个包的价格是多少？"], ["We buy vegetables for our dinner.", "我们买蔬菜做晚饭。"], ["We pay before we leave the shop.", "我们离开商店前付款。"]],
    story: "Leo goes to a shop with Mum. They need fruit and vegetables for dinner. Leo chooses two apples. Mum checks the price and puts the apples in their bag. They also buy carrots. At the counter, Mum pays. Leo carries the small bag all the way home.",
    questions: [["他们为哪顿饭买东西？", ["晚饭", "早餐", "午饭"], 0], ["Leo 选了什么？", ["两根香蕉", "两个苹果", "三个鸡蛋"], 1], ["谁付款？", ["Leo", "爸爸", "妈妈"], 2]],
  },
  {
    id: "travel", title: "安全出行", words: "bus|bicycle|car|train|road|station|ticket|stop",
    sentences: [["The bus stops near our school.", "公共汽车在我们学校附近停靠。"], ["I ride my bicycle with a helmet.", "我骑自行车时戴头盔。"], ["Dad drives the car very slowly.", "爸爸开车开得很慢。"], ["The train leaves from the big station.", "火车从大车站出发。"], ["We need a ticket for the train.", "我们坐火车需要一张票。"], ["We stop and look before crossing the road.", "我们过马路前停下来看看。"]],
    story: "Zoe and Dad take a bus to the station. Dad buys two train tickets. They wait together and stay away from the edge. When the train arrives, they get on carefully. Zoe sits by the window. She sees cars on the road and waves to a child on a bicycle.",
    questions: [["他们怎么去车站？", ["坐公共汽车", "骑马", "步行"], 0], ["爸爸买了几张火车票？", ["一张", "两张", "三张"], 1], ["Zoe 坐在哪里？", ["车门边", "地板上", "窗户旁"], 2]],
  },
  {
    id: "day", title: "快乐的一天", words: "morning|afternoon|evening|night|breakfast|lunch|dinner|sleep",
    sentences: [["I eat breakfast in the morning.", "我早上吃早餐。"], ["We have lunch at school together.", "我们在学校一起吃午饭。"], ["I play outside in the afternoon.", "我下午在外面玩。"], ["My family has dinner in the evening.", "我的家人晚上吃晚饭。"], ["I read a story before I sleep.", "我睡觉前读一个故事。"], ["At night, the house is quiet.", "夜里，房子里很安静。"]],
    story: "Nina has breakfast in the morning and then goes to school. At lunch, she sits with her friends. In the afternoon, she plays outside. In the evening, her family eats dinner together. Before she sleeps, Dad reads a story. Nina closes her eyes and thinks about her happy day.",
    questions: [["Nina 午饭时和谁坐在一起？", ["朋友们", "爸爸", "奶奶"], 0], ["她下午做什么？", ["睡觉", "在外面玩", "做晚饭"], 1], ["睡觉前谁读故事？", ["Nina", "老师", "爸爸"], 2]],
  },
];

const byName = Object.fromEntries(allKetWords.map((word) => [word.word, dictionaryEntry(word)]));
export const childThemes = themes.map((theme) => {
  const words = theme.words.split("|").map((name) => {
    if (!byName[name]) throw new Error(`Missing child vocabulary: ${name}`);
    return byName[name];
  });
  const prefix = `child-${theme.id}`;
  const vocabulary = { id: `${prefix}-words`, title: `${theme.title} · 新朋友`, skill: "vocabulary", minutes: 5, words, questions: vocabularyQuestions(words, words) };
  const sentences = {
    id: `${prefix}-sentences`, title: `${theme.title} · 听读句子`, skill: "reading", minutes: 5,
    guide: { rule: "先听一听，再读一读。", sentences: theme.sentences, caution: "不需要拼写，理解句子的意思就很好。" },
    questions: theme.sentences.map(([text, meaning], index) => {
      const choices = [meaning, theme.sentences[(index + 1) % 6][1], theme.sentences[(index + 2) % 6][1]];
      const offset = index % choices.length;
      return {
      id: `${prefix}-sentence-${index}`, skill: index < 3 ? "listening" : "reading",
      ...(index < 3 ? { audio: text } : { passage: text }),
      prompt: "这句话在说什么？", options: [...choices.slice(offset), ...choices.slice(0, offset)], answer: (choices.length - offset) % choices.length,
      explanation: `${text} ${meaning}`,
    }; }),
  };
  const story = {
    id: `${prefix}-story`, title: `${theme.title} · 小故事`, skill: "reading", minutes: 8,
    guide: { rule: "听完整个故事，再逐句读。", passage: theme.story, caution: "需要帮助时可以听朗读；听后理解会与独立阅读分开记录。" },
    questions: theme.questions.map(([prompt, options, answer], index) => ({
      id: `${prefix}-story-${index}`, skill: "reading", passage: theme.story, prompt, options, answer,
      explanation: `故事中的答案是：${options[answer]}。`,
    })),
  };
  const growing = growingStories[theme.id];
  const longStory = {
    id: `${prefix}-long-story`, title: `${theme.title} · ${growing.title}`, skill: "reading", minutes: 10,
    guide: { rule: "先分句听读，再把故事连起来。", passage: growing.passage, caution: "这是进阶故事，不要求一次读完。需要帮助时可以逐句听。" },
    questions: growing.questions.map(([prompt, options, answer], index) => ({
      id: `${prefix}-long-story-${index}`, skill: "reading", passage: growing.passage, prompt, options, answer,
      explanation: `故事中的答案是：${options[answer]}。`,
    })),
  };
  return { id: theme.id, title: theme.title, vocabulary, sentences, story, longStory };
});
export const childLessons = childThemes.flatMap((theme) => [theme.vocabulary, theme.sentences, theme.story, theme.longStory]);
export const childQuestionById = Object.fromEntries(childLessons.flatMap((lesson) => lesson.questions).map((question) => [question.id, question]));
