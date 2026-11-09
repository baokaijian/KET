// Parent Co-learn Script Cards (陪学台词卡库) for 6-year-old zero-literacy learning.
// Covers all 12 L0-L1 child themes and every stage (watch_listen, repeat, quiz_choice, sentences, story, wrapup).

export const STAGE_SCRIPTS = {
  watch_listen: {
    stage: "watch_listen",
    label: "看图听词",
    goal: "建立“图片—声音”直接连接，不要求认字或拼写",
    say: ["“听听看，小恐龙在说什么？”", "“你觉得这张图里是什么呀？”"],
    action: "用手指一指屏幕上的大图，微笑看着孩子",
    caution: "不要先替孩子说出中文意思；让他先听英文声音",
  },
  repeat: {
    stage: "repeat",
    label: "跟读开口",
    goal: "鼓励敢于开口模仿声音，建立发音自信",
    say: ["“我们一起大声跟它说一遍！”", "“哇，你的声音真响亮！”"],
    action: "夸张地张大口型，和孩子一起说",
    caution: "绝对不要纠正细微发音或批评“读错了”",
  },
  quiz_choice: {
    stage: "quiz_choice",
    label: "找一找（听辨）",
    goal: "听音辨认对应图片或词义",
    say: ["“你听到的是哪一个呢？”", "“没关系，我们再听一次声音。”"],
    action: "手掌摊开示意选择，把点按权完全交给孩子",
    caution: "现在轮到他了，先别说话，等 5 秒；答错不抢答",
  },
  sentences: {
    stage: "sentences",
    label: "短句听读",
    goal: "在生活短句里听出熟悉的单词",
    say: ["“这句里藏着刚才认识的词，你听到了吗？”", "“点小喇叭，我们慢一点听。”"],
    action: "跟着句子节奏轻轻点头",
    caution: "不要求孩子逐词翻译整句，听懂核心词即可",
  },
  story: {
    stage: "story",
    label: "绘本故事共读",
    goal: "像读睡前绘本一样享受英语小故事",
    say: ["“猜猜故事里发生了什么？”", "“遇到好奇的词，用小手点一点它！”"],
    action: "搂着孩子或并排坐，手指随着句子轻轻移动",
    caution: "不要把故事当成考试阅读理解，先享受情节",
  },
  wrapup: {
    stage: "wrapup",
    label: "收尾夸奖",
    goal: "正向情绪闭环，让孩子期待明天再来",
    say: ["“今天你自己找到了这么多新朋友！”", "“谢谢你陪爸爸/妈妈一起玩英语！”"],
    action: "和孩子击掌（High Five）或拥抱一下",
    caution: "只夸具体行为（如“听得很认真”“自己点对了”），不比分数",
  },
};

