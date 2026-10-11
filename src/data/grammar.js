const raw = [
  ["be", 1, "介绍自己：be 动词", "I am ten. She is my friend.", "I 用 am；he、she、it 用 is；you、we、they 用 are。否定在 be 后加 not，疑问把 be 放前面。", "不要说 I is 或 She are。", [
    ["I ___ twelve years old.", ["am", "is", "are"], 0, "I 和 am 搭配。"],
    ["My friends ___ in the classroom.", ["is", "are", "am"], 1, "friends 是复数，使用 are。"],
    ["___ she your sister?", ["Do", "Are", "Is"], 2, "she 使用 is；提问时 Is 放句首。"],
  ]],
  ["pronouns", 1, "我、你、他和他们的东西", "This is my bag. That bag is hers.", "I、he、she 等作主语；me、him、her 等作宾语。my、your、her 后接名词；mine、yours、hers 独立使用。", "its 表示它的；it's 是 it is 或 it has 的缩写。", [
    ["Anna is a girl. ___ is my friend.", ["He", "She", "They"], 1, "题目说明 Anna 是女孩，用 She。"],
    ["Please help ___ with this box. I cannot carry it.", ["I", "my", "me"], 2, "help 后需要宾格 me。"],
    ["This pencil belongs to me. It is ___.", ["mine", "my", "me"], 0, "句末不跟名词，用独立的物主代词 mine。"],
  ]],
  ["articles", 2, "一个还是一些：冠词与名词", "An apple, a banana and some bread.", "a/an 用于单数可数名词；以元音音素开头用 an。bread、milk 等通常不可数，可以用 some 或 a piece/glass of。the 指特定的、双方知道的事物。", "不是只看字母：an hour，但 a university。", [
    ["Can I have ___ apple, please?", ["a", "an", "two"], 1, "apple 以元音音素开头，用 an。"],
    ["There is some ___ in the bottle.", ["milks", "a milk", "milk"], 2, "milk 通常不可数，不加复数 s。"],
    ["I bought a book. ___ book is about space.", ["The", "An", "A"], 0, "第二次提到已经知道的那本书，用 The。"],
  ]],
  ["quantities", 2, "问数量：some、any、much、many", "How many apples? How much water?", "many 配可数名词复数，much 配不可数名词。some 常用于肯定句，any 常用于否定和疑问。请求或提供东西时，疑问句也可用 some。", "a few 是几个；a little 是一点；few/little 不带 a 时通常强调少得不够。", [
    ["How ___ bananas do you need?", ["much", "many", "any"], 1, "bananas 可数且为复数，用 many。"],
    ["We haven't got ___ cheese.", ["many", "a", "any"], 2, "否定句中，不可数名词 cheese 可用 any。"],
    ["Could I have ___ water, please?", ["some", "many", "a few"], 0, "礼貌请求可用 some；water 不可数。"],
  ]],
  ["there", 3, "描述房间：there is / there are", "There is a bed. There are two chairs.", "There is 后接单数或不可数名词；There are 后接复数。疑问句用 Is there / Are there。have 表示某人拥有，不要与 there be 混用。", "不要说 There have a table。", [
    ["There ___ two windows in my room.", ["is", "are", "am"], 1, "two windows 是复数，用 are。"],
    ["___ there a garden behind the house?", ["Do", "Are", "Is"], 2, "a garden 是单数，用 Is there。"],
    ["There ___ some water in the glass.", ["is", "are", "have"], 0, "water 不可数，用 is。"],
  ]],
  ["place", 3, "物品在哪里：位置介词", "The bag is under the table.", "in 在里面；on 在表面上；under 在下面；behind 在后面；between 在两者之间；next to 紧挨着。先找到参照物，再描述位置。", "in front of 在外部前面；in the front of 是在内部前部。", [
    ["The picture is hanging ___ the wall.", ["under", "on", "between"], 1, "挂在墙面上，用 on。"],
    ["The café is ___ the bank and the bookshop.", ["under", "in", "between"], 2, "在两处之间，用 between...and...。"],
    ["The keys are ___ the closed drawer.", ["in", "on", "above"], 0, "关闭的抽屉内部，用 in。"],
  ]],
  ["present", 4, "每天做什么：一般现在时", "I walk to school. Ben walks to school.", "习惯和事实用一般现在时。he/she/it 的肯定句动词常加 s/es；否定用 doesn't + 原形，提问用 Does + 主语 + 原形。", "有 does/doesn't 后，不要再给主要动词加 s。", [
    ["My sister ___ English every day.", ["study", "studies", "studying"], 1, "my sister 为第三人称单数；study 变 studies。"],
    ["He doesn't ___ coffee.", ["drinks", "drinking", "drink"], 2, "doesn't 后用动词原形 drink。"],
    ["___ your brother like science?", ["Does", "Do", "Is"], 0, "第三人称单数的一般现在时疑问用 Does。"],
  ]],
  ["frequency", 4, "多久一次：频率与时间介词", "I usually read at night. I play on Monday.", "always、usually、often、sometimes、never 通常放在主要动词前、be 后。at 配时刻；on 配日期和星期；in 配月份、年份和较长时段。", "in the morning，但 at night；on Monday morning。", [
    ["The lesson starts ___ nine o'clock.", ["in", "at", "on"], 1, "具体时刻用 at。"],
    ["We go swimming ___ Saturdays.", ["at", "in", "on"], 2, "星期用 on。"],
    ["She ___ late for school.", ["is never", "never is", "never be"], 0, "never 通常位于 be 动词之后。"],
  ]],
  ["past", 5, "昨天的旅行：一般过去时", "We visited the museum yesterday.", "已结束的过去事件用过去式。规则动词常加 ed；go→went，buy→bought。否定用 didn't + 原形，疑问用 Did + 原形；be 的过去式为 was/were。", "不要说 didn't went；应说 didn't go。", [
    ["We ___ to London last weekend.", ["go", "went", "going"], 1, "last weekend 是过去，go 的过去式是 went。"],
    ["I didn't ___ a ticket yesterday.", ["bought", "buying", "buy"], 2, "didn't 后用原形 buy。"],
    ["___ you visit the castle last year?", ["Did", "Do", "Are"], 0, "last year 表示过去；疑问用 Did。"],
  ]],
  ["past-continuous", 5, "当时正在做：过去进行时", "I was walking when it started to rain.", "was/were + 动词 ing 表示过去某时正在进行的动作。较长动作常用过去进行时，打断它的短动作常用一般过去时。", "I/he/she/it 用 was；you/we/they 用 were。", [
    ["At eight last night, we ___ dinner.", ["have", "were having", "are having"], 1, "过去具体时间正在进行，用 were having。"],
    ["I was reading when the phone ___.", ["ring", "was ring", "rang"], 2, "打断读书的电话铃声用过去式 rang。"],
    ["She ___ waiting at the bus stop at six yesterday.", ["was", "were", "is"], 0, "she 与 was 搭配，表示过去正在等待。"],
  ]],
  ["future", 6, "明天的计划：going to 与 will", "We are going to have a picnic. I'll help you.", "be going to 常表达已有计划或明显迹象；will 常用于当场决定、承诺或预测。动词保持原形。", "I'm going to visit...，不是 I'm going visit...。", [
    ["We have decided: we ___ visit the lake tomorrow.", ["going", "are going to", "went"], 1, "已有决定，用 are going to + visit。"],
    ["Your bag looks heavy. I ___ carry it for you.", ["am", "did", "will"], 2, "当场提出帮助，用 will。"],
    ["Look at those dark clouds! It is going to ___.", ["rain", "rains", "raining"], 0, "going to 后用动词原形 rain。"],
  ]],
  ["condition", 6, "如果下雨：零与第一条件句", "If it rains tomorrow, we will stay home.", "普遍事实：if + 现在时，主句现在时。真实的未来可能：if + 现在时，主句 will + 原形。", "第一条件句的 if 部分通常不用 will。", [
    ["If it ___ tomorrow, we will take an umbrella.", ["will rain", "rains", "rained"], 1, "if 条件中用现在时 rains。"],
    ["If you heat ice, it ___.", ["melted", "is melt", "melts"], 2, "描述普遍事实，使用现在时 melts。"],
    ["If it is sunny, we ___ go to the beach.", ["will", "were", "did"], 0, "真实未来条件的主句可用 will + 原形。"],
  ]],
  ["continuous", 7, "现在在做什么：现在进行时", "They are playing tennis now.", "am/is/are + 动词 ing 描述现在或当前阶段正在进行的动作。now、Look! 常提示正在发生。习惯通常用一般现在时。", "read→reading；swim→swimming；make→making。", [
    ["Look! The children ___ football.", ["play", "are playing", "plays"], 1, "Look! 提示眼前正在发生，使用 are playing。"],
    ["I ___ a book at the moment.", ["read", "reads", "am reading"], 2, "at the moment 表示此刻；I 用 am reading。"],
    ["Ben usually ___ on Sundays.", ["swims", "is swim", "swimming"], 0, "usually 表示习惯，Ben 用一般现在时 swims。"],
  ]],
  ["gerunds", 7, "表达爱好：动名词和不定式", "I enjoy swimming. I want to learn tennis.", "enjoy 后常接动词 ing；want、would like 后接 to + 原形；like、love 后可接 ing 或 to + 原形。介词之后动词常用 ing。", "enjoy doing，不是 enjoy to do；want to do，不是 want doing。", [
    ["I enjoy ___ badminton.", ["play", "playing", "to play"], 1, "enjoy 后用动名词 playing。"],
    ["She wants ___ a sports club.", ["join", "joining", "to join"], 2, "want 后接 to + 原形。"],
    ["Thank you for ___ me.", ["helping", "help", "to help"], 0, "介词 for 后用 helping。"],
  ]],
  ["comparison", 8, "比较事物：比较级与最高级", "This bag is heavier. It is the heaviest bag.", "短形容词常加 er/est；长形容词常用 more/most。比较级常跟 than；最高级常用 the。good→better→best，bad→worse→worst。", "不要说 more better；better 已经是比较级。", [
    ["This book is ___ than that one.", ["interesting", "more interesting", "most interesting"], 1, "有 than，比两本书，用 more interesting。"],
    ["Tom is the ___ boy in his class.", ["taller", "tall", "tallest"], 2, "全班范围的最高级用 tallest。"],
    ["My results are ___ than last year.", ["better", "best", "good"], 0, "good 的比较级是 better。"],
  ]],
  ["adverbs", 8, "感受与方式：形容词和副词", "The film is exciting. She sings beautifully.", "形容词描述人或事物；副词描述动作。很多副词由形容词加 ly。excited 是人的感受，exciting 是令人兴奋的事物；good 的副词是 well。", "描述自己的无聊感用 bored，不能说 I'm boring 来表达我很无聊。", [
    ["This lesson is interesting. I am very ___.", ["interesting", "interested", "interest"], 1, "人的兴趣感受用 interested。"],
    ["Please drive ___.", ["careful", "care", "carefully"], 2, "修饰 drive 的方式，用副词 carefully。"],
    ["She plays the piano very ___.", ["well", "good", "betterest"], 0, "修饰 plays 用 well。"],
  ]],
  ["modals", 9, "请求和建议：can、could、should", "Could I try it on? You should rest.", "can/could 表示能力或请求，could 常更礼貌；should 表示建议。情态动词后接原形，不因主语变化加 s。", "She can swim，不是 She cans swims。", [
    ["___ I try on this coat, please?", ["Does", "Could", "Am"], 1, "Could I...? 是礼貌请求。"],
    ["You look tired. You ___ have a rest.", ["are", "did", "should"], 2, "给建议用 should。"],
    ["My little brother can ___ well.", ["swim", "swims", "swimming"], 0, "can 后用原形 swim。"],
  ]],
  ["obligation", 9, "规则与义务：must / have to", "You mustn't run here. You don't have to pay.", "must/have to 表示必须；mustn't 表示禁止；don't have to 表示不必，不是禁止。过去的必要通常用 had to。", "mustn't 和 don't have to 含义相反，不要混淆。", [
    ["It is free. You ___ pay.", ["mustn't", "don't have to", "must"], 1, "免费意味着不必支付，用 don't have to。"],
    ["The sign says NO PHOTOS. You ___ take photos.", ["don't have to", "can", "mustn't"], 2, "禁止拍照用 mustn't。"],
    ["Yesterday I ___ get up early for work.", ["had to", "have to", "must to"], 0, "过去的必要用 had to。"],
  ]],
  ["perfect", 10, "经历和变化：现在完成时", "I have visited London. She has just arrived.", "have/has + 过去分词表示经历或与现在相关的过去。ever、never、just、already、yet 常用于完成时。明确已结束时间 yesterday/last year 通常用过去时。", "go 的过去分词是 gone；经历去过并返回常用 been to。", [
    ["Have you ever ___ to London?", ["went", "been", "go"], 1, "询问去过的经历，用 have been to。"],
    ["She has just ___ her homework.", ["finish", "finishing", "finished"], 2, "has 后用过去分词 finished。"],
    ["I ___ that film yesterday.", ["watched", "have watched", "watching"], 0, "yesterday 是已结束时间，用一般过去时。"],
  ]],
  ["relative", 10, "把句子连起来：who / which / that", "This is the teacher who helped me.", "who 常指人，which 常指物；that 可在限定性从句中指人或物。用小句说明是哪一个人或东西。", "从句修饰紧邻的名词，先确定说的是人还是物。", [
    ["This is the girl ___ won the race.", ["which", "who", "where"], 1, "girl 是人，用 who。"],
    ["I found the book ___ you wanted.", ["who", "where", "which"], 2, "book 是物，用 which。"],
    ["The boy who ___ next door is my friend.", ["lives", "live", "living"], 0, "who 指单数 the boy，谓语用 lives。"],
  ]],
  ["phrasal", 11, "短语动词：别逐字翻译", "Please turn it off. We get on the bus.", "短语动词由动词和小词组合，含义常与单个词不同。turn off 关闭；get on 上车；look after 照顾。可分的短语遇代词时，代词常放中间。", "turn it off，而不是 turn off it；look after 不拆开。", [
    ["The light is on. Please turn ___ off.", ["off", "it", "on"], 1, "代词 it 放 turn 和 off 之间。"],
    ["We get ___ the bus at the station and travel home.", ["up", "out", "on"], 2, "get on the bus 表示上公共汽车。"],
    ["My aunt will look ___ our cat while we are away.", ["after", "at", "out"], 0, "look after 表示照顾。"],
  ]],
  ["linking", 11, "说清关系：and、but、because、so", "I stayed home because I was ill.", "and 表并列；but 表转折；because 引出原因；so 引出结果。before/after 表时间先后。写作时可用这些词把短句连起来。", "一个简单句中通常不把 because 和 so 同时用来连接同一因果关系。", [
    ["I took an umbrella ___ it was raining.", ["but", "because", "or"], 1, "下雨是带伞的原因，用 because。"],
    ["The café was closed, ___ we went to another one.", ["because", "and not", "so"], 2, "去另一家是结果，用 so。"],
    ["I like football, ___ I don't like tennis.", ["but", "because", "so"], 0, "两个喜好形成对比，用 but。"],
  ]],
  ["questions", 12, "提问与互动：疑问句和建议", "What did you do? Shall we go together?", "what 问事情，where 问地点，when 问时间，why 问原因，whose 问所属。Let's + 原形、Shall we + 原形、How about + ing 可提出建议。", "提问时注意时态：What did you do? 而不是 What did you did?", [
    ["___ bag is this? It belongs to Lucy.", ["Who", "Whose", "Which's"], 1, "询问所属关系用 Whose。"],
    ["How about ___ to the park?", ["go", "to go", "going"], 2, "How about 后接动名词 going。"],
    ["What did you ___ last weekend?", ["do", "did", "done"], 0, "did 后用动词原形 do。"],
  ]],
  ["review", 12, "综合检查：时态和搭配", "I usually walk, but yesterday I took a bus.", "读完整句，先找时间线索，再看主语和固定搭配。检查冠词、介词、动词形式和单复数。不要只根据空格附近的一个词猜。", "every day、now、yesterday、ever 分别提示习惯、进行、过去或经历；仍需结合上下文。", [
    ["I usually walk to school, but yesterday I ___ a bus.", ["take", "took", "am taking"], 1, "yesterday 表示过去，take→took。"],
    ["Would you like ___ us for lunch?", ["join", "joining", "to join"], 2, "would like 后接 to + 原形。"],
    ["There aren't ___ chairs for everyone. We need more.", ["enough", "much", "a"], 0, "句意是椅子不够，用 enough。"],
  ]],
];

export const grammarLessons = raw.map(([key, unit, title, example, rule, caution, questions]) => ({
  id: `grammar-${key}`,
  unit,
  title,
  skill: "grammar",
  minutes: 8,
  guide: { rule, example, caution },
  questions: questions.map(([prompt, options, answer, explanation], index) => ({
    id: `grammar-${key}-${index + 1}`,
    skill: "grammar",
    prompt,
    options,
    answer,
    explanation,
  })),
}));
