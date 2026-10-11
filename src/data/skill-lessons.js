// All passages and questions below are original practice, not Cambridge exam items.
const raw = [
  [1, "reading", "R1", "读懂生活告示", "先判断告示写给谁、要你做什么，再比较选项。不要只找相同单词。", [
    ["What does this notice mean?", "LIBRARY: Return your books by Friday. The library is closed on Saturday.", ["Bring the books back no later than Friday.", "Borrow books on Saturday.", "The library is closed on Friday."], 0, "by Friday 指最迟星期五；星期六闭馆。"],
    ["What should Mia do?", "Mia, please bring a jacket for our walk. It may be cold in the evening. Dad", ["Stay at home all evening.", "Take something warm to wear.", "Buy a new jacket today."], 1, "爸爸建议带夹克，因为晚上可能冷；并未要求买新衣服。"],
    ["What does the sign tell customers?", "CAFÉ: Cash only today. Our card machine is not working.", ["All drinks are free today.", "You can only buy a card.", "You cannot pay by card today."], 2, "Cash only 表示只能用现金，刷卡机坏了。"],
  ]],
  [2, "listening", "L1", "听出关键信息", "先读问题，确定要听食物、时间还是地点。留意说话人改变主意。此组使用文字选项练习，正式 Part 1 使用图像选项。", [
    ["What will Leo have for lunch?", "I wanted a burger, but there aren't any left. I'll have a sandwich instead. I had pasta yesterday.", ["A sandwich", "A burger", "Pasta"], 0, "instead 表示改选；最终选择 sandwich。"],
    ["What time will they meet?", "Let's meet at two. Actually, my lesson finishes at two, so can we meet at half past two? Yes, that is fine.", ["2:00", "2:30", "3:30"], 1, "最终约定 half past two，即 2:30。"],
    ["Where is the woman's bag?", "I left my bag in the café. No, wait, I remember taking it to the library. It is under the desk there, not in the car.", ["In the car", "In the café", "Under a desk in the library"], 2, "说话人修正了最初的记忆，最后确认在图书馆桌下。"],
  ]],
  [3, "reading", "R2", "三篇短文的信息匹配", "先把人物需求划出来，再看哪篇短文提供该信息。不同问题可能选同一篇。", [
    ["Which home has a garden?", "A: Lily lives in a flat near the station. It has a balcony but no garden.\nB: Max lives in a small house. He grows flowers in the garden.\nC: Eva lives above a shop. Her room has a view of the sea.", ["Lily's home (A)", "Max's home (B)", "Eva's home (C)"], 1, "Max 的介绍提到在花园里种花。"],
    ["Who can see the sea from home?", "A: Lily lives in a flat near the station. It has a balcony but no garden.\nB: Max lives in a small house. He grows flowers in the garden.\nC: Eva lives above a shop. Her room has a view of the sea.", ["Lily (A)", "Max (B)", "Eva (C)"], 2, "Eva 的房间可以看到海；a view of 表示能看到的景色。"],
    ["Who lives close to the station?", "A: Lily lives in a flat near the station. It has a balcony but no garden.\nB: Max lives in a small house. He grows flowers in the garden.\nC: Eva lives above a shop. Her room has a view of the sea.", ["Lily (A)", "Max (B)", "Eva (C)"], 0, "Lily 的公寓 near the station。"],
  ]],
  [4, "listening", "L2", "听力笔记填空", "先看笔记需要地点、数字还是名字。答案要短，注意拼写。每段可听两遍或更多遍用于练习。", [
    ["School trip: destination = ___ (one word)", "Our school trip is on Friday. We are visiting the museum, not the zoo. Please meet outside the school at nine. Bring five pounds for lunch.", null, ["museum"], "目的地是 museum，zoo 被否定。"],
    ["School trip: meeting time = ___ o'clock", "Our school trip is on Friday. We are visiting the museum, not the zoo. Please meet outside the school at nine. Bring five pounds for lunch.", null, ["nine", "9"], "集合时间是 nine，即九点。"],
    ["School trip: lunch money = ___ pounds", "Our school trip is on Friday. We are visiting the museum, not the zoo. Please meet outside the school at nine. Bring five pounds for lunch.", null, ["five", "5"], "午餐需要五英镑。"],
  ]],
  [5, "reading", "R3", "读短文：细节与主旨", "读题后回到文章找证据。区分过去、现在以及作者的感受。", [
    ["Why did Nina start cycling to school?", "Nina used to take the bus to school. Last month her dad repaired an old bicycle for her. She decided to cycle because she wanted more exercise. The journey takes twenty minutes. Her friend Jo sometimes rides with her. When it rains heavily, Nina still takes the bus. She enjoys cycling because she can see the river on the way.", ["She wanted to do more exercise.", "There were no buses.", "Her friend bought her a bicycle."], 0, "原因是 wanted more exercise；自行车是爸爸修好的。"],
    ["What does Nina do in heavy rain?", "Nina used to take the bus to school. Last month her dad repaired an old bicycle for her. She decided to cycle because she wanted more exercise. The journey takes twenty minutes. Her friend Jo sometimes rides with her. When it rains heavily, Nina still takes the bus. She enjoys cycling because she can see the river on the way.", ["She stays home.", "She takes the bus.", "She walks by the river."], 1, "下大雨时 still takes the bus。"],
    ["What does Nina like about her journey?", "Nina used to take the bus to school. Last month her dad repaired an old bicycle for her. She decided to cycle because she wanted more exercise. The journey takes twenty minutes. Her friend Jo sometimes rides with her. When it rains heavily, Nina still takes the bus. She enjoys cycling because she can see the river on the way.", ["Buying a new bicycle", "Getting to school in five minutes", "Seeing the river"], 2, "最后一句解释喜欢沿途看到河流。"],
  ]],
  [6, "listening", "L3", "听对话：抓住约定和细节", "先确定人物、地点与任务，留意 but、instead、actually 后的更新信息。这里用单人 TTS 读出对话内容。", [
    ["Where will Tom and Anna meet?", "Tom says, Shall we meet at the sports centre? Anna says, It is too busy there. Let's meet outside the library instead. Tom says, Good idea. I'll bring my racket. Anna says, I already have a ball. The court costs six pounds for both of us.", ["At the sports centre", "Outside the library", "Inside the café"], 1, "Anna 提出改在图书馆外见面，Tom 同意了。"],
    ["What will Tom bring?", "Tom says, Shall we meet at the sports centre? Anna says, It is too busy there. Let's meet outside the library instead. Tom says, Good idea. I'll bring my racket. Anna says, I already have a ball. The court costs six pounds for both of us.", ["A ball", "A book", "A racket"], 2, "Tom 说 I'll bring my racket。"],
    ["How much does the court cost in total?", "Tom says, Shall we meet at the sports centre? Anna says, It is too busy there. Let's meet outside the library instead. Tom says, Good idea. I'll bring my racket. Anna says, I already have a ball. The court costs six pounds for both of us.", ["Six pounds", "Three pounds", "Twelve pounds"], 0, "six pounds for both of us 指两个人合计六英镑。"],
  ]],
  [7, "reading", "R4", "词汇选择填空", "先看整句含义，再检查选项搭配。这里把篇章空格拆成逐题练习。", [
    ["Choose the word for the gap.", "Our class went on a trip to the beach. The teacher asked us to ___ a picnic with us because there were no shops nearby.", ["bring", "borrow", "earn"], 0, "bring a picnic 表示带上野餐食物；另两个动词不符合这里的情境。"],
    ["Choose the word for the gap.", "We played volleyball on the sand. Everyone enjoyed the game, but we felt ___ after running for an hour.", ["empty", "tired", "crowded"], 1, "跑了一小时后感到疲倦 tired。"],
    ["Choose the word for the gap.", "Before we left, we put all our rubbish in a bin to keep the beach ___.", ["heavy", "expensive", "clean"], 2, "把垃圾放进垃圾桶是为了保持海滩干净 clean。"],
  ]],
  [8, "listening", "L4", "听出主旨和说话意图", "不需要记住每个词，先判断说话人是在建议、请求、道歉还是介绍。", [
    ["Why is the speaker calling?", "Hi Ben, it's Lucy. I'm sorry, but I can't come to your party tonight. I've got a bad cold. I hope you have a lovely evening.", ["To ask for the address", "To cancel a visit", "To invite Ben to dinner"], 1, "她说不能来参加聚会，是取消到访并道歉。"],
    ["What does the teacher want students to do?", "Please put your books away and listen carefully. I am going to explain tomorrow's trip. You do not need to write anything yet.", ["Start writing notes", "Read a new book", "Listen to the instructions"], 2, "老师要求先收书并听说明，还不需要写。"],
    ["What is the speaker doing?", "This is a lovely park for families. There is a playground for young children and a quiet path beside the lake. I really recommend visiting it.", ["Recommending a place", "Asking for directions", "Reporting a lost bag"], 0, "介绍公园优点并 recommend，是推荐地点。"],
  ]],
  [9, "reading", "R5", "邮件单词填空", "每个空只填一个词。检查冠词、代词、介词、连接词和时态。", [
    ["Fill the gap with ONE word.", "Hi Sam, Would you like to come ___ my house on Saturday?", null, ["to"], "come to my house，来我家，使用介词 to。"],
    ["Fill the gap with ONE word.", "We can watch a film. I have got ___ new DVD that I think you will enjoy.", null, ["a"], "单数可数名词 DVD 前需要冠词，new 以辅音音素开头用 a。"],
    ["Fill the gap with ONE word.", "Please tell me ___ you can come. I need to know before Friday. See you soon, Alex", null, ["if", "whether"], "tell me if/whether you can come，告诉我你是否能来。每个答案均为一个词。"],
  ]],
  [10, "listening", "L5", "人物与活动匹配", "先列出人名，再听每个人对应的活动。正式题中通常有多余选项；本组保留五个选项。", [
    ["What did Anna do at the weekend?", "Anna went swimming with her sister. Ben played football in the park. Cara read a book at home. Dan went cycling, and Eva visited the museum.", ["Swimming", "Football", "Reading", "Cycling", "Visiting a museum"], 0, "Anna went swimming。"],
    ["What did Cara do at the weekend?", "Anna went swimming with her sister. Ben played football in the park. Cara read a book at home. Dan went cycling, and Eva visited the museum.", ["Swimming", "Football", "Reading", "Cycling", "Visiting a museum"], 2, "Cara read a book，所以对应 Reading。"],
    ["What did Eva do at the weekend?", "Anna went swimming with her sister. Ben played football in the park. Cara read a book at home. Dan went cycling, and Eva visited the museum.", ["Swimming", "Football", "Reading", "Cycling", "Visiting a museum"], 4, "Eva visited the museum。"],
  ]],
  [11, "reading", "R1", "理解短语在生活中的含义", "短语动词要看整体含义。把告示中的要求与实际行动对应起来。", [
    ["What must you do before leaving?", "CLASSROOM: Turn off the lights before you go out.", ["Switch the lights off.", "Open all the windows.", "Leave the lights on."], 0, "turn off 是关闭灯。"],
    ["What should you write?", "Please fill in this form with your name and address.", ["A long story", "Your personal details", "The price of a ticket"], 1, "fill in 是填写；name and address 是个人信息。"],
    ["What has happened?", "The bus has broken down. Please wait here for another bus.", ["The bus has arrived early.", "The bus is full.", "The bus is not working."], 2, "break down 指交通工具出故障。"],
  ]],
  [12, "listening", "L3", "综合听力：时间与原因", "听两次：第一遍抓主旨，第二遍核实答案。做错后读解析，再重新听。", [
    ["When will the school concert be?", "The concert was planned for Friday, but our music teacher is ill. It will now be on Monday evening at seven. Tickets are three pounds. The money will help buy new instruments.", ["Friday evening", "Monday evening", "Sunday morning"], 1, "原计划 Friday，最终改为 Monday evening。"],
    ["Why was the concert date changed?", "The concert was planned for Friday, but our music teacher is ill. It will now be on Monday evening at seven. Tickets are three pounds. The money will help buy new instruments.", ["There were no tickets", "The hall was too small", "The music teacher was ill"], 2, "改期原因是音乐老师生病。"],
    ["What will the ticket money be used for?", "The concert was planned for Friday, but our music teacher is ill. It will now be on Monday evening at seven. Tickets are three pounds. The money will help buy new instruments.", ["New instruments", "A school bus", "Food for the teachers"], 0, "门票收入用于买新乐器 new instruments。"],
  ]],
];