export const THEME_COLEARN_GUIDES = {
  breakfast: {
    themeId: "breakfast",
    title: "一起吃早餐",
    intro: "今天 10 分钟，重点是早餐桌上的常见食物词。你不需要会英语，跟着提示陪他看图听音即可。",
    wordFocus: "听懂 apple / banana / bread / milk 等早餐食物词",
    dailyAction: "明早吃早饭时，指着桌上的牛奶或面包问一句：What is this?",
  },
  animals: {
    themeId: "animals",
    title: "动物小伙伴",
    intro: "今天 10 分钟，一起认识农场和家里的小动物。你可以和孩子一起模仿小动物的动作！",
    wordFocus: "听懂 cat / dog / rabbit / duck 等动物词",
    dailyAction: "散步遇到小狗或看绘本时，和孩子玩“指动物说英文”游戏。",
  },
  school: {
    themeId: "school",
    title: "我的学校",
    intro: "今天 10 分钟，认识书包里的文具和学校伙伴。不用拼写，听懂声音就能玩。",
    wordFocus: "听懂 book / pencil / bag / desk 等学校物品词",
    dailyAction: "收拾书包时，让孩子递给你 a book 或 a pencil。",
  },
  family: {
    themeId: "family",
    title: "我爱我的家",
    intro: "今天 10 分钟，认识家庭成员称呼。用家里人的照片或互相指认最有趣！",
    wordFocus: "听懂 mother / father / sister / brother 等家人词",
    dailyAction: "看着全家福照片，让孩子指一指 who is mother / father。",
  },
  home: {
    themeId: "home",
    title: "房间里的发现",
    intro: "今天 10 分钟，探索家里的门窗、桌椅和小床。学完可以在房间里实地找一找。",
    wordFocus: "听懂 room / door / window / bed / lamp 等家居词",
    dailyAction: "睡前关灯时，和孩子一起指一指 the lamp 和 the bed。",
  },
  park: {
    themeId: "park",
    title: "公园探险",
    intro: "今天 10 分钟，认识公园里的花草树木和跑跳动作。可以边听边做动作！",
    wordFocus: "听懂 park / tree / flower / run / jump 等户外词",
    dailyAction: "听到 run / jump / walk 时，和孩子一起原地做动作。",
  },
  clothes: {
    themeId: "clothes",
    title: "今天穿什么",
    intro: "今天 10 分钟，认识日常穿的衣服鞋帽。你不需要教拼写，指着身上的衣服最直观。",
    wordFocus: "听懂 shirt / coat / hat / shoe / sock 等穿戴词",
    dailyAction: "出门穿鞋穿外套时，顺口说出 shoe 和 coat。",
  },
  body: {
    themeId: "body",
    title: "照顾好自己",
    intro: "今天 10 分钟，认识身体部位。可以边听边玩“指鼻子指眼睛”的小游戏！",
    wordFocus: "听懂 hand / head / eye / ear / mouth / nose 等身体词",
    dailyAction: "和孩子玩 Simon Says：听到 nose 就摸摸自己的鼻子。",
  },
  weather: {
    themeId: "weather",
    title: "窗外的天气",
    intro: "今天 10 分钟，看看窗外的晴雨风雪。引导孩子观察大自然的变化。",
    wordFocus: "听懂 sun / rain / snow / wind / cloud 等天气词",
    dailyAction: "早上拉开窗帘时，一起看看今天是 sun 还是 cloud。",
  },
  shopping: {
    themeId: "shopping",
    title: "一起去买东西",
    intro: "今天 10 分钟，体验超市购物场景。可以扮演店员和顾客玩过家家。",
    wordFocus: "听懂 shop / buy / fruit / bag 等购物词",
    dailyAction: "去超市买水果时，让孩子帮忙挑一个 apple 放进 bag。",
  },
  travel: {
    themeId: "travel",
    title: "安全出行",
    intro: "今天 10 分钟，认识公交、火车、自行车与过马路安全。贴近每天的出行。",
    wordFocus: "听懂 bus / bicycle / car / train / stop 等出行词",
    dailyAction: "过马路等红灯时，和孩子轻轻说一声 stop。",
  },
  day: {
    themeId: "day",
    title: "快乐的一天",
    intro: "今天 10 分钟，跟随早晨、下午到夜晚的时间线，回顾快乐的一天。",
    wordFocus: "听懂 morning / afternoon / evening / night 等时间词",
    dailyAction: "早上起床说 Good morning，睡前说 Good night。",
  },
};

export function getColearnScriptForStage(stageKey, themeId = "breakfast", currentWord = null) {
  const base = STAGE_SCRIPTS[stageKey] || STAGE_SCRIPTS.watch_listen;
  const themeGuide = THEME_COLEARN_GUIDES[themeId] || THEME_COLEARN_GUIDES.breakfast;
  if (stageKey === "watch_listen" && currentWord) {
    return {
      ...base,
      goal: `听懂 ${currentWord.word}（${currentWord.translation}）`,
      say: [
        `“你听到的是${currentWord.translation}吗？”`,
        `“我们一起跟着小恐龙说一遍：${currentWord.word}。”`,
      ],
      action: "手指图片主体，等孩子看清后再点发音",
    };
  }
  if (stageKey === "quiz_choice" && currentWord) {
    return {
      ...base,
      goal: `听辨并找出 ${currentWord.word}`,
      say: [
        "“你听到的是哪一个？用小手点一点。”",
        "“没关系，我们再听一次声音。”",
      ],
      action: "手掌摊开示意，先别说话，等 5 秒让孩子自己选",
    };
  }
  return {
    ...base,
    goal: base.goal || themeGuide.wordFocus,
    themeIntro: themeGuide.intro,
    dailyAction: themeGuide.dailyAction,
  };
}
