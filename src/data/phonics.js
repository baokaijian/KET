/**
 * Phonics (自然拼读) Engine for 6-Year-Old First-Grade KET Learners
 *
 * Breaks English words into color-coded grapheme-phoneme chunks (发音积木),
 * explains phonics rules in kid-friendly language, links Word Families (发音好朋友)
 * to replace rote letter-by-letter memorization, and generates tap-to-blend puzzles.
 */

export const WORD_FAMILIES = {
  short_a: {
    id: "short_a",
    pattern: "a · 大口 /æ/",
    tip: "嘴巴张大像咬大苹果：a-a-apple！",
    words: ["apple", "cat", "hat", "bag", "hand", "lamp", "dad", "man"],
  },
  short_e: {
    id: "short_e",
    pattern: "e / ea · 微笑 /e/",
    tip: "嘴角微微笑，短促有力读 /e/！",
    words: ["egg", "bed", "desk", "pen", "pencil", "leg", "bread", "head"],
  },
  short_i: {
    id: "short_i",
    pattern: "i · 小鱼吐泡 /ɪ/",
    tip: "短促轻快读 /ɪ/，像小鱼在水里游！",
    words: ["milk", "fish", "sister", "dinner", "ticket", "wind", "drink"],
  },
  short_o: {
    id: "short_o",
    pattern: "o · 圆嘴 /ɒ/",
    tip: "嘴巴圆圆发短音 /ɒ/！",
    words: ["dog", "sock", "shop", "stop", "hot", "clock", "doctor", "box"],
  },
  short_u: {
    id: "short_u",
    pattern: "u / o · 小伞 /ʌ/",
    tip: "像撑开小雨伞，轻松短促发 /ʌ/！",
    words: ["sun", "bus", "duck", "run", "jump", "lunch", "mother", "brother"],
  },
  magic_e: {
    id: "magic_e",
    pattern: "a_e / i_e / o_e · 魔法结尾 e",
    tip: "词尾的小 e 不出声，把能量送给前面的元音读字母本音！",
    words: ["cake", "plate", "name", "make", "nose", "price", "nice", "time", "bicycle"],
  },
  ai_ay: {
    id: "ai_ay",
    pattern: "ai / ay · 小尾巴 /eɪ/",
    tip: "ai 在词中、ay 在词尾，手拉手一起读字母 A 的名字 /eɪ/！",
    words: ["rain", "train", "play", "pay", "day", "always", "say"],
  },
  ee_ea: {
    id: "ee_ea",
    pattern: "ee / ea · 长音 /iː/",
    tip: "ee 和 ea 是好朋友，笑眯眯拉长声音读 /iː/！",
    words: ["tree", "sleep", "cheese", "evening", "meat", "tea", "teacher", "eat"],
  },
  oo_family: {
    id: "oo_family",
    pattern: "oo · 双圆眼镜",
    tip: "两个圆圆的 o 像眼镜：在 book 里短促，在 room/school 里拉长音！",
    words: ["book", "look", "room", "school", "afternoon", "noon", "food", "foot"],
  },
  ou_ow: {
    id: "ou_ow",
    pattern: "ou / ow · 大老虎 /aʊ/ 与雪花 /əʊ/",
    tip: "cow/cloud/house/mouth 张大嘴读 /aʊ/；snow/window 轻轻收圆嘴读 /əʊ/！",
    words: ["cow", "cloud", "house", "mouth", "snow", "window", "flower"],
  },
  ar_family: {
    id: "ar_family",
    pattern: "ar · 小汽车 /ɑː/",
    tip: "ar 在一起，像看牙医张大嘴巴：ar-ar-car！",
    words: ["car", "park", "arm", "carrot", "farm", "dark"],
  },
  ir_er_ur: {
    id: "ir_er_ur",
    pattern: "ir / er / ur · 小鸟卷舌音",
    tip: "ir、er、ur 常常发相似的卷舌音，舌尖轻轻翘起来！",
    words: ["bird", "shirt", "skirt", "girl", "nurse", "teacher", "water", "father"],
  },
  or_family: {
    id: "or_family",
    pattern: "or · 小马跑 /ɔː/",
    tip: "or 组合嘴巴圆圆拉长音：or-or-horse！",
    words: ["horse", "morning", "door", "doctor", "fork", "short"],
  },
  sh_ch_ck: {
    id: "sh_ch_ck",
    pattern: "sh / ch / ck · 辅音好搭档",
    tip: "sh 嘘嘘安静，ch 小火车开动，ck 词尾清脆发 /k/！",
    words: ["shirt", "shoe", "shop", "fish", "chair", "cheese", "chicken", "duck", "sock"],
  },
};

