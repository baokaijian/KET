export const quizzesData = [
  {
    id: 'quiz_1',
    title: '第一课：小动物与数字 (Animals & Numbers)',
    description: '🌱 难度：1星 | 建议Level 1解锁\n通过动物们和数字的趣味故事，练习KET标识、匹配与听力题！',
    difficulty: 1,
    requiredLevel: 1,
    requiredWords: 10,
    questions: [
      {
        id: 'q1_1',
        type: 'sign',
        questionText: '你在公园门口看到了这个告示牌：',
        signContent: '🚫 Do not feed the ducks here!',
        options: [
          'A. 可以在这里喂鸭子。',
          'B. 不要在这里给鸭子喂食。',
          'C. 这里没有小鸭子。'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '不要在这里喂鸭子！',
          translation: '“Do not feed the ducks here!” 意思是“不要在这里喂鸭子”。“Do not” 表示否定“不要”，“feed” 是“喂食”，“ducks” 是“鸭子”。',
          vocab: [
            { word: 'feed', translation: '喂食，给...吃东西' },
            { word: 'duck', translation: '鸭子' },
            { word: 'do not', translation: '不要（表示禁止）' }
          ],
          grammar: '祈使句的否定形式：Do not + 动词原形，用来警告或命令某人不要做某事。在KET考试第一部分（Signs & Notices）中非常常见。',
          parentTip: '家长指引：可以带宝宝模拟一下公园的场景。问宝宝：“如果鸭子吃饱了或者吃了不健康的零食会怎么样呢？” 引导宝宝明白告示牌是为了保护小鸭子，从而记住“Do not feed”是“不能喂食”的意思。'
        }
      },
      {
        id: 'q1_2',
        type: 'listening',
        questionText: '听一听，Sparks 说了什么？请选出对应的场景：',
        audioText: 'Look! The big brown bear is jumping up and down.',
        options: [
          'A. 大熊猫在吃竹子。',
          'B. 蓝色小鸟在树上唱歌。',
          'C. 棕色大熊正在上下跳跃。'
        ],
        correctAnswer: 'C',
        explanation: {
          questionTranslation: '看！那只棕色的大熊正在跳上跳下。',
          translation: '听到的话是：“Look! The big brown bear is jumping up and down.” 其中 “brown bear” 是棕色的熊，“jumping up and down” 是上下跳跃。',
          vocab: [
            { word: 'brown', translation: '棕色的，褐色的' },
            { word: 'bear', translation: '熊' },
            { word: 'jump up and down', translation: '上下跳跃' }
          ],
          grammar: '现在进行时：is + jumping，表示动作正在发生。这也是听力理解中的核心考点。',
          parentTip: '家长指引：播放语音后，让宝宝试着学一学大熊跳跃的动作（jump up and down），边做动作边大声读出单词，通过身体记忆法加深印象。'
        }
      },
      {
        id: 'q1_3',
        type: 'reading',
        questionText: '阅读这篇小短文，回答问题：\n"Sally has a white cat. Its name is Snow. Snow loves eating fish. Sally plays with Snow after school."',
        questionQuery: 'What does Sally\'s cat love to eat?',
        options: [
          'A. Bamboo (竹子)',
          'B. Fish (鱼)',
          'C. Bread (面包)'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: 'Sally有一只白色的猫。它的名字叫Snow。Snow喜欢吃鱼。Sally放学后陪Snow玩耍。问题：Sally的猫喜欢吃什么？',
          translation: '短文中明确提到 “Snow loves eating fish” （Snow喜欢吃鱼），因此选 B。',
          vocab: [
            { word: 'after school', translation: '放学后' },
            { word: 'love doing/to do', translation: '喜欢做...' },
            { word: 'its', translation: '它的（物主代词）' }
          ],
          grammar: '第三人称单数：短文里 Sally has、Its name is、Snow loves、Sally plays，动词都加了-s或-es，这是KET初级语法的重难点。',
          parentTip: '家长指引：和宝宝一起分工读句子，家长读Sally的部分，宝宝扮演猫咪Snow。当读到“eating fish”时，让宝宝做喵喵叫吃鱼的手势，增强阅读趣味性。'
        }
      },
      {
        id: 'q1_4',
        type: 'gapfill',
        questionText: '填空题：选出正确的词语填入空格中，让句子完整。',
        gapSentence: 'A little bird is singing ________ the tree.',
        options: [
          'A. in',
          'B. on',
          'C. under'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '一只小鸟正在树上唱歌。',
          translation: '在英语中，鸟儿停在树枝上或者树叶丛中，通常被视为在树的“里面”，介词用 “in the tree”。如果树上结了苹果或长了叶子（属于树本身的一部分），用 “on the tree”。',
          vocab: [
            { word: 'singing', translation: '正在唱歌' },
            { word: 'in the tree', translation: '在树上（非树本身生长的东西）' },
            { word: 'on the tree', translation: '在树上（树本身长出的果实、叶子）' }
          ],
          grammar: '介词辨析：in, on, under 是KET必备的空间介词。宝宝需要分清它们的使用场景。',
          parentTip: '家长指引：拿一个茶杯和一个小球做实验。把球放杯子里是 in，放杯盖上是 on，放杯底是 under。然后告诉宝宝：“小鸟飞进茂密的绿叶中，就像飞进树的怀抱里一样，所以我们用 in the tree 哟！”'
        }
      }
    ]
  },
  {
    id: 'quiz_2',
    title: '第二课：多彩午餐与食物 (Colors & Foods)',
    description: '🍎 难度：2星 | 建议Level 2解锁\n认识食物和颜色，学习餐桌礼貌表达，包含经典KET听力图片匹配！',
    difficulty: 2,
    requiredLevel: 2,
    requiredWords: 30,
    questions: [
      {
        id: 'q2_1',
        type: 'listening',
        questionText: '听一听，Tom 想要什么？请选出对应的物品：',
        audioText: 'Mum, can I have some fresh cold milk and a yellow banana, please?',
        options: [
          'A. 红苹果和水',
          'B. 冰牛奶和黄色香蕉',
          'C. 面包和橙汁'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '妈妈，请问我能喝一些新鲜的冷牛奶，吃一根黄色的香蕉吗？',
          translation: '听力原文是：“can I have some fresh cold milk and a yellow banana, please?” 提到了 milk (牛奶) 和 banana (香蕉)。',
          vocab: [
            { word: 'fresh', translation: '新鲜的' },
            { word: 'cold', translation: '冰凉的，冷的' },
            { word: 'can I have...', translation: '我能要/吃一些...吗？（委婉语气）' }
          ],
          grammar: '情态动词 Can 引导的请求许可句型：“Can I have... please?” 是KET口语和日常交际非常核心的礼貌句型。',
          parentTip: '家长指引：今天吃饭或吃点心的时候，可以跟宝宝做情景模拟。让宝宝对您说：“Can I have an apple, please?”，当宝宝说对时，开心地递给他并夸奖他！'
        }
      },
      {
        id: 'q2_2',
        type: 'sign',
        questionText: '你在学校食堂看到了这个牌子：',
        signContent: '🍎 Wash your hands before eating!',
        options: [
          'A. 吃饭前要洗手。',
          'B. 吃饭后要洗手。',
          'C. 不要在这里洗手。'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '吃饭前洗手！',
          translation: '“Wash your hands before eating!” 意思是“吃饭前洗手”。“Wash” 是“洗”，“hands” 是“双手”，“before” 是“在...之前”。',
          vocab: [
            { word: 'wash', translation: '洗，清洗' },
            { word: 'before', translation: '在...之前' },
            { word: 'eating', translation: '吃东西' }
          ],
          grammar: '时间介词 before 后面接动词的-ing形式（eating），这是KET考试中关于介词用法的细节考点。',
          parentTip: '家长指引：在家里洗手池旁也贴一张这样的小英文纸条，每次饭前洗手时指着纸条对宝宝念一遍：“Wash hands before eating!”，让生活场景成为最好的教材。'
        }
      },
      {
        id: 'q2_3',
        type: 'gapfill',
        questionText: '选择合适的词填空，帮助小猴子把话说完整：',
        gapSentence: 'Look at the apple. It ________ red and sweet.',
        options: [
          'A. am',
          'B. is',
          'C. are'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '看这个苹果。它是红色的，而且很甜。',
          translation: '主语是 “It”（单数第三人称代词，指代 the apple），对应的 be 动词应该用 “is”。',
          vocab: [
            { word: 'sweet', translation: '甜的' },
            { word: 'look at', translation: '看...' }
          ],
          grammar: 'be 动词的用法口诀：我(I)用am，你(you)用are，is连着他(he)、她(she)、它(it)；单数主语用is，复数主语全用are。这是KET必备的基本功。',
          parentTip: '家长指引：给宝宝背诵上面的 be 动词口诀。可以考考宝宝：“如果是 apples 呢？”，引导宝宝回答“用 are，因为 apples 是复数”。'
        }
      },
      {
        id: 'q2_4',
        type: 'reading',
        questionText: '阅读这篇日记，回答问题：\n"Today is my birthday. My mother makes a big chocolate cake for me. We also have sweet orange juice. I am very happy."',
        questionQuery: 'What kind of cake do they have?',
        options: [
          'A. Chocolate cake (巧克力蛋糕)',
          'B. Apple cake (苹果蛋糕)',
          'C. Strawberry cake (草莓蛋糕)'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '今天是我的生日。妈妈为我做了一个大巧克力蛋糕。我们还有甜甜的橙汁。我非常开心。问题：他们吃的是什么蛋糕？',
          translation: '日记中提到 “makes a big chocolate cake for me”（为我做了一个大巧克力蛋糕），答案选择 A。',
          vocab: [
            { word: 'birthday', translation: '生日' },
            { word: 'chocolate', translation: '巧克力' },
            { word: 'juice', translation: '果汁' }
          ],
          grammar: '名词作定语修饰另一个名词：chocolate cake 巧克力蛋糕，orange juice 橙汁。',
          parentTip: '家长指引：可以问宝宝“你最喜欢什么口味的蛋糕呢？”，如果是草莓蛋糕就是 strawberry cake，冰淇淋蛋糕就是 ice cream cake。'
        }
      }
    ]
  },
  {
    id: 'quiz_3',
    title: '第三课：我的家与校园生活 (Home & School)',
    description: '🏠 难度：2.5星 | 建议Level 4解锁\n学习家中的物品，并开始了解学校生活和班级规则！',
    difficulty: 2,
    requiredLevel: 4,
    requiredWords: 80,
    questions: [
      {
        id: 'q3_1',
        type: 'sign',
        questionText: '你在学校图书馆看到了这个牌子：',
        signContent: '📚 Please return books to the shelf after reading!',
        options: [
          'A. 看完书要把书放回书架。',
          'B. 不能把书带出图书馆。',
          'C. 图书馆里不能看书。'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '阅读后请将书放回书架！',
          translation: '“Please return books to the shelf after reading!” 意思是“阅读后请把书还回书架”。“return” 是“归还”，“shelf” 是“书架”。',
          vocab: [
            { word: 'return', translation: '归还，返回' },
            { word: 'shelf', translation: '书架，搁板' },
            { word: 'after reading', translation: '阅读后' }
          ],
          grammar: '祈使句的肯定形式：Please + 动词原形（return），用来表示礼貌的请求或要求。',
          parentTip: '家长指引：看完书后，引导宝宝在家里自己把画册放回书箱，边放边说“Please return books”。'
        }
      },
      {
        id: 'q3_2',
        type: 'listening',
        questionText: '听一听，Sparks 说了什么？请选出对应的动作：',
        audioText: 'Let\'s put the green pillow on the bed and tidy the room.',
        options: [
          'A. 把红色椅子擦干净。',
          'B. 把绿色枕头放在床上并整理房间。',
          'C. 把书放在书架上。'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '让我们把绿色的枕头放在床上，然后整理房间。',
          translation: '听力原文中说 “put the green pillow on the bed” 意思是“把绿色枕头放在床上”， “tidy the room” 意思是“整理房间”。',
          vocab: [
            { word: 'pillow', translation: '枕头' },
            { word: 'on the bed', translation: '在床上' },
            { word: 'tidy', translation: '整理，收拾' }
          ],
          grammar: 'Let\'s 结构：Let\'s + 动词原形，表示提议“让我们一起做某事吧”。',
          parentTip: '家长指引：早晨起床整理床铺时，可以让宝宝帮您拿枕头，并念出“pillow”这个词。'
        }
      },
      {
        id: 'q3_3',
        type: 'reading',
        questionText: '阅读下面这篇小文，回答问题：\n"Our school has a big library. There are many computer tables and bookshelves. The school rule says: Keep quiet in the library."',
        questionQuery: 'What is the library rule?',
        options: [
          'A. Eat food (吃东西)',
          'B. Play games (玩游戏)',
          'C. Keep quiet (保持安静)'
        ],
        correctAnswer: 'C',
        explanation: {
          questionTranslation: '我们学校有一个大图书馆。这里有许多电脑桌和书架。学校规定写着：在图书馆要保持安静。问题：图书馆的规则是什么？',
          translation: '短文最后一句明确提到 “Keep quiet in the library”（在图书馆里保持安静），因此答案是 C。',
          vocab: [
            { word: 'rule', translation: '规则' },
            { word: 'keep quiet', translation: '保持安静' },
            { word: 'library', translation: '图书馆' }
          ],
          grammar: 'Keep + 形容词：表示保持某种状态。例如 keep quiet（保持安静），keep clean（保持干净）。',
          parentTip: '家长指引：带宝宝去图书馆或书店时，用食指放在嘴唇上做出“嘘”的动作，对宝宝说“Keep quiet”，让宝宝理解在公共场合要保持安静。'
        }
      },
      {
        id: 'q3_4',
        type: 'gapfill',
        questionText: '选择合适的词填空：',
        gapSentence: 'Class begins at nine o\'clock. Don\'t ________ late for school!',
        options: [
          'A. is',
          'B. be',
          'C. are'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '九点开始上课。上学不要迟到！',
          translation: '否定祈使句“Don\'t...”后必须用动词原形。这里表示迟到是“be late”，所以用动词原形 “be”。',
          vocab: [
            { word: 'begin', translation: '开始' },
            { word: 'late', translation: '迟的，晚的' },
            { word: 'be late for', translation: '迟到' }
          ],
          grammar: 'Don\'t + 动词原形：在口语和KET写作中极为常用，此处“be”是系动词的原形。',
          parentTip: '家长指引：早上送宝宝出门时，可以拍拍他的小手说：“We must run! Don\'t be late for school!” 让英语融入日常作息。'
        }
      }
    ]
  },
  {
    id: 'quiz_4',
    title: '第四课：出行探索与大自然 (Travel & Nature)',
    description: '🚗 难度：3星 | 建议Level 6解锁\n学习交通工具、方位词与天气的变化，应对KET听力里的天气场景！',
    difficulty: 3,
    requiredLevel: 6,
    requiredWords: 150,
    questions: [
      {
        id: 'q4_1',
        type: 'sign',
        questionText: '你在公路旁看到了这个标志：',
        signContent: '⚠️ Slow down! Children crossing the road!',
        options: [
          'A. 减速！孩子们正在过马路！',
          'B. 孩子们不准过马路！',
          'C. 这里可以停车。'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '减速！孩子们正在过马路！',
          translation: '“Slow down! Children crossing the road!” 意思是“减速！孩子们正在过马路”。“slow down” 是减速，“cross the road” 是过马路。',
          vocab: [
            { word: 'slow down', translation: '减速，慢下来' },
            { word: 'cross', translation: '穿过，越过' },
            { word: 'road', translation: '马路，道路' }
          ],
          grammar: '分词作后置定语：crossing the road 是现在分词短语，用来修饰前面的名词 children，表示“正在过马路的孩子们”。',
          parentTip: '家长指引：在街上过马路时，可以指着人行横道（zebra crossing）告诉宝宝：“We are crossing the road now!” 并教育宝宝注意车辆。'
        }
      },
      {
        id: 'q4_2',
        type: 'listening',
        questionText: '听一听，Tom 遇到了什么情况：',
        audioText: 'Look at the dark clouds! It is going to rain. Let\'s run to the bus station.',
        options: [
          'A. 天气晴朗，我们去公园散步吧。',
          'B. 看那些乌云！要下雨了。我们跑去公交站吧。',
          'C. 坐公交车去海边玩。'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '看那些乌云！天快要下雨了。我们跑去公交站吧。',
          translation: '听力原文中 “dark clouds” 意思是乌云，“going to rain” 意思是将要下雨，“bus station” 是公交站。',
          vocab: [
            { word: 'dark cloud', translation: '乌云' },
            { word: 'be going to', translation: '将要，准备（计划发生的动作）' },
            { word: 'bus station', translation: '公交站' }
          ],
          grammar: 'be going to 结构：用来预测即将发生的事，在KET听力理解中常考。',
          parentTip: '家长指引：阴天或快下雨的时候，可以让宝宝向外看，问问他：“Can you see the dark clouds?”'
        }
      },
      {
        id: 'q4_3',
        type: 'reading',
        questionText: '阅读这篇旅游日志，回答问题：\n"Last summer, my family travelled to a beautiful island by boat. The sea was blue and clear. We saw many colourful fish swimming in the water."',
        questionQuery: 'How did they travel to the island?',
        options: [
          'A. By plane (坐飞机)',
          'B. By train (坐火车)',
          'C. By boat (坐船)'
        ],
        correctAnswer: 'C',
        explanation: {
          questionTranslation: '去年夏天，我们一家坐船去了一个美丽的岛屿。海水蔚蓝清澈。我们看到许多五颜六色的鱼在水里游。问题：他们是怎么去岛上的？',
          translation: '文章中第一句明确写道 “travelled to a beautiful island by boat” （坐船去了一个美丽的岛屿），因此选 C。',
          vocab: [
            { word: 'travel', translation: '旅行' },
            { word: 'island', translation: '岛屿' },
            { word: 'by boat', translation: '乘船' }
          ],
          grammar: 'by + 交通工具：by boat 坐船，by plane 坐飞机，by train 坐火车。注意交通工具前不能加冠词。',
          parentTip: '家长指引：和宝宝一起在纸上画小船、小汽车和飞机，让宝宝用英语说出它们的出行方式（by boat, by car, by plane）。'
        }
      },
      {
        id: 'q4_4',
        type: 'gapfill',
        questionText: '选择合适的词填空，让句子通顺：',
        gapSentence: 'The weather was very cold yesterday, so we ________ stay at home.',
        options: [
          'A. must',
          'B. had to',
          'C. should'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '昨天天气非常冷，所以我们不得不待在家里。',
          translation: '句子描述的是“yesterday”（昨天），动词应用过去式。“must” 和 “should” 都没有时态上的过去式变化，而 “had to” 是 “have to（不得不）”的过去式，符合语境。',
          vocab: [
            { word: 'yesterday', translation: '昨天' },
            { word: 'had to', translation: '不得不（过去式）' },
            { word: 'stay at home', translation: '待在家里' }
          ],
          grammar: '过去时态与情态动词：had to 是 have to 的过去式，表示过去客观环境所迫而不得不做的事情。',
          parentTip: '家长指引：昨天天气冷如果宝宝没出门，可以跟他说：“It was cold yesterday, so we had to stay at home.” 通过实际体验理解“had to”的无奈和用法。'
        }
      }
    ]
  },
  {
    id: 'quiz_5',
    title: '第五课：运动爱好与情感表达 (Sports & Emotions)',
    description: '🏃 难度：3.5星 | 建议Level 8解锁\n描述运动项目、外貌和性格，学习如何用英语表达丰富的心情！',
    difficulty: 3,
    requiredLevel: 8,
    requiredWords: 300,
    questions: [
      {
        id: 'q5_1',
        type: 'sign',
        questionText: '你在运动俱乐部大门上看到了这个告示：',
        signContent: '🏆 KET Sports Club: Wear sports shoes for badminton class!',
        options: [
          'A. 羽毛球课必须穿运动鞋！',
          'B. 不能在羽毛球场穿鞋！',
          'C. 可以穿皮鞋打羽毛球。'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: 'KET运动俱乐部：上羽毛球课请穿运动鞋！',
          translation: '“Wear sports shoes for badminton class!” 意思是“上羽毛球课要穿运动鞋”。“wear” 是穿戴，“sports shoes” 是运动鞋，“badminton” 是羽毛球。',
          vocab: [
            { word: 'wear', translation: '穿，戴' },
            { word: 'sports shoes', translation: '运动鞋' },
            { word: 'badminton', translation: '羽毛球' }
          ],
          grammar: '介词 for 的用法：此处 for 表示目的，即“为了羽毛球课而准备”。',
          parentTip: '家长指引：带宝宝出门运动前，指着他的运动鞋说：“Put on your sports shoes! Let\'s go play!”'
        }
      },
      {
        id: 'q5_2',
        type: 'listening',
        questionText: '听一听，Sparks 为什么这么开心？',
        audioText: 'I was very excited because our school football team won the final match yesterday.',
        options: [
          'A. 我很生气因为我们队输了。',
          'B. 我很兴奋，因为我们学校足球队昨天赢了决赛。',
          'C. 我很疲惫，因为踢了一整天足球。'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '我非常兴奋，因为我们学校足球队昨天赢了决赛！',
          translation: '听力原文中 “excited” 是兴奋，“won the final match” 意思是赢了决赛。',
          vocab: [
            { word: 'excited', translation: '兴奋的，激动的' },
            { word: 'win (won)', translation: '赢（过去式）' },
            { word: 'final match', translation: '决赛' }
          ],
          grammar: 'because 引导的原因状语从句：表示前面感到兴奋（was excited）的原因是赢了比赛。这是口语和书面表达的关键句型。',
          parentTip: '家长指引：当宝宝因为某件事高兴时，可以教他用“I am excited because...”的句式来表达原因，培养逻辑表达。'
        }
      },
      {
        id: 'q5_3',
        type: 'reading',
        questionText: '阅读这篇描述同学的作文，回答问题：\n"David is a popular boy. He is tall and has curly hair. He is very creative and likes playing the guitar in his free time. His friends think he is very funny."',
        questionQuery: 'What is David\'s hobby?',
        options: [
          'A. Collecting stamps (集邮)',
          'B. Playing the guitar (弹吉他)',
          'C. Playing football (踢足球)'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: 'David是一个受欢迎的男孩。他长得很高，留着卷发。他很有创意，空闲时间喜欢弹吉他。他的朋友们觉得他很有趣。问题：David的爱好是什么？',
          translation: '文中提到 “likes playing the guitar in his free time” （在空闲时间喜欢弹吉他），因此答案是 B。',
          vocab: [
            { word: 'popular', translation: '受欢迎的' },
            { word: 'curly hair', translation: '卷发' },
            { word: 'hobby', translation: '爱好' }
          ],
          grammar: 'like + doing 结构：likes playing...，表示喜欢做某事，表示长期的兴趣。',
          parentTip: '家长指引：如果宝宝有乐器或者画画等爱好，可以鼓励他用“I like playing...”或“I like drawing...”向外教或朋友介绍自己。'
        }
      },
      {
        id: 'q5_4',
        type: 'gapfill',
        questionText: '选择最合适的词填空：',
        gapSentence: 'If you want to win the race, you should ________ every day.',
        options: [
          'A. practice',
          'B. to practice',
          'C. practicing'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '如果你想赢得比赛，你应该每天练习。',
          translation: '“should” 是情态动词，后面必须紧跟动词原形，所以选 A。',
          vocab: [
            { word: 'race', translation: '比赛，赛跑' },
            { word: 'should', translation: '应该（情态动词）' },
            { word: 'practice', translation: '练习，实践' }
          ],
          grammar: '情态动词+动词原形：should, can, must 等后跟动词原形，这是最基本、最高频的KET语法考点。',
          parentTip: '家长指引：可以告诉宝宝，做任何事情想要做好都必须练习，“We should practice every day!”，鼓励宝宝每天坚持学习英语。'
        }
      }
    ]
  },
  {
    id: 'quiz_6',
    title: '第六课：社会职业与现代科技 (Jobs & Tech)',
    description: '📱 难度：4星 | 建议Level 10解锁\n认识社会的各种职业，以及智能手机、网络、电脑等现代科技词汇！',
    difficulty: 4,
    requiredLevel: 10,
    requiredWords: 500,
    questions: [
      {
        id: 'q6_1',
        type: 'sign',
        questionText: '你在文具店收银台看到这个提示：',
        signContent: '🛒 Discount Center: Pay by cash to get 10% off today!',
        options: [
          'A. 今天用现金付款可以打九折！',
          'B. 今天不接受现金付款。',
          'C. 刷信用卡可以打折。'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '打折中心：今天用现金付款可以打九折！',
          translation: '“Pay by cash to get 10% off today!” 意思是“今天付现金可以打九折（省去10%）”。“cash” 是现金，“10% off” 是九折（减少百分之十）。',
          vocab: [
            { word: 'cash', translation: '现金' },
            { word: 'discount', translation: '折扣' },
            { word: '10% off', translation: '打九折（优惠10%）' }
          ],
          grammar: 'to + 动词原形做目的状语：to get 10% off，表示“为了获得九折优惠”。',
          parentTip: '家长指引：买东西时可以考考宝宝：“如果是 20% off，那是打几折呢？”，告诉宝宝是八折，顺便锻炼宝宝的数学口算和理财意识。'
        }
      },
      {
        id: 'q6_2',
        type: 'listening',
        questionText: '听一听，Tom 请你帮什么忙：',
        audioText: 'Can you send me an email with the new photo file when you connect to the wifi?',
        options: [
          'A. 你的手机断开wifi了。',
          'B. 当你连上wifi时，能把存有新照片的文件发邮件给我吗？',
          'C. 用手机拍照发给我。'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '当你连上无线网时，能把新照片的文件通过电子邮件发给我吗？',
          translation: '听力原文中 “send me an email” 是发邮件，“photo file” 是照片文件，“connect to the wifi” 是连接无线网。',
          vocab: [
            { word: 'email', translation: '电子邮件' },
            { word: 'file', translation: '文件' },
            { word: 'connect', translation: '连接' }
          ],
          grammar: 'when 引导的时间状语从句：when you connect to the wifi 表示时间。在主将从现的原则中，这里用一般现在时。',
          parentTip: '家长指引：在家里操作电脑发邮件或连Wi-Fi时，可以用英语对宝宝讲解，比如“I am connecting to the wifi now”。'
        }
      },
      {
        id: 'q6_3',
        type: 'reading',
        questionText: '阅读下面关于家长的介绍，回答问题：\n"Lucy\'s father is a famous scientist. He works in a big laboratory. He always says that learning to use computers is very important for children\'s future education."',
        questionQuery: 'What is the job of Lucy\'s father?',
        options: [
          'A. Chef (厨师)',
          'B. Scientist (科学家)',
          'C. Dentist (牙医)'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: 'Lucy的父亲是一位著名的科学家。他在一个大实验室里工作。他总是说学习使用电脑对孩子们未来的教育非常重要。问题：Lucy的父亲是什么工作？',
          translation: '短文开头写道 “Lucy\'s father is a famous scientist” （Lucy的父亲是一位著名的科学家），所以答案选择 B。',
          vocab: [
            { word: 'scientist', translation: '科学家' },
            { word: 'famous', translation: '著名的' },
            { word: 'laboratory', translation: '实验室' }
          ],
          grammar: 'that 引导的宾语从句：says that...，宾语从句中主语是动名词短语 learning to use computers。这是KET中高级的语法考点。',
          parentTip: '家长指引：可以跟宝宝聊聊自己是什么职业，然后教给宝宝这个职业的英文单词，比如“My father/mother is a teacher/doctor/engineer”。'
        }
      },
      {
        id: 'q6_4',
        type: 'gapfill',
        questionText: '选择最合适的短语填空：',
        gapSentence: 'Excuse me, I can\'t ________ this computer. Can you help me?',
        options: [
          'A. open',
          'B. turn on',
          'C. starting'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '打扰一下，我没法打开这台电脑。你能帮帮我吗？',
          translation: '打开电器、灯、电脑等带电源的设备，通常用固定搭配 “turn on”，关闭用 “turn off”。而 “open” 指物理上的翻开、打开门窗等，不符合电脑开机意思。',
          vocab: [
            { word: 'excuse me', translation: '打扰一下，请问' },
            { word: 'turn on', translation: '打开（电器、开关等）' },
            { word: 'turn off', translation: '关闭（电器、开关等）' }
          ],
          grammar: '情态动词后跟动词原形：can\'t + turn on。同时辨析 open 与 turn on 的区别是KET常考点。',
          parentTip: '家长指引：在家里开灯、关电视时，可以让宝宝帮操作，说：“Please turn on the light” 或者 “Please turn off the TV”。'
        }
      }
    ]
  },
  {
    id: 'quiz_7',
    title: '第七课：世界旅行与综合冲刺 (Travel & Challenge)',
    description: '🎓 难度：5星 | 建议Level 12解锁\n终极综合大考！涵盖世界地理、介词短语及KET最核心的高频动词搭配！',
    difficulty: 5,
    requiredLevel: 12,
    requiredWords: 800,
    questions: [
      {
        id: 'q7_1',
        type: 'sign',
        questionText: '你在机场的值机柜台前看到了这个公告：',
        signContent: '✈️ Flight Notice: Passengers must arrive at the airport two hours before departure!',
        options: [
          'A. 旅客必须在起飞前两小时到达机场！',
          'B. 飞机将晚点两小时起飞。',
          'C. 旅客可以在飞机上休息两小时。'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '航班告示：旅客必须在起飞前两小时到达机场！',
          translation: '“Passengers must arrive at the airport two hours before departure!” 意思是“旅客必须在起飞前两小时到达机场”。“must” 表示必须，“departure” 是起飞、出发。',
          vocab: [
            { word: 'passenger', translation: '乘客，旅客' },
            { word: 'airport', translation: '机场' },
            { word: 'departure', translation: '出发，起飞' }
          ],
          grammar: '情态动词 must 表示强烈的义务或规定。before 后跟名词作介词短语（before departure）。',
          parentTip: '家长指引：如果带宝宝坐飞机旅行，可以把登机牌拿给他看，告诉他“This is the airport, we must arrive early!” 增加临场感。'
        }
      },
      {
        id: 'q7_2',
        type: 'listening',
        questionText: '听一听，Sparks 描述的英国之旅是怎样的：',
        audioText: 'When we travelled to Britain last winter, we stayed in a lovely hotel near a castle.',
        options: [
          'A. 我们去年冬天去加拿大度假。',
          'B. 我们去年冬天去英国旅行时，住在城堡附近的一家漂亮旅馆里。',
          'C. 我们在旅馆里看到了城堡的照片。',
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '去年冬天我们去英国旅行时，住在城堡附近的一个可爱旅馆里。',
          translation: '听力原文中 “travelled to Britain” 指去英国旅行，“lovely hotel” 是可爱的/漂亮的旅馆，“near a castle” 是城堡附近。',
          vocab: [
            { word: 'Britain', translation: '英国，大不列颠' },
            { word: 'hotel', translation: '旅馆，酒店' },
            { word: 'castle', translation: '城堡' }
          ],
          grammar: 'When 引导的时间状语从句：表示过去发生的事情，句子全篇用了一般过去时（travelled, stayed）。',
          parentTip: '家长指引：可以用地球仪或世界地图，跟宝宝指一下中国和英国的位置，加深地理认知。'
        }
      },
      {
        id: 'q7_3',
        type: 'reading',
        questionText: '阅读这篇短文，回答问题：\n"Learning phrasal verbs is very useful for KET exams. For example, \'look after\' means taking care of someone, and \'give up\' means stopping something. You should write them down in your notebook."',
        questionQuery: 'What does \'look after\' mean?',
        options: [
          'A. Tidy up (整理)',
          'B. Take care of (照顾)',
          'C. Wake up (醒来)'
        ],
        correctAnswer: 'B',
        explanation: {
          questionTranslation: '学习动词短语对KET考试非常有用。例如，“look after” 意思是照顾某人，“give up” 意思是停止做某事。你应该把它们写在你的笔记本上。问题：“look after” 是什么意思？',
          translation: '短文中明确提到 “\'look after\' means taking care of someone” （look after 意思是照顾某人），而 “take care of” 正是照顾的意思，因此答案选 B。',
          vocab: [
            { word: 'look after', translation: '照顾' },
            { word: 'take care of', translation: '照顾' },
            { word: 'give up', translation: '放弃，停止' }
          ],
          grammar: '动名词短语作主语：Learning phrasal verbs is...，系动词用 is，因为动名词短语做主语看作单数。',
          parentTip: '家长指引：可以告诉宝宝：“爸爸妈妈每天照顾你，就是在 look after you 哦，所以宝宝长大了也要学会 look after yourself (照顾好自己) 哟！”'
        }
      },
      {
        id: 'q7_4',
        type: 'gapfill',
        questionText: '选择最合适的介词填空，使句子完整：',
        gapSentence: 'I am looking forward ________ visiting China and eating delicious Chinese food next year.',
        options: [
          'A. to',
          'B. for',
          'C. at'
        ],
        correctAnswer: 'A',
        explanation: {
          questionTranslation: '我期待着明年访问中国，吃好吃的中国菜。',
          translation: '“期待做某事”的固定搭配是 “look forward to doing sth”。这里的 to 是介词，所以后面要加动名词（visiting, eating），这也是KET最经典、必考的词组之一。',
          vocab: [
            { word: 'look forward to', translation: '盼望，期待' },
            { word: 'delicious', translation: '美味的' },
            { word: 'visiting', translation: '正在访问/参观' }
          ],
          grammar: '介词 to 后跟动名词：look forward to + doing，千万不要把 to 当成不定式符号后面加动词原形。',
          parentTip: '家长指引：如果明天要带宝宝去动物园，可以对他说：“Are you looking forward to going to the zoo tomorrow?”，引导他回答“Yes!”，在实景中熟练运用。'
        }
      },
      {
        id: 'q7_5',
        type: 'gapfill',
        questionText: '选择正确的介词填空：',
        gapSentence: 'The postman always comes ________ nine o\'clock in the morning to deliver letters.',
        options: [
          'A. on',
          'B. in',
          'C. at'
        ],
        correctAnswer: 'C',
        explanation: {
          questionTranslation: '邮递员总是在早上九点钟来送信。',
          translation: '在英语中，表示在具体的时间点（如几点钟）要用介词 “at”。在星期几用 “on”（如 on Monday），在月份、季节、年份或上午/下午用 “in”（如 in the morning）。',
          vocab: [
            { word: 'postman', translation: '邮递员' },
            { word: 'deliver', translation: '投递，传送' },
            { word: 'at nine o\'clock', translation: '在九点整' }
          ],
          grammar: '时间介词 at, on, in 的区分：at + 精确时间点；on + 具体某一天；in + 泛指一段时间（如 morning, afternoon, 月, 年）。',
          parentTip: '家长指引：用家里的挂钟和宝宝做游戏。指着 7:00 说：“We eat breakfast at 7 o\'clock.” 考考宝宝他的睡觉时间该怎么用英语和介词表达。'
        }
      }
    ]
  }
];
