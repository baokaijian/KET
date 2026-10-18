/**
 * Graded Long-Passage Reading Library (分级长文深度阅读馆)
 * Bridges learners from short 50-word stories to 160–250 word multi-paragraph articles
 * across Tier 1 (A1+ Bridge), Tier 2 (A2 KET Core), and Tier 3 (B1 Transition).
 */

export const GRADED_LONG_PASSAGES = [
  {
    id: "long-passage-seed-journey",
    tier: "Tier 1 · A1+ 桥梁长文",
    wordCount: 158,
    title: "小种子的奇妙春天之旅",
    englishTitle: "The Little Seed's Big Spring Journey",
    readingStrategy: {
      name: "按时间顺序理清故事线索 (Time Order)",
      tip: "长文阅读第一步：找出表示时间变化的词（In winter, When spring comes, Soon, Finally），就能轻松串起整篇文章！",
    },
    highlightWords: ["wind", "tree", "flower", "garden", "water", "sun", "warm", "tall", "bird"],
    discourseMarkers: ["In winter", "When spring comes", "Soon", "Finally"],
    paragraphs: [
      "In winter, a tiny brown seed sleeps quietly under the cold ground in Anna's garden. White snow covers the grass, and the north wind blows through the tall trees. The little seed stays safe and warm under the dark soil.",
      "When spring comes, the weather changes. Gentle rain falls from the clouds and gives the thirsty seed cool water to drink. Then the bright sun shines down and warms the earth. Slowly, the seed wakes up and pushes a small green root down into the soil.",
      "Soon, a lovely green stem grows up towards the blue sky. Every afternoon, Anna brings her watering can and checks on the young plant. After three weeks, two soft leaves open wide like little hands.",
      "Finally, in May, a bright yellow flower opens at the top of the stem. A singing bird and a busy bee come to visit. The tiny seed has become the tallest flower in the garden!",
    ],
    get passage() {
      return this.paragraphs.join("\n\n");
    },
    translation:
      "冬天里，一颗小小的棕色种子在 Anna 花园冰冷的泥土下安静沉睡。白雪覆盖着草地，北风吹过高大的树木。小种子在黑土下安全又温暖。\n\n当春天到来时，天气变了。温柔的春雨从云层落下，给口渴的种子送来清凉的水。接着明亮的太阳照耀大地，温暖了泥土。慢慢地，种子醒了过来，向下扎出一根小小的绿根。\n\n不久，一根可爱的绿茎朝着蓝天向上生长。每天下午，Anna 都会提着洒水壶来看望这株幼苗。三个星期后，两片柔软的叶子像小手一样舒展开来。\n\n终于到了五月，茎的顶端盛开出一朵明亮的黄花。唱歌的小鸟和忙碌的蜜蜂都来拜访。那颗小小的种子变成了花园里最高的花朵！",
    questions: [
      {
        id: "long-seed-q1",
        type: "detail",
        prompt: "What helps the thirsty seed wake up in spring?",
        options: [
          "Cold snow and strong north wind",
          "Gentle rain and the warm sun",
          "A singing bird in the tree",
        ],
        answer: 1,
        explanation: "第二段指出 Gentle rain falls... and the bright sun shines down and warms the earth，春雨和温暖的阳光唤醒了种子。",
      },
      {
        id: "long-seed-q2",
        type: "detail",
        prompt: "What does Anna do every afternoon?",
        options: [
          "She picks the yellow flower.",
          "She brings her watering can and checks on the plant.",
          "She sleeps under the tall tree.",
        ],
        answer: 1,
        explanation: "第三段提到 Every afternoon, Anna brings her watering can and checks on the young plant。",
      },
      {
        id: "long-seed-q3",
        type: "main-idea",
        prompt: "What is this passage mainly about?",
        options: [
          "How to buy flower seeds in a shop",
          "Why winter is the coldest season of the year",
          "How a tiny seed grows step by step into a tall flower",
        ],
        answer: 2,
        explanation: "全文按照冬眠、春雨发芽、长叶到五月开花的顺序，讲述了小种子一步步长成花朵的过程。",
      },
    ],
  },
  {
    id: "long-passage-science-museum",
    tier: "Tier 1 · A1+ 桥梁长文",
    wordCount: 172,
    title: "科学博物馆的雨天探险",
    englishTitle: "A Rainy Saturday at the Science Museum",
    readingStrategy: {
      name: "定位地点转换词 (Following Places)",
      tip: "阅读记叙长文时，注意人物去到的不同展厅（First Floor, Space Hall, Robot Corner），能帮你快速找准细节题答案。",
    },
    highlightWords: ["rain", "bus", "station", "ticket", "school", "science", "train", "lunch"],
    discourseMarkers: ["Because", "First", "Next", "Before leaving"],
    paragraphs: [
      "Last Saturday morning, Leo and his sister Mia wanted to ride their bicycles in the park. However, dark clouds covered the sky and heavy rain started to fall. Their father smiled and said, 'Don't worry! Let's take the bus to the City Science Museum instead.'",
      "At the museum entrance, Dad showed their tickets. First, they walked into the Transport Hall on the ground floor. Leo was excited to see a hundred-year-old steam train with huge black wheels. He climbed up the steps to look inside the driver's cab.",
      "Next, they went upstairs to the Space Room. Mia looked through a big telescope and learned how astronauts sleep and eat in space. She also pressed a blue button to watch a model rocket light up.",
      "At noon, they ate sandwiches and apples in the museum café. Before leaving, Leo bought a small notebook about trains for his school project. Although it rained all day, they learned many new things.",
    ],
    get passage() {
      return this.paragraphs.join("\n\n");
    },
    translation:
      "上周六早上，Leo 和妹妹 Mia 本想去公园骑自行车。然而乌云遮住了天空，下起了大雨。爸爸笑着说：“别担心！我们改坐公交车去市科学博物馆吧。”\n\n在博物馆入口，爸爸出示了门票。首先，他们走进一楼的交通展厅。Leo 兴奋地看到了一辆有着巨大黑轮子的百年蒸汽火车，还爬上台阶看了看驾驶室内部。\n\n接着，他们上楼来到太空展厅。Mia 透过大望远镜观察，了解了宇航员在太空中是如何睡觉和吃饭的。她还按下一个蓝色按钮，观看火箭模型亮起灯光。\n\n中午，他们在博物馆餐厅吃了三明治和苹果。离开前，Leo 为自己的学校课题买了一本关于火车的小笔记本。虽然下了一整天雨，但他们学到了许多新知识。",
    questions: [
      {
        id: "long-museum-q1",
        type: "detail",
        prompt: "Why did Leo and Mia change their Saturday plan?",
        options: [
          "Because their bicycles were broken",
          "Because heavy rain started to fall",
          "Because the park was closed on Saturday",
        ],
        answer: 1,
        explanation: "第一段说明 dark clouds covered the sky and heavy rain started to fall，因为下大雨改变了计划。",
      },
      {
        id: "long-museum-q2",
        type: "detail",
        prompt: "What did Mia do in the Space Room?",
        options: [
          "She climbed into a steam train.",
          "She cooked lunch for astronauts.",
          "She looked through a telescope and pressed a button for a model rocket.",
        ],
        answer: 2,
        explanation: "第三段描述 Mia 透过望远镜观察并按下按钮点亮火箭模型。",
      },
      {
        id: "long-museum-q3",
        type: "inference",
        prompt: "Why did Leo buy a notebook about trains before leaving?",
        options: [
          "To use it for his school project",
          "To give it to the bus driver",
          "To draw pictures of astronauts",
        ],
        answer: 0,
        explanation: "最后一段提到 Leo bought a small notebook about trains for his school project。",
      },
    ],
  },
  {
    id: "long-passage-beach-guardians",
    tier: "Tier 2 · A2 KET 标准长文",
    wordCount: 196,
    title: "守护蔚蓝海滩的小探险家",
    englishTitle: "How Young Explorers Keep the Beach Clean",
    readingStrategy: {
      name: "寻找问题与解决方案 (Problem & Solution)",
      tip: "说明性长文通常会先提出一个环境或生活问题（Problem），接着用 Fortunately / So 引出大家采取的行动（Solution）。",
    },
    highlightWords: ["water", "fish", "bird", "bag", "friend", "teacher", "morning", "clean"],
    discourseMarkers: ["Every summer", "However", "To solve this problem", "As a result"],
    paragraphs: [
      "Every summer, thousands of families visit Bluebay Beach to swim in the cool sea and enjoy picnics on the sand. However, some visitors leave empty plastic bottles, paper boxes, and food bags behind when they go home in the evening.",
      "This rubbish is dangerous for sea animals. When the tide comes in, the water carries plastic pieces into the ocean. Small fish and sea birds sometimes think the bright plastic is food and try to eat it, which can make them very ill.",
      "To solve this problem, twelve students from Greenhill School started a group called the Beach Guardians. Every Saturday morning at nine o'clock, they meet their science teacher by the boat station. They wear thick gloves and carry large reusable bags to collect rubbish along the shore.",
      "In addition to cleaning the sand, the students painted colourful signs that say, 'Please Take Your Rubbish Home!' As a result, visitors are much more careful now, and Bluebay Beach has become a safer, cleaner home for birds and fish.",
    ],
    get passage() {
      return this.paragraphs.join("\n\n");
    },
    translation:
      "每年夏天，成千上万的家庭来到蓝湾海滩，在清凉的海水里游泳，在沙滩上野餐。然而，一些游客傍晚回家时，把空塑料瓶、纸盒和食品袋留在了身后。\n\n这些垃圾对海洋动物非常危险。当涨潮时，海水会把塑料碎片带进海洋。小鱼和海鸟有时会把色彩鲜艳的塑料当成食物吃下去，这会让它们生病。\n\n为了解决这个问题，绿山学校的十二名学生发起了一个名为“海滩小卫士”的小组。每周六早上九点，他们和科学老师在船站旁集合。大家戴上厚手套，提着环保大袋子沿着海岸收集垃圾。\n\n除了清理沙滩，学生们还绘制了彩色告示牌，上面写着：“请把垃圾带回家！”因此，现在的游客更加注意环保，蓝湾海滩也成了鸟类和鱼儿更安全、更干净的家园。",
    questions: [
      {
        id: "long-beach-q1",
        type: "detail",
        prompt: "Why is plastic rubbish dangerous for sea birds and small fish?",
        options: [
          "It makes the sea water too warm.",
          "They sometimes mistake bright plastic for food and eat it.",
          "It stops the boats from leaving the station.",
        ],
        answer: 1,
        explanation: "第二段指出 Small fish and sea birds sometimes think the bright plastic is food and try to eat it。",
      },
      {
        id: "long-beach-q2",
        type: "detail",
        prompt: "What do the Beach Guardians do every Saturday morning?",
        options: [
          "They sell picnic food to visitors.",
          "They go swimming with their science teacher.",
          "They wear gloves and collect rubbish along the shore.",
        ],
        answer: 2,
        explanation: "第三段说明他们每周六早戴上手套、拿着环保袋沿着海岸收集垃圾。",
      },
      {
        id: "long-beach-q3",
        type: "inference",
        prompt: "What happened after the students put up colourful signs?",
        options: [
          "Visitors became more careful and the beach got cleaner.",
          "Nobody was allowed to visit Bluebay Beach.",
          "The school closed the science club.",
        ],
        answer: 0,
        explanation: "第四段 As a result 后指出游客变得更加注意，海滩变得更安全干净了。",
      },
    ],
  },
  {
    id: "long-passage-green-travel",
    tier: "Tier 2 · A2 KET 标准长文",
    wordCount: 204,
    title: "从纸质地图到绿色单车：城市出行变迁",
    englishTitle: "From Paper Maps to Smart Bicycles: Travelling Around Town",
    readingStrategy: {
      name: "对比过去与现在 (Comparing Past & Present)",
      tip: "看到 In the past / Fifty years ago 与 Today / Nowadays 时，留意文章是如何对比不同时代的出行方式的。",
    },
    highlightWords: ["bicycle", "bus", "car", "road", "station", "ticket", "walk", "city"],
    discourseMarkers: ["Fifty years ago", "Today", "For example", "Moreover"],
    paragraphs: [
      "Fifty years ago, travelling around a new town was quite different from today. When people wanted to find a street, a hotel, or a train station, they had to buy a large paper map at a bookshop or ask a police officer for directions. If they missed a bus, they did not know when the next one would arrive.",
      "Today, technology has made city travel much easier and greener. Most bus stops have electronic screens that show the exact number of minutes before the next bus comes. Passengers can also pay for their tickets quickly with a travel card instead of looking for coins.",
      "For example, in many cities, yellow and blue shared bicycles stand neatly beside train stations and parks. Teenagers and adults can unlock a bicycle and ride along safe cycle paths. Cycling not only saves time in busy traffic, but also keeps people healthy and reduces air pollution.",
      "Moreover, walking and taking electric buses are becoming more popular every year. Choosing green transport helps keep the air fresh and the city quiet for everyone.",
    ],
    get passage() {
      return this.paragraphs.join("\n\n");
    },
    translation:
      "五十年前，在陌生的城镇出行与今天大不相同。当人们想找一条街道、一家酒店或火车站时，必须去书店买一张大大的纸质地图，或者向警察问路。如果错过了公交车，他们也不知道下一班车什么时候才来。\n\n如今，科技让城市出行变得更加便捷和环保。大多数公交车站都有电子屏幕，精确显示下一班车还有几分钟到达。乘客还可以用交通卡快速刷卡购票，而不必翻找零钱。\n\n例如，在许多城市里，黄色和蓝色的共享单车整齐地停放在火车站和公园旁。青少年和成年人可以解锁单车，沿着安全的自行车道骑行。骑行不仅能在繁忙的交通中节省时间，还能让人保持健康并减少空气污染。\n\n此外，步行和乘坐电动公交车每年都越来越受欢迎。选择绿色出行有助于让空气保持清新，让城市对每个人都更加宁静。",
    questions: [
      {
        id: "long-travel-q1",
        type: "detail",
        prompt: "How did people find a train station in a new town fifty years ago?",
        options: [
          "They checked an electronic screen at the bus stop.",
          "They used a paper map or asked a police officer.",
          "They rode a shared electric bicycle.",
        ],
        answer: 1,
        explanation: "第一段提到过去人们必须买纸质地图（paper map）或向警察问路。",
      },
      {
        id: "long-travel-q2",
        type: "detail",
        prompt: "According to the passage, what are TWO benefits of riding shared bicycles?",
        options: [
          "It is free for tourists and works in heavy snow.",
          "It saves time in traffic and reduces air pollution.",
          "It replaces all trains and buses in the city.",
        ],
        answer: 1,
        explanation: "第三段最后一句指出 Cycling not only saves time in busy traffic, but also keeps people healthy and reduces air pollution。",
      },
      {
        id: "long-travel-q3",
        type: "main-idea",
        prompt: "What is the writer's main message in this article?",
        options: [
          "Paper maps are better than electronic screens.",
          "Modern technology and green transport make city travel easier and cleaner.",
          "People should never take buses when visiting a new town.",
        ],
        answer: 1,
        explanation: "全文通过对比过去与现在，重点介绍了现代科技与绿色交通如何让城市出行更便捷、更环保。",
      },
    ],
  },
  {
    id: "long-passage-honeybee-dance",
    tier: "Tier 3 · B1 衔接深度长文",
    wordCount: 230,
    title: "蜜蜂的奇妙舞蹈语言",
    englishTitle: "The Secret Language of Honeybees",
    readingStrategy: {
      name: "利用上下文推测科学概念 (Context Clues)",
      tip: "遇到专业现象（如 waggle dance 摇摆舞）不要慌，作者紧接着就会用简单的日常词汇解释它的含义！",
    },
    highlightWords: ["flower", "garden", "sun", "water", "fruit", "vegetable", "dance", "friend"],
    discourseMarkers: ["Have you ever wondered", "When", "If", "Because of"],
    paragraphs: [
      "Have you ever wondered how honeybees tell their friends where to find the sweetest flowers? Bees cannot speak with words like humans do, yet they have one of the most amazing communication systems in the natural world: they dance!",
      "Every sunny morning, worker bees fly out of their hive to search for food in gardens, parks, and fields. When a scout bee discovers a patch of bright flowers full of sweet nectar, she flies straight back home to share the good news with the other bees.",
      "Inside the dark hive, the excited bee performs a special 'waggle dance' on the honeycomb. If she dances in a small circle, it means the flowers are very close to the hive—usually less than fifty metres away. However, if the flowers are far away, she walks in a figure-eight pattern and waggles her body quickly.",
      "Even more surprisingly, the angle of her dance shows the exact direction of the flowers compared to the position of the sun! The faster she waggles, the richer and sweeter the flower food is.",
      "Because of this clever dance language, thousands of bees can work together efficiently. While collecting food, they also carry pollen from flower to flower, which helps our apples, strawberries, and vegetables grow.",
    ],
    get passage() {
      return this.paragraphs.join("\n\n");
    },
    translation:
      "你有没有想过，蜜蜂是如何告诉同伴去哪里寻找最甜美的花朵的？蜜蜂不能像人类那样用语言说话，但它们拥有自然界中最奇妙的交流系统之一：它们会跳舞！\n\n每个阳光明媚的早晨，工蜂都会飞出蜂巢，去花园、公园和田野里寻找食物。当一只侦察蜂发现一片充满甜美花蜜的鲜花时，它会立刻飞回家，与其他蜜蜂分享这个好消息。\n\n在幽暗的蜂巢里，兴奋的蜜蜂会在蜂脾上跳起特别的“摇摆舞”。如果它绕着小圆圈跳舞，意思是花朵离蜂巢非常近——通常不到五十米。然而，如果花朵在很远的地方，它就会走出“8”字形路线并快速摆动身体。\n\n更令人惊讶的是，它跳舞的角度还指明了花朵相对于太阳位置的精确方向！它摆动得越快，说明那里的花蜜越丰富、越香甜。\n\n正是因为这种聪明的舞蹈语言，成千上万只蜜蜂才能高效合作。在采集食物的同时，它们还把花粉从一朵花传到另一朵花，帮助我们的苹果、草莓和蔬菜茁壮成长。",
    questions: [
      {
        id: "long-bee-q1",
        type: "detail",
        prompt: "What does it mean when a honeybee dances in a small circle?",
        options: [
          "There is rain coming soon.",
          "The flowers are very close to the hive.",
          "There is no food left in the garden.",
        ],
        answer: 1,
        explanation: "第三段明确解释：If she dances in a small circle, it means the flowers are very close to the hive。",
      },
      {
        id: "long-bee-q2",
        type: "detail",
        prompt: "How does a bee show the direction of distant flowers?",
        options: [
          "By singing a loud song outside the hive",
          "By dropping flower leaves on the ground",
          "Through the angle of her figure-eight dance compared to the sun",
        ],
        answer: 2,
        explanation: "第四段说明：the angle of her dance shows the exact direction of the flowers compared to the position of the sun。",
      },
      {
        id: "long-bee-q3",
        type: "inference",
        prompt: "Why are honeybees important to human food like apples and vegetables?",
        options: [
          "They water the plants when it is hot.",
          "They carry pollen between flowers while collecting food.",
          "They eat the leaves of fruit trees.",
        ],
        answer: 1,
        explanation: "最后一段指出它们在采蜜时把花粉从一朵花传到另一朵花（carry pollen from flower to flower），帮助果蔬结果生长。",
      },
    ],
  },
  {
    id: "long-passage-rooftop-garden",
    tier: "Tier 3 · B1 衔接深度长文",
    wordCount: 242,
    title: "建造校园屋顶小农场",
    englishTitle: "Building a School Rooftop Garden",
    readingStrategy: {
      name: "归纳段落大意与人物成长 (Paragraph Main Ideas & Character Growth)",
      tip: "读长篇故事时，试着用一句话总结每一段（起因→遇到的困难→如何解决→最终收获），这也是写作最好的模板！",
    },
    highlightWords: ["school", "teacher", "vegetable", "carrot", "potato", "water", "sun", "lunch"],
    discourseMarkers: ["At the beginning of", "At first", "Instead of giving up", "By harvest time"],
    paragraphs: [
      "At the beginning of the autumn term, our headteacher Mrs Green announced an exciting competition: whichever class came up with the best environmental project could use the empty space on the school roof. Our class decided to build a rooftop vegetable garden!",
      "At first, the project was much harder than we expected. We had to carry twenty heavy bags of soil up three flights of stairs. In the second week, strong winds blew away some of our plastic plant pots, and we forgot to water the young carrot seeds on Sunday.",
      "Instead of giving up, our class held a meeting and divided the work carefully. Ben and his group built low wooden boxes so the wind could not move them. Meanwhile, Sarah created a weekly watering timetable and put it on the classroom door. Every pair of students took turns looking after the plants during lunch break.",
      "Slowly, magic happened on the roof. Green leaves appeared, followed by red tomatoes, crisp lettuces, and orange carrots. We even invited our school cook to pick fresh vegetables for our Friday soup.",
      "By harvest time, we had grown over thirty kilos of fresh food. More importantly, the rooftop garden taught us that patience, planning, and teamwork can turn an empty grey roof into a living green classroom.",
    ],
    get passage() {
      return this.paragraphs.join("\n\n");
    },
    translation:
      "秋季学期伊始，我们的校长 Green 女士宣布了一项激动人心的比赛：哪个班级提出最棒的环保项目，就可以使用学校屋顶的空地。我们班决定建造一个屋顶蔬菜农场！\n\n起初，这个项目比我们想象的要难得多。我们不得不把二十袋沉甸甸的泥土搬上三层楼。第二周，大风吹走了一些塑料花盆，而且我们在周日忘了给胡萝卜幼苗浇水。\n\n我们没有放弃，而是开会仔细分配了任务。Ben 和他的小组制作了低矮的木箱，这样大风就吹不动了。与此同时，Sarah 制作了一张每周浇水值日表贴在教室门上。每对同学在午休时间轮流照料植物。\n\n慢慢地，奇迹在屋顶发生了。绿叶冒了出来，紧接着是红彤彤的番茄、爽脆的生菜和橙色的胡萝卜。我们还邀请学校厨师来采摘新鲜蔬菜，为大家做周五的例汤。\n\n到了收获季节，我们已经种出了三十多公斤的新鲜食物。更重要的是，屋顶花园教会了我们：耐心、规划与团队合作，能把一片空荡荡的灰色屋顶变成生机勃勃的绿色课堂。",
    questions: [
      {
        id: "long-roof-q1",
        type: "detail",
        prompt: "What problems did the students face in the second week?",
        options: [
          "Birds ate all the tomatoes and carrots.",
          "Strong winds blew away pots and they forgot to water the seeds on Sunday.",
          "The headteacher closed the school roof.",
        ],
        answer: 1,
        explanation: "第二段提到 strong winds blew away some of our plastic plant pots, and we forgot to water the young carrot seeds on Sunday。",
      },
      {
        id: "long-roof-q2",
        type: "detail",
        prompt: "How did Sarah help solve the watering problem?",
        options: [
          "She watered all the plants by herself every night.",
          "She created a weekly watering timetable for students to take turns.",
          "She moved the plants into the school kitchen.",
        ],
        answer: 1,
        explanation: "第三段提到 Sarah created a weekly watering timetable... Every pair of students took turns looking after the plants。",
      },
      {
        id: "long-roof-q3",
        type: "main-idea",
        prompt: "What lesson did the students learn from the rooftop garden project?",
        options: [
          "Growing vegetables is too difficult for school students.",
          "Patience, planning, and teamwork can turn challenges into success.",
          "Only science teachers should look after gardens.",
        ],
        answer: 1,
        explanation: "最后一段总结道：patience, planning, and teamwork can turn an empty grey roof into a living green classroom。",
      },
    ],
  },
];