export const skillLessons = raw.map(([unit, skill, examPart, title, rule, questions]) => ({
  id: `skill-${unit}`,
  unit,
  skill,
  examPart,
  title,
  minutes: 10,
  guide: { rule, example: "", caution: "自编专项训练，题量和呈现方式不等同于正式试卷。" },
  questions: questions.map(([prompt, content, options, answer, explanation], index) => ({
    id: `skill-${unit}-${index + 1}`,
    skill,
    examPart,
    prompt,
    ...(skill === "listening" ? { audio: content } : { passage: content }),
    ...(options ? { options, answer } : { type: "input", acceptedAnswers: answer }),
    explanation,
  })),
}));

const tasks = [
  ["向新笔友介绍自己", ["你的名字和年龄", "你住在哪里", "你喜欢什么"], "Hi Alex, My name is May and I am eleven. I live in a small town with my family. I love reading and playing tennis. Tell me about yourself!", ["What is your name?", "Where do you live?", "What do you like doing?"]],
  ["邀请朋友一起野餐", ["野餐的时间和地点", "你会带什么食物", "请朋友带什么"], "Hi Ben, Let's have a picnic in the park on Sunday at twelve. I will bring sandwiches and apples. Could you bring some water? I hope you can come!", ["What do you usually eat?", "Do you prefer eating at home or in a café? Why?", "What food would you take on a picnic?"]],
  ["描述你的新家", ["你的新家在哪里", "你最喜欢哪个房间", "邀请朋友来玩"], "Hi Lucy, We have moved to a house near the river. My favourite room is my bedroom because it has a big window. Please visit us on Saturday!", ["Tell me about your home.", "Which room do you like best? Why?", "What is near your home?"]],
  ["告诉朋友你的校园活动", ["你参加什么活动", "活动在何时举行", "你为什么喜欢它"], "Hi Jo, I have joined the school science club. We meet on Wednesday after lessons. I like it because we do interesting experiments. Would you like to join us?", ["What is your favourite subject? Why?", "Tell me about your school day.", "What do you do after school?"]],
  ["按顺序讲一次旅行", ["出发：上周六，你和家人乘火车出发", "经过：到达后，你们参观城堡", "结尾：回程时，你在火车上看照片"], "Last Saturday I went to a castle with my family. We travelled by train and arrived in the morning. We walked around the castle and took lots of photos. On the way home, I looked at the pictures. It was a great day.", ["How do you get to school?", "Tell me about a place you visited.", "Would you prefer a train or a bus trip? Why?"]],
  ["写信调整户外计划", ["原来打算做什么", "为什么改变计划", "新的安排是什么"], "Hi Sam, We planned to go to the beach tomorrow, but it is going to rain. Let's visit the museum instead. We can meet outside the library at ten. Is that OK?", ["What is the weather like today?", "What do you do when it rains?", "Do you prefer summer or winter? Why?"]],
  ["分享一次运动经历", ["开始：你与朋友到公园打球", "经过：球滚进了灌木丛，你们一起寻找", "结尾：找到球后继续玩"], "Yesterday I played football in the park with my friends. I kicked the ball too hard and it went into a bush. We looked for it together and finally found it. Then we played another game. We were tired but happy.", ["What sport do you like? Why?", "How often do you exercise?", "Is it better to play alone or with friends? Why?"]],
  ["讲述一次帮助朋友的经历", ["开始：朋友因为找不到包而担心", "经过：你们返回教室寻找", "结尾：找到包，朋友感到开心"], "My friend Lucy was worried because she could not find her bag. We went back to the classroom and looked under the desks. Her bag was next to a chair. She thanked me and we walked home together happily.", ["How do you feel today? Why?", "Tell me about your best friend.", "What makes a good friend?"]],
  ["向朋友推荐一个商店", ["商店的位置", "可以买到什么", "为什么推荐它"], "Hi Eva, There is a new bookshop next to the station. It sells books and stationery. The staff are friendly and the prices are low. Let's go there after school on Friday!", ["Where do you like shopping?", "Would you rather buy books or games? Why?", "Tell me about a job you would like to do."]],
  ["给朋友推荐周末活动", ["推荐什么活动", "活动的时间和地点", "为什么觉得朋友会喜欢"], "Hi Tom, There is a music festival in the park on Saturday afternoon. Several local bands are playing. You love live music, so I think you will enjoy it. Shall we go together?", ["What music do you like? Why?", "How do you use the internet for learning?", "Do you prefer books or films? Why?"]],
  ["有条理地讲一件意外", ["开始：你骑车去图书馆", "经过：自行车出了故障，你打电话求助", "结尾：家人接你回家并修好了车"], "On Sunday I was cycling to the library when my bicycle broke down. I stopped safely and called my dad. He picked me up and took me home. Later he repaired the bicycle. I thanked him and visited the library the next day.", ["What do you do when you need help?", "Tell me about a difficult day.", "Why is it important to help other people?"]],
  ["综合故事：一个意外的周末", ["开始：你和家人计划去海边", "经过：下雨了，你们改去博物馆", "结尾：你学到有趣的知识，度过快乐的一天"], "Last weekend my family planned to visit the beach. When we woke up, it was raining heavily. We decided to go to the museum instead. I learned about dinosaurs and took some photos. Although our plan changed, we had a wonderful day together.", ["Tell me about your last weekend.", "What would you like to do next weekend? Why?", "Discuss two activities with a partner and choose one together."]],
];
const storyUnits = new Set([5, 7, 8, 11, 12]);
export const productionTasks = tasks.map(([title, points, example, prompts], index) => ({
  id: `production-${index + 1}`,
  unit: index + 1,
  title,
  kind: storyUnits.has(index + 1) ? "story" : "email",
  minWords: storyUnits.has(index + 1) ? 35 : 25,
  points,
  example,
  speaking: prompts,
  speakingPart: index < 4 ? "S1" : "S2",
}));