// Explicit curated phonics breakdowns for the 95 child theme words + starter/health/food words
const CURATED_PHONICS = {
  // Theme 1: Breakfast & Food
  apple: {
    chunks: [
      { text: "a", kind: "vowel", hint: "大口短音 /æ/" },
      { text: "pp", kind: "consonant", hint: "双写只发一次 /p/" },
      { text: "le", kind: "silent", hint: "词尾舌尖抵住读 /l/" },
    ],
    rule: "a 张大嘴巴读短音，pp 双写只发一次 /p/，词尾 le 轻轻读 /l/。",
    familyId: "short_a",
  },
  banana: {
    chunks: [
      { text: "ba", kind: "consonant", hint: "轻读 /bə/" },
      { text: "na", kind: "vowel", hint: "重读大口 /nɑː/ 或 /næ/" },
      { text: "na", kind: "consonant", hint: "轻读 /nə/" },
    ],
    rule: "三拍节奏词：轻-重-轻（ba-NA-na），中间的 na 最响亮！",
    familyId: "short_a",
  },
  bread: {
    chunks: [
      { text: "br", kind: "digraph", hint: "辅音连缀 /br/" },
      { text: "ea", kind: "vowel", hint: "此处发短音 /e/" },
      { text: "d", kind: "consonant", hint: "尾音 /d/" },
    ],
    rule: "ea 在 bread 和 head 里不读长音，而是微笑短音 /e/ 哦！",
    familyId: "short_e",
  },
  milk: {
    chunks: [
      { text: "m", kind: "consonant", hint: "闭嘴鼻音 /m/" },
      { text: "i", kind: "vowel", hint: "短元音 /ɪ/" },
      { text: "lk", kind: "digraph", hint: "舌尖上翘接 /lk/" },
    ],
    rule: "短元音 i 夹在中间，m-i-lk 顺滑连读。",
    familyId: "short_i",
  },
  egg: {
    chunks: [
      { text: "e", kind: "vowel", hint: "微笑短音 /e/" },
      { text: "gg", kind: "consonant", hint: "双写发一个 /ɡ/" },
    ],
    rule: "e 发微笑短音 /e/，两个 g 合在一起只发一次 /ɡ/。",
    familyId: "short_e",
  },
  cheese: {
    chunks: [
      { text: "ch", kind: "digraph", hint: "小火车 /tʃ/" },
      { text: "ee", kind: "vowel", hint: "长元音 /iː/" },
      { text: "se", kind: "silent", hint: "词尾读 /z/，e 不出声" },
    ],
    rule: "拍照为什么要说 cheese？因为中间的 ee 让你露出笑眯眯长音 /iː/！",
    familyId: "ee_ea",
  },
  juice: {
    chunks: [
      { text: "j", kind: "consonant", hint: "发 /dʒ/" },
      { text: "ui", kind: "vowel", hint: "组合发长音 /uː/" },
      { text: "ce", kind: "silent", hint: "ce 在词尾发 /s/" },
    ],
    rule: "ui 合体发 /uː/，词尾的 ce 像小蛇吐信发 /s/。",
    familyId: "magic_e",
  },
  water: {
    chunks: [
      { text: "w", kind: "consonant", hint: "圆唇 /w/" },
      { text: "a", kind: "vowel", hint: "在 w 后读 /ɔː/" },
      { text: "t", kind: "consonant", hint: "清脆 /t/" },
      { text: "er", kind: "r-vowel", hint: "词尾轻读 /ə(r)/" },
    ],
    rule: "a 遇到前面的 w 会变成圆嘴音 /ɔː/，词尾 er 轻轻带过。",
    familyId: "ir_er_ur",
  },
  cake: {
    chunks: [
      { text: "c", kind: "consonant", hint: "发 /k/" },
      { text: "a", kind: "vowel", hint: "字母本音 /eɪ/" },
      { text: "k", kind: "consonant", hint: "发 /k/" },
      { text: "e", kind: "silent", hint: "魔法 e 不发音" },
    ],
    rule: "经典魔法 e（a_e）：词尾 e 不出声，让中间的 a 读自己的名字 /eɪ/！",
    familyId: "magic_e",
  },
  carrot: {
    chunks: [
      { text: "c", kind: "consonant", hint: "发 /k/" },
      { text: "arr", kind: "r-vowel", hint: "发 /ær/" },
      { text: "ot", kind: "vowel", hint: "词尾轻读 /ət/" },
    ],
    rule: "分两拍记：car + rot，跟 rabbit（兔子）一样都有双写辅音！",
    familyId: "ar_family",
  },
  chicken: {
    chunks: [
      { text: "ch", kind: "digraph", hint: "小火车 /tʃ/" },
      { text: "i", kind: "vowel", hint: "短音 /ɪ/" },
      { text: "ck", kind: "digraph", hint: "ck 合发 /k/" },
      { text: "en", kind: "vowel", hint: "轻读 /ɪn/" },
    ],
    rule: "两拍积木：chick（小鸡）+ en = chicken！",
    familyId: "sh_ch_ck",
  },
  potato: {
    chunks: [
      { text: "po", kind: "consonant", hint: "轻读 /pə/" },
      { text: "ta", kind: "vowel", hint: "重读字母音 /teɪ/" },
      { text: "to", kind: "vowel", hint: "词尾读 /təʊ/" },
    ],
    rule: "三拍节奏词：po-TA-to，中间的 ta 读字母 A 的本音 /eɪ/！",
    familyId: "ai_ay",
  },
  rice: {
    chunks: [
      { text: "r", kind: "consonant", hint: "卷舌 /r/" },
      { text: "i", kind: "vowel", hint: "字母本音 /aɪ/" },
      { text: "c", kind: "consonant", hint: "遇到 e 发 /s/" },
      { text: "e", kind: "silent", hint: "魔法 e 不发音" },
    ],
    rule: "i_e 魔法组合：i 读本音 /aɪ/，c 遇到 e 变温柔发 /s/（和 nice、price 一样）！",
    familyId: "magic_e",
  },
  soup: {
    chunks: [
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "ou", kind: "vowel", hint: "此处发长音 /uː/" },
      { text: "p", kind: "consonant", hint: "发 /p/" },
    ],
    rule: "喝热汤吹气呼呼 /uː/：s-ou-p！",
    familyId: "oo_family",
  },

  // Theme 2: Animals
  cat: {
    chunks: [
      { text: "c", kind: "consonant", hint: "清脆 /k/" },
      { text: "a", kind: "vowel", hint: "大口 /æ/" },
      { text: "t", kind: "consonant", hint: "舌尖 /t/" },
    ],
    rule: "最经典的三明治词（CVC）：c-a-t，换个头就能变成 hat（帽子）！",
    familyId: "short_a",
  },
  dog: {
    chunks: [
      { text: "d", kind: "consonant", hint: "发 /d/" },
      { text: "o", kind: "vowel", hint: "圆嘴短音 /ɒ/" },
      { text: "g", kind: "consonant", hint: "发 /ɡ/" },
    ],
    rule: "三明治短音词：d-o-g，中间的 o 嘴巴圆圆。",
    familyId: "short_o",
  },
  rabbit: {
    chunks: [
      { text: "r", kind: "consonant", hint: "发 /r/" },
      { text: "a", kind: "vowel", hint: "大口 /æ/" },
      { text: "bb", kind: "consonant", hint: "双写发一个 /b/" },
      { text: "i", kind: "vowel", hint: "短音 /ɪ/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "两只长耳朵就像中间的两个 bb：rab + bit = rabbit！",
    familyId: "short_a",
  },
  fish: {
    chunks: [
      { text: "f", kind: "consonant", hint: "咬唇 /f/" },
      { text: "i", kind: "vowel", hint: "短音 /ɪ/" },
      { text: "sh", kind: "digraph", hint: "安静嘘声 /ʃ/" },
    ],
    rule: "小鱼游水静悄悄，词尾 sh 发轻轻的嘘声 /ʃ/！",
    familyId: "sh_ch_ck",
  },
  bird: {
    chunks: [
      { text: "b", kind: "consonant", hint: "发 /b/" },
      { text: "ir", kind: "r-vowel", hint: "小鸟卷舌音 /ɜː/" },
      { text: "d", kind: "consonant", hint: "尾音 /d/" },
    ],
    rule: "记住小鸟音 ir /ɜː/，看到 shirt、skirt、girl 全都会读啦！",
    familyId: "ir_er_ur",
  },
  duck: {
    chunks: [
      { text: "d", kind: "consonant", hint: "发 /d/" },
      { text: "u", kind: "vowel", hint: "短元音 /ʌ/" },
      { text: "ck", kind: "digraph", hint: "词尾合发 /k/" },
    ],
    rule: "短元音后常用 ck 收尾，两个字母只发一次清脆的 /k/！",
    familyId: "short_u",
  },
  horse: {
    chunks: [
      { text: "h", kind: "consonant", hint: "呵气 /h/" },
      { text: "or", kind: "r-vowel", hint: "长音 /ɔː/" },
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "e", kind: "silent", hint: "词尾 e 不发音" },
    ],
    rule: "or 组合发圆嘴长音 /ɔː/（和 morning 一样），词尾 e 安静不说话。",
    familyId: "or_family",
  },
  cow: {
    chunks: [
      { text: "c", kind: "consonant", hint: "发 /k/" },
      { text: "ow", kind: "vowel", hint: "大口双元音 /aʊ/" },
    ],
    rule: "ow 和 ou 常常发同一个声音 /aʊ/，像小牛叫 c-ow！",
    familyId: "ou_ow",
  },

  // Theme 3: School
  book: {
    chunks: [
      { text: "b", kind: "consonant", hint: "发 /b/" },
      { text: "oo", kind: "vowel", hint: "短元音 /ʊ/" },
      { text: "k", kind: "consonant", hint: "尾音 /k/" },
    ],
    rule: "oo 遇到好朋友 k（book、look、cook），都读短促的 /ʊ/！",
    familyId: "oo_family",
  },
  pencil: {
    chunks: [
      { text: "p", kind: "consonant", hint: "发 /p/" },
      { text: "e", kind: "vowel", hint: "微笑短音 /e/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
      { text: "cil", kind: "silent", hint: "c 遇 i 读 /s/，词尾 /səl/" },
    ],
    rule: "铅笔是在 pen（钢笔）后面加上 cil，c 遇到 i 读 /s/！",
    familyId: "short_e",
  },
  pen: {
    chunks: [
      { text: "p", kind: "consonant", hint: "发 /p/" },
      { text: "e", kind: "vowel", hint: "短元音 /e/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
    ],
    rule: "短小精悍的三明治词：p-e-n，也是 pencil 的前半部分！",
    familyId: "short_e",
  },
  bag: {
    chunks: [
      { text: "b", kind: "consonant", hint: "发 /b/" },
      { text: "a", kind: "vowel", hint: "大口短音 /æ/" },
      { text: "g", kind: "consonant", hint: "尾音 /ɡ/" },
    ],
    rule: "大口 a 家族成员：b-a-g，一声就能拼出来！",
    familyId: "short_a",
  },
  desk: {
    chunks: [
      { text: "d", kind: "consonant", hint: "发 /d/" },
      { text: "e", kind: "vowel", hint: "微笑短音 /e/" },
      { text: "sk", kind: "digraph", hint: "尾音组合 /sk/" },
    ],
    rule: "d-e-sk，注意听词尾 s 和 k 两个清脆的连续辅音。",
    familyId: "short_e",
  },
  teacher: {
    chunks: [
      { text: "t", kind: "consonant", hint: "发 /t/" },
      { text: "ea", kind: "vowel", hint: "长音 /iː/" },
      { text: "ch", kind: "digraph", hint: "发 /tʃ/" },
      { text: "er", kind: "r-vowel", hint: "表示“人”的后缀 /ə(r)/" },
    ],
    rule: "teach（教）+ er（……的人）= teacher（老师）！",
    familyId: "ee_ea",
  },
  school: {
    chunks: [
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "ch", kind: "digraph", hint: "此处发 /k/（浊化 /ɡ/）" },
      { text: "oo", kind: "vowel", hint: "长元音 /uː/" },
      { text: "l", kind: "consonant", hint: "舌尖上翘 /l/" },
    ],
    rule: "特别小秘密：school 里的 ch 读 /k/（与 s 连读听起来像 /sk/），oo 拉长音！",
    familyId: "oo_family",
  },
  friend: {
    chunks: [
      { text: "fr", kind: "digraph", hint: "辅音连缀 /fr/" },
      { text: "ie", kind: "vowel", hint: "此处发短音 /e/" },
      { text: "nd", kind: "digraph", hint: "尾音 /nd/" },
    ],
    rule: "好朋友永远在一起（fri + end 有个 end 在结尾），中间 ie 发短音 /e/。",
    familyId: "short_e",
  },

  // Theme 4: Family
  mother: {
    chunks: [
      { text: "m", kind: "consonant", hint: "发 /m/" },
      { text: "o", kind: "vowel", hint: "妈妈爱心的短音 /ʌ/" },
      { text: "th", kind: "digraph", hint: "轻咬舌尖发 /ð/" },
      { text: "er", kind: "r-vowel", hint: "亲人词尾 /ə(r)/" },
    ],
    rule: "家人的秘密：mother、father、brother 结尾都是 -ther（咬舌音 + er）！",
    familyId: "short_u",
  },
  father: {
    chunks: [
      { text: "f", kind: "consonant", hint: "咬唇 /f/" },
      { text: "a", kind: "vowel", hint: "饱满长音 /ɑː/" },
      { text: "th", kind: "digraph", hint: "咬舌音 /ð/" },
      { text: "er", kind: "r-vowel", hint: "亲人词尾 /ə(r)/" },
    ],
    rule: "f-a-ther，和 mother、brother 共享相同的 -ther 尾巴，一记记一串！",
    familyId: "ir_er_ur",
  },
  sister: {
    chunks: [
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "i", kind: "vowel", hint: "短音 /ɪ/" },
      { text: "st", kind: "digraph", hint: "连缀 /st/" },
      { text: "er", kind: "r-vowel", hint: "亲人词尾 /ə(r)/" },
    ],
    rule: "sis + ter，结尾同样带着家庭成员常见的 -er 后缀。",
    familyId: "short_i",
  },
  brother: {
    chunks: [
      { text: "br", kind: "digraph", hint: "连缀 /br/" },
      { text: "o", kind: "vowel", hint: "和 mother 一样读 /ʌ/" },
      { text: "th", kind: "digraph", hint: "咬舌音 /ð/" },
      { text: "er", kind: "r-vowel", hint: "亲人词尾 /ə(r)/" },
    ],
    rule: "br + other：和 mother 完全押韵（o 都读 /ʌ/，结尾都是 -ther）！",
    familyId: "short_u",
  },
  family: {
    chunks: [
      { text: "fa", kind: "vowel", hint: "重读 /fæ/" },
      { text: "mi", kind: "consonant", hint: "轻读 /mə/" },
      { text: "ly", kind: "vowel", hint: "词尾 y 读 /li/" },
    ],
    rule: "三拍轻快词：fa-mi-ly，词尾的 y 在多音节词里常读 /i/。",
    familyId: "short_a",
  },
  grandmother: {
    chunks: [
      { text: "grand", kind: "digraph", hint: "长辈前缀 grand" },
      { text: "mo", kind: "vowel", hint: "读 /mʌ/" },
      { text: "ther", kind: "digraph", hint: "咬舌尾音 /ðə(r)/" },
    ],
    rule: "搭积木长词不用怕：grand（长辈）+ mother（妈妈）= grandmother（奶奶/外婆）！",
    familyId: "short_u",
  },
  grandfather: {
    chunks: [
      { text: "grand", kind: "digraph", hint: "长辈前缀 grand" },
      { text: "fa", kind: "vowel", hint: "读 /fɑː/" },
      { text: "ther", kind: "digraph", hint: "咬舌尾音 /ðə(r)/" },
    ],
    rule: "搭积木长词：grand（长辈）+ father（爸爸）= grandfather（爷爷/外公）！",
    familyId: "ir_er_ur",
  },
  baby: {
    chunks: [
      { text: "ba", kind: "vowel", hint: "开音节读 /beɪ/" },
      { text: "by", kind: "vowel", hint: "词尾 y 读 /bi/" },
    ],
    rule: "第一拍 ba 是开音节，a 读本音 /eɪ/；词尾 y 读 /i/。",
    familyId: "ai_ay",
  },

  // Theme 5: Home
  house: {
    chunks: [
      { text: "h", kind: "consonant", hint: "呵气 /h/" },
      { text: "ou", kind: "vowel", hint: "大口双元音 /aʊ/" },
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "e", kind: "silent", hint: "词尾 e 不发音" },
    ],
    rule: "ou 组合张大嘴巴发 /aʊ/（和 mouth、cloud 一样），词尾 e 安静不发音。",
    familyId: "ou_ow",
  },
  room: {
    chunks: [
      { text: "r", kind: "consonant", hint: "卷舌 /r/" },
      { text: "oo", kind: "vowel", hint: "长元音 /uː/" },
      { text: "m", kind: "consonant", hint: "闭嘴鼻音 /m/" },
    ],
    rule: "r-oo-m，两个圆圆的 oo 在 m 前拉长声音读 /uː/。",
    familyId: "oo_family",
  },
  door: {
    chunks: [
      { text: "d", kind: "consonant", hint: "发 /d/" },
      { text: "oor", kind: "r-vowel", hint: "圆嘴长音 /ɔː/" },
    ],
    rule: "oor 整体发圆嘴长音 /ɔː/（和 floor 地板押韵）。",
    familyId: "or_family",
  },
  window: {
    chunks: [
      { text: "win", kind: "vowel", hint: "第一拍 /wɪn/" },
      { text: "d", kind: "consonant", hint: "发 /d/" },
      { text: "ow", kind: "vowel", hint: "词尾读 /əʊ/" },
    ],
    rule: "两拍积木：win（风 wind 的前半）+ dow（ow 在词尾读 /əʊ/，像 snow）！",
    familyId: "ou_ow",
  },
  chair: {
    chunks: [
      { text: "ch", kind: "digraph", hint: "小火车 /tʃ/" },
      { text: "air", kind: "r-vowel", hint: "空气音组合 /eə/" },
    ],
    rule: "ch + air（空气）= chair（椅子），记住 air 整体发 /eə/！",
    familyId: "sh_ch_ck",
  },
  table: {
    chunks: [
      { text: "ta", kind: "vowel", hint: "开音节读 /teɪ/" },
      { text: "ble", kind: "silent", hint: "词尾舌尖音 /bl/" },
    ],
    rule: "第一拍 ta 是开音节读 /teɪ/，第二拍 ble 和 apple 的词尾一样！",
    familyId: "magic_e",
  },
  bed: {
    chunks: [
      { text: "b", kind: "consonant", hint: "发 /b/" },
      { text: "e", kind: "vowel", hint: "微笑短音 /e/" },
      { text: "d", kind: "consonant", hint: "发 /d/" },
    ],
    rule: "看字形记小床：b 和 d 像两头的床柱，中间平平的 e 就是小床铺！",
    familyId: "short_e",
  },
  lamp: {
    chunks: [
      { text: "l", kind: "consonant", hint: "舌尖 /l/" },
      { text: "a", kind: "vowel", hint: "大口短音 /æ/" },
      { text: "mp", kind: "digraph", hint: "鼻音接清辅音 /mp/" },
    ],
    rule: "l-a-mp，大口短元音 a 家族成员。",
    familyId: "short_a",
  },

  // Theme 6: Park
  park: {
    chunks: [
      { text: "p", kind: "consonant", hint: "发 /p/" },
      { text: "ar", kind: "r-vowel", hint: "大口卷舌 /ɑː/" },
      { text: "k", kind: "consonant", hint: "尾音 /k/" },
    ],
    rule: "p + ar + k：中间的 ar 和 car（小汽车）发音一模一样！",
    familyId: "ar_family",
  },
  tree: {
    chunks: [
      { text: "tr", kind: "digraph", hint: "小树干连缀 /tr/" },
      { text: "ee", kind: "vowel", hint: "长元音 /iː/" },
    ],
    rule: "tr 连读 + ee 双胞胎长音 /iː/ = tree！",
    familyId: "ee_ea",
  },
  flower: {
    chunks: [
      { text: "fl", kind: "digraph", hint: "连缀 /fl/" },
      { text: "ow", kind: "vowel", hint: "大口 /aʊ/" },
      { text: "er", kind: "r-vowel", hint: "词尾轻读 /ə(r)/" },
    ],
    rule: "fl + ow（像 cow 一样读 /aʊ/）+ er = flower（花朵）！",
    familyId: "ou_ow",
  },
  ball: {
    chunks: [
      { text: "b", kind: "consonant", hint: "发 /b/" },
      { text: "all", kind: "vowel", hint: "all 整体读 /ɔːl/" },
    ],
    rule: "看到 all 组合都读圆嘴音 /ɔːl/：all、ball、tall、wall、small 全是一家人！",
    familyId: "or_family",
  },
  play: {
    chunks: [
      { text: "pl", kind: "digraph", hint: "连缀 /pl/" },
      { text: "ay", kind: "vowel", hint: "词尾长音 /eɪ/" },
    ],
    rule: "pl + ay（词尾发 /eɪ/，和 day、pay、say 是押韵好朋友）！",
    familyId: "ai_ay",
  },
  run: {
    chunks: [
      { text: "r", kind: "consonant", hint: "发 /r/" },
      { text: "u", kind: "vowel", hint: "短元音 /ʌ/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
    ],
    rule: "r-u-n，和 sun（太阳）只差第一个字母，在太阳下奔跑！",
    familyId: "short_u",
  },
  jump: {
    chunks: [
      { text: "j", kind: "consonant", hint: "发 /dʒ/" },
      { text: "u", kind: "vowel", hint: "短元音 /ʌ/" },
      { text: "mp", kind: "digraph", hint: "尾音 /mp/" },
    ],
    rule: "j-u-mp，短元音 u 充满弹性，像往上跳一下！",
    familyId: "short_u",
  },
  walk: {
    chunks: [
      { text: "w", kind: "consonant", hint: "圆唇 /w/" },
      { text: "al", kind: "silent", hint: "al 读 /ɔː/，l 安静不翘舌" },
      { text: "k", kind: "consonant", hint: "尾音 /k/" },
    ],
    rule: "小秘密：walk 和 talk 里的 l 躲起来不发音，al 整体读 /ɔː/！",
    familyId: "or_family",
  },

  // Theme 7: Clothes
  shirt: {
    chunks: [
      { text: "sh", kind: "digraph", hint: "嘘声 /ʃ/" },
      { text: "ir", kind: "r-vowel", hint: "小鸟音 /ɜː/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "sh（嘘声）+ ir（小鸟音）+ t = shirt（衬衫），把 sh 换成 sk 就是 skirt（短裙）！",
    familyId: "ir_er_ur",
  },
  coat: {
    chunks: [
      { text: "c", kind: "consonant", hint: "发 /k/" },
      { text: "oa", kind: "vowel", hint: "组合读字母 O 本音 /əʊ/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "oa 双元音组合（coat、boat、road）一起读字母 O 的本音 /əʊ/！",
    familyId: "ou_ow",
  },
  hat: {
    chunks: [
      { text: "h", kind: "consonant", hint: "呵气 /h/" },
      { text: "a", kind: "vowel", hint: "大口短音 /æ/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "h-a-t，和 cat（小猫）是双胞胎韵脚 -at，小猫戴帽子！",
    familyId: "short_a",
  },
  shoe: {
    chunks: [
      { text: "sh", kind: "digraph", hint: "嘘声 /ʃ/" },
      { text: "oe", kind: "vowel", hint: "此处发长音 /uː/" },
    ],
    rule: "sh + oe（发 /uː/），两只鞋子成双成对。",
    familyId: "sh_ch_ck",
  },
  sock: {
    chunks: [
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "o", kind: "vowel", hint: "圆嘴短音 /ɒ/" },
      { text: "ck", kind: "digraph", hint: "词尾合发 /k/" },
    ],
    rule: "s-o-ck，短元音 o 后面跟好搭档 ck！",
    familyId: "short_o",
  },
  dress: {
    chunks: [
      { text: "dr", kind: "digraph", hint: "连缀 /dr/" },
      { text: "e", kind: "vowel", hint: "微笑短音 /e/" },
      { text: "ss", kind: "consonant", hint: "双写发一个 /s/" },
    ],
    rule: "dr + e + ss，词尾两个 s 合发一次 /s/。",
    familyId: "short_e",
  },
  skirt: {
    chunks: [
      { text: "sk", kind: "digraph", hint: "连缀 /sk/" },
      { text: "ir", kind: "r-vowel", hint: "小鸟音 /ɜː/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "sk + ir + t，和 shirt（衬衫）、bird（小鸟）共享中间的 ir /ɜː/！",
    familyId: "ir_er_ur",
  },
  jacket: {
    chunks: [
      { text: "j", kind: "consonant", hint: "发 /dʒ/" },
      { text: "a", kind: "vowel", hint: "大口短音 /æ/" },
      { text: "ck", kind: "digraph", hint: "合发 /k/" },
      { text: "et", kind: "vowel", hint: "词尾轻读 /ɪt/" },
    ],
    rule: "两拍积木：jack + et（口袋 pocket、车票 ticket 也是 -cket 结尾）！",
    familyId: "sh_ch_ck",
  },

  // Theme 8: Body
  hand: {
    chunks: [
      { text: "h", kind: "consonant", hint: "呵气 /h/" },
      { text: "a", kind: "vowel", hint: "大口 /æ/" },
      { text: "nd", kind: "digraph", hint: "鼻音连缀 /nd/" },
    ],
    rule: "h + and（和）= hand（小手）！认识 and 就自动会拼 hand 啦！",
    familyId: "short_a",
  },
  head: {
    chunks: [
      { text: "h", kind: "consonant", hint: "呵气 /h/" },
      { text: "ea", kind: "vowel", hint: "此处发微笑短音 /e/" },
      { text: "d", kind: "consonant", hint: "尾音 /d/" },
    ],
    rule: "h-ea-d 和 br-ea-d（面包）是押韵好朋友，ea 都读短音 /e/！",
    familyId: "short_e",
  },
  eye: {
    chunks: [
      { text: "eye", kind: "vowel", hint: "整体读字母 I 的本音 /aɪ/" },
    ],
    rule: "有趣的对称视觉词：两个 e 像两只眼睛，中间的 y 像小鼻梁，整体读 /aɪ/！",
    familyId: "magic_e",
  },
  ear: {
    chunks: [
      { text: "ear", kind: "r-vowel", hint: "整体读 /ɪə(r)/" },
    ],
    rule: "ear 整体是一个常见发音积木，前面加 h 就变成 hear（听见：用耳朵听）！",
    familyId: "ir_er_ur",
  },
  mouth: {
    chunks: [
      { text: "m", kind: "consonant", hint: "闭嘴 /m/" },
      { text: "ou", kind: "vowel", hint: "张大嘴 /aʊ/" },
      { text: "th", kind: "digraph", hint: "轻咬舌尖吹气 /θ/" },
    ],
    rule: "m + ou（张大嘴巴发 /aʊ/）+ th（舌尖吹气 /θ/）= mouth（嘴巴）！",
    familyId: "ou_ow",
  },
  nose: {
    chunks: [
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
      { text: "o", kind: "vowel", hint: "字母 O 本音 /əʊ/" },
      { text: "s", kind: "consonant", hint: "夹在元音间读 /z/" },
      { text: "e", kind: "silent", hint: "魔法 e 不发音" },
    ],
    rule: "o_e 魔法组合：词尾 e 不发音，让中间的 o 读字母本音 /əʊ/！",
    familyId: "magic_e",
  },
  arm: {
    chunks: [
      { text: "ar", kind: "r-vowel", hint: "大口卷舌 /ɑː/" },
      { text: "m", kind: "consonant", hint: "闭嘴鼻音 /m/" },
    ],
    rule: "ar（/ɑː/）+ m = arm（手臂），前面加 f 就变成 farm（农场）！",
    familyId: "ar_family",
  },
  leg: {
    chunks: [
      { text: "l", kind: "consonant", hint: "舌尖 /l/" },
      { text: "e", kind: "vowel", hint: "微笑短音 /e/" },
      { text: "g", kind: "consonant", hint: "尾音 /ɡ/" },
    ],
    rule: "l-e-g，简单好拼的三明治短音词，和 egg 押韵！",
    familyId: "short_e",
  },

  // Theme 9: Weather
  sun: {
    chunks: [
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "u", kind: "vowel", hint: "短元音 /ʌ/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
    ],
    rule: "s-u-n，和 run（跑步）、fun（有趣）是短音 u 押韵三兄弟！",
    familyId: "short_u",
  },
  rain: {
    chunks: [
      { text: "r", kind: "consonant", hint: "发 /r/" },
      { text: "ai", kind: "vowel", hint: "长元音 /eɪ/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
    ],
    rule: "r-ai-n，中间的 ai 读 /eɪ/，前面加个 t 就变成 train（火车）！",
    familyId: "ai_ay",
  },
  snow: {
    chunks: [
      { text: "sn", kind: "digraph", hint: "连缀 /sn/" },
      { text: "ow", kind: "vowel", hint: "词尾轻柔读 /əʊ/" },
    ],
    rule: "sn + ow（在词尾读 /əʊ/，和 window、yellow 一样）= snow（雪）！",
    familyId: "ou_ow",
  },
  wind: {
    chunks: [
      { text: "w", kind: "consonant", hint: "圆唇 /w/" },
      { text: "i", kind: "vowel", hint: "短元音 /ɪ/" },
      { text: "nd", kind: "digraph", hint: "尾音 /nd/" },
    ],
    rule: "w-i-nd，也是 window（窗户）的前半部分，风从窗户吹进来！",
    familyId: "short_i",
  },
  cloud: {
    chunks: [
      { text: "cl", kind: "digraph", hint: "连缀 /kl/" },
      { text: "ou", kind: "vowel", hint: "大口双元音 /aʊ/" },
      { text: "d", kind: "consonant", hint: "尾音 /d/" },
    ],
    rule: "cl + ou（/aʊ/，和 house、mouth 一样）+ d = cloud（云朵）！",
    familyId: "ou_ow",
  },
  hot: {
    chunks: [
      { text: "h", kind: "consonant", hint: "呵气 /h/" },
      { text: "o", kind: "vowel", hint: "圆嘴短音 /ɒ/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "h-o-t，天热得呵气 h，中间圆嘴短音 o！",
    familyId: "short_o",
  },
  cold: {
    chunks: [
      { text: "c", kind: "consonant", hint: "发 /k/" },
      { text: "o", kind: "vowel", hint: "在 ld 前读字母本音 /əʊ/" },
      { text: "ld", kind: "digraph", hint: "尾音 /ld/" },
    ],
    rule: "old 家族（old、cold、hold、gold）：里面的 o 都读字母本音 /əʊ/！",
    familyId: "ou_ow",
  },
  weather: {
    chunks: [
      { text: "w", kind: "consonant", hint: "圆唇 /w/" },
      { text: "ea", kind: "vowel", hint: "此处发短音 /e/" },
      { text: "th", kind: "digraph", hint: "咬舌音 /ð/" },
      { text: "er", kind: "r-vowel", hint: "词尾轻读 /ə(r)/" },
    ],
    rule: "ea 在这里和 bread、head 一样发短音 /e/，后半段 -ther 和 mother 一样！",
    familyId: "short_e",
  },

  // Theme 10: Shopping
  shop: {
    chunks: [
      { text: "sh", kind: "digraph", hint: "嘘声 /ʃ/" },
      { text: "o", kind: "vowel", hint: "圆嘴短音 /ɒ/" },
      { text: "p", kind: "consonant", hint: "尾音 /p/" },
    ],
    rule: "sh + o + p，把 sh 换成 st 就是 stop（停下）！",
    familyId: "short_o",
  },
  buy: {
    chunks: [
      { text: "b", kind: "consonant", hint: "发 /b/" },
      { text: "uy", kind: "vowel", hint: "整体读 /aɪ/" },
    ],
    rule: "buy 和 guy 押韵，后面的 uy 整体读字母 I 的本音 /aɪ/。",
    familyId: "magic_e",
  },
  money: {
    chunks: [
      { text: "m", kind: "consonant", hint: "发 /m/" },
      { text: "o", kind: "vowel", hint: "和 mother 一样读 /ʌ/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
      { text: "ey", kind: "vowel", hint: "词尾轻读 /i/" },
    ],
    rule: "o 在 m、n 旁边常读 /ʌ/（像 mother、Monday），词尾 ey 读 /i/。",
    familyId: "short_u",
  },
  price: {
    chunks: [
      { text: "pr", kind: "digraph", hint: "连缀 /pr/" },
      { text: "i", kind: "vowel", hint: "字母本音 /aɪ/" },
      { text: "c", kind: "consonant", hint: "遇 e 读 /s/" },
      { text: "e", kind: "silent", hint: "魔法 e 不发音" },
    ],
    rule: "pr + ice（冰）：和 rice（米饭）、nice（好的）共享 -ice 魔法组合！",
    familyId: "magic_e",
  },
  fruit: {
    chunks: [
      { text: "fr", kind: "digraph", hint: "连缀 /fr/" },
      { text: "ui", kind: "vowel", hint: "组合发长音 /uː/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "fr-ui-t 和 j-ui-ce（果汁）里的 ui 都读长音 /uː/，水果榨果汁！",
    familyId: "oo_family",
  },
  vegetable: {
    chunks: [
      { text: "ve", kind: "vowel", hint: "第一拍 /ve/" },
      { text: "ge", kind: "silent", hint: "ge 合发 /dʒ/（中间 e 吞音）" },
      { text: "ta", kind: "consonant", hint: "轻读 /tə/" },
      { text: "ble", kind: "silent", hint: "词尾 /bl/" },
    ],
    rule: "长词拆三拍读：veg-ta-ble（中间第二个 e 藏起来不单独发音，结尾是 table 的 -table）！",
    familyId: "magic_e",
  },
  pay: {
    chunks: [
      { text: "p", kind: "consonant", hint: "发 /p/" },
      { text: "ay", kind: "vowel", hint: "长音 /eɪ/" },
    ],
    rule: "p + ay = pay（付款），和 play（玩）、day（天）、say（说）完全押韵！",
    familyId: "ai_ay",
  },

  // Theme 11: Travel
  bus: {
    chunks: [
      { text: "b", kind: "consonant", hint: "发 /b/" },
      { text: "u", kind: "vowel", hint: "短元音 /ʌ/" },
      { text: "s", kind: "consonant", hint: "尾音 /s/" },
    ],
    rule: "b-u-s，短促清楚的三明治词（CVC）。",
    familyId: "short_u",
  },
  bicycle: {
    chunks: [
      { text: "bi", kind: "vowel", hint: "bi- 表示“两个”，读 /baɪ/" },
      { text: "cy", kind: "vowel", hint: "读 /sɪ/" },
      { text: "cle", kind: "silent", hint: "词尾读 /kl/" },
    ],
    rule: "bi（两个）+ cycle（轮子/转圈）= 两个轮子的自行车 bicycle！",
    familyId: "magic_e",
  },
  car: {
    chunks: [
      { text: "c", kind: "consonant", hint: "发 /k/" },
      { text: "ar", kind: "r-vowel", hint: "大口卷舌 /ɑː/" },
    ],
    rule: "c + ar = car，记住这个 ar /ɑː/，park（公园）和 arm（手臂）都会读！",
    familyId: "ar_family",
  },
  train: {
    chunks: [
      { text: "tr", kind: "digraph", hint: "小火车头 /tr/" },
      { text: "ai", kind: "vowel", hint: "长元音 /eɪ/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
    ],
    rule: "tr + rain（雨）的韵脚 -ain = train（火车）！",
    familyId: "ai_ay",
  },
  road: {
    chunks: [
      { text: "r", kind: "consonant", hint: "发 /r/" },
      { text: "oa", kind: "vowel", hint: "组合读 /əʊ/" },
      { text: "d", kind: "consonant", hint: "尾音 /d/" },
    ],
    rule: "r-oa-d，中间的 oa 和 coat（外套）、boat（小船）一样读 /əʊ/！",
    familyId: "ou_ow",
  },
  station: {
    chunks: [
      { text: "st", kind: "digraph", hint: "连缀 /st/" },
      { text: "a", kind: "vowel", hint: "开音节读 /eɪ/" },
      { text: "tion", kind: "digraph", hint: "固定后缀读 /ʃn/" },
    ],
    rule: "看到词尾 -tion 积木，永远整体读“嘘恩” /ʃn/！",
    familyId: "ai_ay",
  },
  ticket: {
    chunks: [
      { text: "t", kind: "consonant", hint: "发 /t/" },
      { text: "i", kind: "vowel", hint: "短元音 /ɪ/" },
      { text: "ck", kind: "digraph", hint: "合发 /k/" },
      { text: "et", kind: "vowel", hint: "词尾轻读 /ɪt/" },
    ],
    rule: "tick（滴答/打勾）+ et = ticket，和 jacket（夹克）共享 -cket 尾巴！",
    familyId: "short_i",
  },
  stop: {
    chunks: [
      { text: "st", kind: "digraph", hint: "连缀 /st/" },
      { text: "o", kind: "vowel", hint: "圆嘴短音 /ɒ/" },
      { text: "p", kind: "consonant", hint: "尾音 /p/" },
    ],
    rule: "st-o-p，和 sh-o-p（商店）共享 -op 韵脚！",
    familyId: "short_o",
  },

  // Theme 12: A Happy Day
  morning: {
    chunks: [
      { text: "m", kind: "consonant", hint: "发 /m/" },
      { text: "or", kind: "r-vowel", hint: "圆嘴长音 /ɔː/" },
      { text: "n", kind: "consonant", hint: "发 /n/" },
      { text: "ing", kind: "digraph", hint: "后鼻音积木 /ɪŋ/" },
    ],
    rule: "m + or（像 horse 一样读 /ɔː/）+ n + ing = morning（早晨）！",
    familyId: "or_family",
  },
  afternoon: {
    chunks: [
      { text: "af", kind: "vowel", hint: "读 /ɑːf/ 或 /æf/" },
      { text: "ter", kind: "r-vowel", hint: "读 /tə/" },
      { text: "n", kind: "consonant", hint: "发 /n/" },
      { text: "oo", kind: "vowel", hint: "长元音 /uː/" },
      { text: "n", kind: "consonant", hint: "尾音 /n/" },
    ],
    rule: "搭积木组合词：after（在……之后）+ noon（正午 12 点）= 下午 afternoon！",
    familyId: "oo_family",
  },
  evening: {
    chunks: [
      { text: "e", kind: "vowel", hint: "长元音 /iː/" },
      { text: "ve", kind: "silent", hint: "读 /v/（中间 e 吞音）" },
      { text: "n", kind: "consonant", hint: "发 /n/" },
      { text: "ing", kind: "digraph", hint: "后鼻音积木 /ɪŋ/" },
    ],
    rule: "eve（前夜，e_e 读长音 /iː/）+ ning = evening（傍晚）！",
    familyId: "ee_ea",
  },
  night: {
    chunks: [
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
      { text: "igh", kind: "vowel", hint: "三字母组合读 /aɪ/" },
      { text: "t", kind: "consonant", hint: "尾音 /t/" },
    ],
    rule: "黄金组合 igh：gh 安静睡觉，帮 i 读字母本音 /aɪ/（night、light、right、bright 全一样）！",
    familyId: "magic_e",
  },
  breakfast: {
    chunks: [
      { text: "br", kind: "digraph", hint: "连缀 /br/" },
      { text: "ea", kind: "vowel", hint: "和 bread 一样读短音 /e/" },
      { text: "k", kind: "consonant", hint: "发 /k/" },
      { text: "fast", kind: "vowel", hint: "轻读 /fəst/" },
    ],
    rule: "break（打破，此处读 /brek/）+ fast（禁食）= 早上打破一夜空腹吃早餐 breakfast！",
    familyId: "short_e",
  },
  lunch: {
    chunks: [
      { text: "l", kind: "consonant", hint: "舌尖 /l/" },
      { text: "u", kind: "vowel", hint: "短元音 /ʌ/" },
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
      { text: "ch", kind: "digraph", hint: "小火车 /tʃ/" },
    ],
    rule: "l-u-n-ch，短元音 u 配上词尾小火车音 ch！",
    familyId: "short_u",
  },
  dinner: {
    chunks: [
      { text: "d", kind: "consonant", hint: "发 /d/" },
      { text: "i", kind: "vowel", hint: "短元音 /ɪ/" },
      { text: "nn", kind: "consonant", hint: "双写发一个 /n/" },
      { text: "er", kind: "r-vowel", hint: "词尾轻读 /ə(r)/" },
    ],
    rule: "d-i-nn-er，中间双写 nn 保护前面的 i 读短音 /ɪ/。",
    familyId: "short_i",
  },
  sleep: {
    chunks: [
      { text: "sl", kind: "digraph", hint: "连缀 /sl/" },
      { text: "ee", kind: "vowel", hint: "长元音 /iː/" },
      { text: "p", kind: "consonant", hint: "尾音 /p/" },
    ],
    rule: "sl + ee（两个小眼睛闭起来睡长觉 /iː/）+ p = sleep！",
    familyId: "ee_ea",
  },

  // Starter & Health Reviewed Words
  all: {
    chunks: [
      { text: "all", kind: "vowel", hint: "整体读 /ɔːl/" },
    ],
    rule: "all 整体发 /ɔːl/，前面加 b 变 ball（球），加 t 变 tall（高）！",
    familyId: "or_family",
  },
  also: {
    chunks: [
      { text: "al", kind: "vowel", hint: "读 /ɔːl/" },
      { text: "so", kind: "vowel", hint: "读 /səʊ/" },
    ],
    rule: "all（去掉一个 l）+ so = also（也）！",
    familyId: "or_family",
  },
  always: {
    chunks: [
      { text: "al", kind: "vowel", hint: "读 /ɔːl/" },
      { text: "w", kind: "consonant", hint: "发 /w/" },
      { text: "ay", kind: "vowel", hint: "长音 /eɪ/" },
      { text: "s", kind: "consonant", hint: "尾音 /z/" },
    ],
    rule: "all（去掉一个 l）+ ways（路/方式）= always（总是）！",
    familyId: "ai_ay",
  },
  and: {
    chunks: [
      { text: "a", kind: "vowel", hint: "大口短音 /æ/" },
      { text: "nd", kind: "digraph", hint: "鼻音连缀 /nd/" },
    ],
    rule: "a + nd = and，前面加 h 就是 hand（手），加 s 就是 sand（沙子）！",
    familyId: "short_a",
  },
  answer: {
    chunks: [
      { text: "an", kind: "vowel", hint: "读 /ɑːn/ 或 /æn/" },
      { text: "sw", kind: "silent", hint: "s 发音，w 悄悄躲起来不发音" },
      { text: "er", kind: "r-vowel", hint: "词尾轻读 /ə(r)/" },
    ],
    rule: "特别小秘密：answer 中间的 w 不发音，直接读 an-ser！",
    familyId: "ir_er_ur",
  },
  doctor: {
    chunks: [
      { text: "d", kind: "consonant", hint: "发 /d/" },
      { text: "o", kind: "vowel", hint: "圆嘴短音 /ɒ/" },
      { text: "c", kind: "consonant", hint: "发 /k/" },
      { text: "tor", kind: "r-vowel", hint: "表示职业的后缀 /tə(r)/" },
    ],
    rule: "doc + tor（和 -er 一样常表示职业，如 actor 演员）= doctor（医生）！",
    familyId: "short_o",
  },
  nurse: {
    chunks: [
      { text: "n", kind: "consonant", hint: "鼻音 /n/" },
      { text: "ur", kind: "r-vowel", hint: "卷舌长音 /ɜː/" },
      { text: "s", kind: "consonant", hint: "发 /s/" },
      { text: "e", kind: "silent", hint: "词尾 e 不发音" },
    ],
    rule: "ur 和 ir（bird）、er 一样发卷舌音 /ɜː/，词尾 e 安静不发音。",
    familyId: "ir_er_ur",
  },
  hospital: {
    chunks: [
      { text: "hos", kind: "vowel", hint: "第一拍 /hɒs/" },
      { text: "pi", kind: "vowel", hint: "第二拍 /pɪ/" },
      { text: "tal", kind: "consonant", hint: "第三拍 /tl/" },
    ],
    rule: "三拍节奏拆开读：hos-pi-tal，一下子就顺口啦！",
    familyId: "short_o",
  },
  medicine: {
    chunks: [
      { text: "me", kind: "vowel", hint: "第一拍 /me/" },
      { text: "di", kind: "vowel", hint: "第二拍 /dɪ/" },
      { text: "cine", kind: "silent", hint: "c 遇 i 读 /s/，词尾 /sɪn/" },
    ],
    rule: "三拍拆解：me-di-cine，c 遇到后面的 i 温柔发 /s/。",
    familyId: "short_e",
  },
  pharmacy: {
    chunks: [
      { text: "ph", kind: "digraph", hint: "ph 组合永远发 /f/" },
      { text: "ar", kind: "r-vowel", hint: "大口卷舌 /ɑː/" },
      { text: "ma", kind: "consonant", hint: "轻读 /mə/" },
      { text: "cy", kind: "vowel", hint: "词尾读 /si/" },
    ],
    rule: "自然拼读大绝招：看到 ph 在一起（photo、phone、pharmacy），永远读咬唇音 /f/！",
    familyId: "ar_family",
  },
  dentist: {
    chunks: [
      { text: "den", kind: "vowel", hint: "第一拍 /den/" },
      { text: "t", kind: "consonant", hint: "发 /t/" },
      { text: "ist", kind: "vowel", hint: "表示专业人员的后缀 /ɪst/" },
    ],
    rule: "dent（牙齿词根）+ ist（专业人员，如 artist 艺术家）= dentist（牙医）！",
    familyId: "short_e",
  },
  tooth: {
    chunks: [
      { text: "t", kind: "consonant", hint: "发 /t/" },
      { text: "oo", kind: "vowel", hint: "长元音 /uː/" },
      { text: "th", kind: "digraph", hint: "咬舌吹气 /θ/" },
    ],
    rule: "t + oo（长音 /uː/）+ th（咬舌音 /θ/）= tooth（牙齿）！",
    familyId: "oo_family",
  },
  ambulance: {
    chunks: [
      { text: "am", kind: "vowel", hint: "第一拍 /æm/" },
      { text: "bu", kind: "vowel", hint: "第二拍 /bjə/" },
      { text: "lance", kind: "silent", hint: "第三拍 /ləns/" },
    ],
    rule: "长词切三块：am-bu-lance，像救护车滴滴答答三拍开过来！",
    familyId: "short_a",
  },
};

const MULTI_CHAR_PATTERNS = [
  // 4-char patterns
  { token: "tion", kind: "digraph", hint: "后缀读 /ʃn/", rule: "-tion 后缀整体发“嘘恩” /ʃn/。" },
  { token: "sion", kind: "digraph", hint: "后缀读 /ʒn/ 或 /ʃn/", rule: "-sion 后缀整体连读。" },
  { token: "ture", kind: "r-vowel", hint: "后缀读 /tʃə(r)/", rule: "-ture 后缀在词尾常读 /tʃə(r)/（如 picture、nature）。" },
  // 3-char patterns
  { token: "igh", kind: "vowel", hint: "gh 不发音，读 /aɪ/", rule: "igh 组合里 gh 安静不说话，整体读字母 I 的本音 /aɪ/。", familyId: "magic_e" },
  { token: "ear", kind: "r-vowel", hint: "组合读 /ɪə/ 或 /ɜː/", rule: "ear 组合整体作为一个发音积木。", familyId: "ir_er_ur" },
  { token: "air", kind: "r-vowel", hint: "组合读 /eə/", rule: "air 组合整体发 /eə/（如 chair、hair）。", familyId: "ir_er_ur" },
  { token: "are", kind: "r-vowel", hint: "组合读 /eə/", rule: "are 组合常读 /eə/（如 share、care）。", familyId: "ir_er_ur" },
  { token: "tch", kind: "digraph", hint: "组合发 /tʃ/", rule: "tch 三字母合在一起发清脆的 /tʃ/（如 watch、catch）。", familyId: "sh_ch_ck" },
  { token: "dge", kind: "digraph", hint: "组合发 /dʒ/", rule: "dge 在短元音词尾合发 /dʒ/（如 bridge、fridge）。", familyId: "sh_ch_ck" },
  { token: "all", kind: "vowel", hint: "组合读 /ɔːl/", rule: "all 组合常读圆嘴音 /ɔːl/。", familyId: "or_family" },
  // 2-char r-vowels
  { token: "ar", kind: "r-vowel", hint: "卷舌音 /ɑː/", rule: "ar 组合张大嘴巴读 /ɑː/（如 car、park）。", familyId: "ar_family" },
  { token: "er", kind: "r-vowel", hint: "卷舌音 /ɜː/ 或轻音 /ə/", rule: "er 在重读音节发 /ɜː/，在词尾轻轻读 /ə(r)/。", familyId: "ir_er_ur" },
  { token: "ir", kind: "r-vowel", hint: "小鸟音 /ɜː/", rule: "ir 组合发卷舌音 /ɜː/（如 bird、shirt、girl）。", familyId: "ir_er_ur" },
  { token: "or", kind: "r-vowel", hint: "圆嘴音 /ɔː/", rule: "or 组合圆嘴拉长音 /ɔː/（如 horse、morning）。", familyId: "or_family" },
  { token: "ur", kind: "r-vowel", hint: "卷舌音 /ɜː/", rule: "ur 组合发卷舌音 /ɜː/（如 nurse、turn）。", familyId: "ir_er_ur" },
  // 2-char vowel teams
  { token: "ee", kind: "vowel", hint: "长元音 /iː/", rule: "ee 双胞胎笑眯眯发长音 /iː/（如 tree、sleep）。", familyId: "ee_ea" },
  { token: "ea", kind: "vowel", hint: "元音组合 /iː/ 或 /e/", rule: "ea 常读长音 /iː/（eat、tea），少数词读短音 /e/（bread、head）。", familyId: "ee_ea" },
  { token: "oo", kind: "vowel", hint: "双圆音 /ʊ/ 或 /uː/", rule: "oo 像副小眼镜，发 /ʊ/（book）或长音 /uː/（room）。", familyId: "oo_family" },
  { token: "ai", kind: "vowel", hint: "长元音 /eɪ/", rule: "ai 在词中合读字母 A 的本音 /eɪ/（如 rain、train）。", familyId: "ai_ay" },
  { token: "ay", kind: "vowel", hint: "词尾长音 /eɪ/", rule: "ay 在词尾合读字母 A 的本音 /eɪ/（如 play、day）。", familyId: "ai_ay" },
  { token: "oa", kind: "vowel", hint: "长元音 /əʊ/", rule: "oa 组合读字母 O 的本音 /əʊ/（如 coat、road）。", familyId: "ou_ow" },
  { token: "ou", kind: "vowel", hint: "双元音 /aʊ/", rule: "ou 组合常张大嘴发 /aʊ/（如 house、cloud）。", familyId: "ou_ow" },
  { token: "ow", kind: "vowel", hint: "发 /aʊ/ 或 /əʊ/", rule: "ow 可发大口音 /aʊ/（cow）或词尾轻柔的 /əʊ/（snow、window）。", familyId: "ou_ow" },
  { token: "oi", kind: "vowel", hint: "双元音 /ɔɪ/", rule: "oi 在词中滑向 /ɔɪ/。", familyId: "or_family" },
  { token: "oy", kind: "vowel", hint: "双元音 /ɔɪ/", rule: "oy 在词尾发欢快的 /ɔɪ/（如 boy、toy）。", familyId: "or_family" },
  { token: "au", kind: "vowel", hint: "圆嘴长音 /ɔː/", rule: "au 组合发圆嘴长音 /ɔː/。", familyId: "or_family" },
  { token: "aw", kind: "vowel", hint: "圆嘴长音 /ɔː/", rule: "aw 组合发圆嘴长音 /ɔː/（如 draw）。", familyId: "or_family" },
  // 2-char consonant digraphs & blends
  { token: "sh", kind: "digraph", hint: "嘘声 /ʃ/", rule: "sh 在一起发轻轻的嘘声 /ʃ/（如 shop、fish）。", familyId: "sh_ch_ck" },
  { token: "ch", kind: "digraph", hint: "小火车 /tʃ/", rule: "ch 在一起像小火车开动发 /tʃ/（如 chair、lunch）。", familyId: "sh_ch_ck" },
  { token: "th", kind: "digraph", hint: "咬舌音 /θ/ 或 /ð/", rule: "th 舌尖轻轻放在上下牙之间吹气（thank、mother）。", familyId: "sh_ch_ck" },
  { token: "ph", kind: "digraph", hint: "发咬唇音 /f/", rule: "ph 组合永远和 f 一样读咬唇音 /f/（如 photo、phone）。", familyId: "sh_ch_ck" },
  { token: "wh", kind: "digraph", hint: "圆唇音 /w/", rule: "wh 在疑问词里常读圆唇音 /w/（如 what、where、when）。", familyId: "sh_ch_ck" },
  { token: "ck", kind: "digraph", hint: "清脆发 /k/", rule: "ck 在短元音后面合发一个清脆的 /k/（如 duck、sock）。", familyId: "sh_ch_ck" },
  { token: "ng", kind: "digraph", hint: "后鼻音 /ŋ/", rule: "ng 在词尾发悠长的后鼻音 /ŋ/（如 morning、sing）。", familyId: "sh_ch_ck" },
  { token: "qu", kind: "digraph", hint: "组合发 /kw/", rule: "q 永远带着好朋友 u 一起出门，合读 /kw/（如 question、quiet）。", familyId: "sh_ch_ck" },
  { token: "kn", kind: "silent", hint: "k 不发音，读 /n/", rule: "kn 在词首时 k 安静睡觉，只读 /n/（如 know、knife）。", familyId: "sh_ch_ck" },
  { token: "wr", kind: "silent", hint: "w 不发音，读 /r/", rule: "wr 在词首时 w 安静睡觉，只读 /r/（如 write、wrong）。", familyId: "sh_ch_ck" },
  { token: "tr", kind: "digraph", hint: "连缀 /tr/", rule: "tr 连读发 /tr/（如 tree、train）。" },
  { token: "dr", kind: "digraph", hint: "连缀 /dr/", rule: "dr 连读发 /dr/（如 dress、drink）。" },
  { token: "st", kind: "digraph", hint: "连缀 /st/", rule: "st 辅音连缀，连读顺滑。" },
  { token: "sp", kind: "digraph", hint: "连缀 /sp/", rule: "sp 辅音连缀，连读顺滑。" },
  { token: "sl", kind: "digraph", hint: "连缀 /sl/", rule: "sl 辅音连缀（如 sleep、slow）。" },
  { token: "sm", kind: "digraph", hint: "连缀 /sm/", rule: "sm 辅音连缀（如 small、smile）。" },
  { token: "sn", kind: "digraph", hint: "连缀 /sn/", rule: "sn 辅音连缀（如 snow、snack）。" },
  { token: "sw", kind: "digraph", hint: "连缀 /sw/", rule: "sw 辅音连缀（如 swim、sweet）。" },
  { token: "pl", kind: "digraph", hint: "连缀 /pl/", rule: "pl 辅音连缀（如 play、plate）。" },
  { token: "bl", kind: "digraph", hint: "连缀 /bl/", rule: "bl 辅音连缀（如 blue、black）。" },
  { token: "cl", kind: "digraph", hint: "连缀 /kl/", rule: "cl 辅音连缀（如 cloud、clock）。" },
  { token: "fl", kind: "digraph", hint: "连缀 /fl/", rule: "fl 辅音连缀（如 flower、fly）。" },
  { token: "gl", kind: "digraph", hint: "连缀 /ɡl/", rule: "gl 辅音连缀（如 glass、glad）。" },
  { token: "br", kind: "digraph", hint: "连缀 /br/", rule: "br 辅音连缀（如 bread、brother）。" },
  { token: "cr", kind: "digraph", hint: "连缀 /kr/", rule: "cr 辅音连缀（如 cry、cream）。" },
  { token: "fr", kind: "digraph", hint: "连缀 /fr/", rule: "fr 辅音连缀（如 friend、fruit）。" },
  { token: "gr", kind: "digraph", hint: "连缀 /ɡr/", rule: "gr 辅音连缀（如 grass、green）。" },
  { token: "pr", kind: "digraph", hint: "连缀 /pr/", rule: "pr 辅音连缀（如 price、pretty）。" },
];

const VOWEL_CHARS = new Set(["a", "e", "i", "o", "u"]);
const SHORT_VOWEL_FAMILY = {
  a: { familyId: "short_a", hint: "元音 a", rule: "元音字母 a 在闭音节常发大口音 /æ/，在开音节读字母本音 /eɪ/。" },
  e: { familyId: "short_e", hint: "元音 e", rule: "元音字母 e 在闭音节常发微笑短音 /e/。" },
  i: { familyId: "short_i", hint: "元音 i", rule: "元音字母 i 在闭音节常发短音 /ɪ/，遇到魔法 e 读本音 /aɪ/。" },
  o: { familyId: "short_o", hint: "元音 o", rule: "元音字母 o 在闭音节常发圆嘴音 /ɒ/，在开音节读 /əʊ/。" },
  u: { familyId: "short_u", hint: "元音 u", rule: "元音字母 u 在闭音节常发小伞音 /ʌ/。" },
};

/**
 * General-purpose algorithmic grapheme chunker for any KET vocabulary entry.
 */
export function segmentWordToPhonics(rawWord) {
  const clean = String(rawWord || "").trim();
  const lower = clean.toLowerCase();
  if (CURATED_PHONICS[lower]) {
    const entry = CURATED_PHONICS[lower];
    const family = WORD_FAMILIES[entry.familyId] || WORD_FAMILIES.short_a;
    return {
      word: clean,
      chunks: entry.chunks,
      rule: entry.rule,
      family: {
        ...family,
        words: family.words.filter((w) => w.toLowerCase() !== lower).slice(0, 4),
      },
    };
  }

  // Handle abbreviations or multi-word phrases (e.g., "a.m.", "p.m.", "a / an", "tidy up")
  if (!/^[a-z]+$/i.test(clean)) {
    const parts = clean.split(/(\s+|\/|\.)/).filter((p) => p.trim() && p !== ".");
    return {
      word: clean,
      chunks: parts.map((text) => ({
        text,
        kind: /[aeiou]/i.test(text) ? "vowel" : "consonant",
        hint: "按词组或字母连读",
      })),
      rule: clean.includes(".") ? "缩写词按单个字母清晰读出即可。" : "常用短语按单词分块自然连读，不用死记硬背。",
      family: {
        ...WORD_FAMILIES.ai_ay,
        words: WORD_FAMILIES.ai_ay.words.slice(0, 4),
      },
    };
  }

  // Detect magic-e pattern (CVCe like make, name, time, like, home, cute)
  const isMagicE =
    lower.length >= 4 &&
    lower.endsWith("e") &&
    !lower.endsWith("ee") &&
    !lower.endsWith("le") &&
    !lower.endsWith("re") &&
    !lower.endsWith("ve") &&
    !VOWEL_CHARS.has(lower[lower.length - 2]) &&
    VOWEL_CHARS.has(lower[lower.length - 3]);

  const chunks = [];
  let matchedRule = "";
  let matchedFamilyId = "";
  let i = 0;

  while (i < lower.length) {
    // Check final magic 'e'
    if (isMagicE && i === lower.length - 1) {
      chunks.push({ text: clean[i], kind: "silent", hint: "魔法结尾 e 不发音" });
      if (!matchedRule) {
        matchedRule = "魔法结尾 e：词尾 e 安静不说话，帮助前面的元音读出字母本音！";
        matchedFamilyId = "magic_e";
      }
      i += 1;
      continue;
    }

    // Check final '-le' after consonant (e.g. table, uncle, bottle)
    if (i === lower.length - 2 && lower.endsWith("le") && i > 0 && !VOWEL_CHARS.has(lower[i - 1])) {
      chunks.push({ text: clean.slice(i, i + 2), kind: "silent", hint: "词尾舌尖音 /l/" });
      i += 2;
      continue;
    }

    // Match multi-character patterns
    let patternMatched = false;
    for (const pat of MULTI_CHAR_PATTERNS) {
      if (lower.startsWith(pat.token, i)) {
        chunks.push({
          text: clean.slice(i, i + pat.token.length),
          kind: pat.kind,
          hint: pat.hint,
        });
        if (!matchedRule && pat.rule) matchedRule = pat.rule;
        if (!matchedFamilyId && pat.familyId) matchedFamilyId = pat.familyId;
        i += pat.token.length;
        patternMatched = true;
        break;
      }
    }
    if (patternMatched) continue;

    // Double consonants (e.g., pp, ll, tt, ss, nn, mm, bb, dd, gg, ff, zz)
    if (
      i + 1 < lower.length &&
      lower[i] === lower[i + 1] &&
      !VOWEL_CHARS.has(lower[i])
    ) {
      chunks.push({
        text: clean.slice(i, i + 2),
        kind: "consonant",
        hint: `双写 ${lower[i]}${lower[i]} 只发一次音`,
      });
      i += 2;
      continue;
    }

    const ch = lower[i];
    if (VOWEL_CHARS.has(ch)) {
      const info = SHORT_VOWEL_FAMILY[ch];
      chunks.push({
        text: clean[i],
        kind: "vowel",
        hint: isMagicE && i === lower.length - 3 ? `读字母 ${ch.toUpperCase()} 本音` : info.hint,
      });
      if (!matchedFamilyId) matchedFamilyId = isMagicE ? "magic_e" : info.familyId;
      if (!matchedRule) matchedRule = isMagicE ? "魔法结尾 e：词尾 e 不出声，让前面的元音读字母本音！" : info.rule;
    } else if (ch === "y" && i === lower.length - 1 && lower.length > 1) {
      chunks.push({
        text: clean[i],
        kind: "vowel",
        hint: "词尾 y 充当元音读 /i/ 或 /aɪ/",
      });
      if (!matchedRule) matchedRule = "y 在词尾常常变身为元音，发 /i/（如 family、happy）或 /aɪ/（如 fly、sky）！";
    } else {
      chunks.push({
        text: clean[i],
        kind: "consonant",
        hint: `辅音 ${ch}`,
      });
    }
    i += 1;
  }

  const family = WORD_FAMILIES[matchedFamilyId] || WORD_FAMILIES.short_a;
  return {
    word: clean,
    chunks,
    rule: matchedRule || "按彩色积木从左到右顺滑拼读，听到声音就能记住单词！",
    family: {
      ...family,
      words: family.words.filter((w) => w.toLowerCase() !== lower).slice(0, 4),
    },
  };
}

/**
 * Returns phonics breakdown for a word object or string.
 */
export function getPhonicsBreakdown(wordOrObj) {
  const text = typeof wordOrObj === "string" ? wordOrObj : wordOrObj?.word || "";
  return segmentWordToPhonics(text);
}

/**
 * Generates a deterministic shuffled tap-to-blend puzzle for multi-chunk words.
 */
export function buildPhonicsPuzzle(wordOrObj) {
  const breakdown = getPhonicsBreakdown(wordOrObj);
  const target = breakdown.chunks.map((chunk, index) => ({
    ...chunk,
    id: `chunk-${index}-${chunk.text}`,
    index,
  }));
  if (target.length <= 1) {
    return { breakdown, target, pool: target };
  }
  // Deterministic non-identity permutation based on word characters
  const pool = [...target];
  let seed = 0;
  for (const ch of breakdown.word) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = (seed + i) % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  if (pool.every((item, idx) => item.index === idx)) {
    pool.reverse();
  }
  return { breakdown, target, pool };
}
