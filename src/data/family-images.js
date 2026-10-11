// Kinship is established by the teaching context, not inferred from a person's appearance.
export const familyImages = {
  l10_mother: {
    src: "word-images/l10_mother.webp", alt: "mother: a mother brushing her child's hair at home before school", meaning: "妈妈", reviewStatus: "pass",
    sha256: "c638d36646e64be7b1aea4693492e3ba2a7c38b698620514bb874712d3799679",
    note: "Adult woman caring for a child in a home bedroom, with a hairbrush and school bag; the paired sentence identifies her mother role.",
    context: { sentence: "My mother brushes my hair.", translation: "我的妈妈给我梳头。" },
    generationPrompt: "A mother brushing her six-year-old child's hair in a bright home bedroom before school; adult mother as main subject, both faces and natural hands visible, no classroom or generic portrait.",
  },
  l10_father: {
    src: "word-images/l10_father.webp", alt: "father: a father kneeling to help his child tie a shoe by their home's front door", meaning: "爸爸", reviewStatus: "pass",
    sha256: "594309c7ffa254a6caad2b0f2c3d2ef34d4dca28c20aea6729e66a6bbd5566b2",
    note: "Adult man helps a child with a shoe at the home entrance; caring parent-child interaction is paired with an explicit father sentence.",
    context: { sentence: "My father helps me tie my shoes.", translation: "我的爸爸帮我系鞋带。" },
    generationPrompt: "A caring father kneeling beside his six-year-old son, helping tie the child's shoe at the home front door; child seated on a low bench, bright daytime light, natural faces and hands.",
  },
  l1_sister: {
    src: "word-images/l1_sister.webp", alt: "sister: an older sister drawing a picture together with her younger brother at home", meaning: "姐姐", reviewStatus: "pass",
    sha256: "d29244130cb829d7e08bfef151d38a8de6e963021ecb2f6725c8dc3716d791dd",
    note: "Older girl and younger boy draw together in a home setting; the caption specifies older sister, without claiming that appearance alone proves kinship.",
    context: { sentence: "My sister draws with me.", translation: "我的姐姐和我一起画画。" },
    generationPrompt: "A seven-year-old older sister helping her four-year-old younger brother draw at a low table at home; girl as main subject, coloured pencils and simple shapes, no adults or classroom.",
  },
  l10_brother: {
    src: "word-images/l10_brother.webp", alt: "brother: an older brother helping his younger sister build a wooden block tower at home", meaning: "哥哥", reviewStatus: "pass",
    sha256: "6fd545e8ff6db3f79e8cf07c15678c8478cbcc6242a9496ae5d9aa0b2d52e4fd",
    note: "An older child, not an adult father, helps a younger girl build a block tower; the sentence explicitly establishes the older-brother role.",
    context: { sentence: "My brother helps me build a tower.", translation: "我的哥哥帮我搭一座积木塔。" },
    generationPrompt: "A nine-year-old older brother helping his five-year-old little sister build a colourful wooden block tower on their living-room floor; older boy as main subject, clear age difference, no adults or drawing scene.",
  },
  l10_family: {
    src: "word-images/l10_family.webp", alt: "family: parents and children sharing a meal and talking together at home", meaning: "家庭", reviewStatus: "pass",
    sha256: "77863329571ba7dcb1cdf304878016ea0574b8c14e124148770e0373b0b018a5",
    note: "Four people share a home meal and interact as a family group; this is one example, not a rule about every family's structure.",
    context: { sentence: "My family eats together at home.", translation: "我的家人在家一起吃饭。" },
    generationPrompt: "One family of four sharing a meal at home, parents and two children smiling and talking together; whole family group as main subject, all faces visible, food secondary, no restaurant or isolated headshots.",
  },
  l10_grandmother: {
    src: "word-images/l10_grandmother.webp", alt: "grandmother: a grandmother reading a picture book to her grandchild in a home armchair", meaning: "奶奶/外婆", reviewStatus: "pass",
    sha256: "0f02deb20ede5bce5d30e4b4b64570124a682851970af92e5fd2391bcd8d6f73",
    note: "An older woman and a child share a picture book at home; the explicit grandmother sentence establishes the intergenerational family role, not a teacher role.",
    context: { sentence: "My grandmother reads a story to me.", translation: "我的奶奶给我读故事。" },
    generationPrompt: "A visibly older silver-haired grandmother reading an open picture book to her six-year-old granddaughter in a home armchair; older woman as main subject, bright calm living room, no medical setting or classroom.",
  },
  l10_grandfather: {
    src: "word-images/l10_grandfather.webp", alt: "grandfather: a grandfather planting flowers with his grandchild in their home garden", meaning: "爷爷/外公", reviewStatus: "pass",
    sha256: "f4d032d58d35d4ff9d0ef67ed888956b27e5e153e4bac216069d8f56caf03945",
    note: "Older grey-haired man and a child plant flowers beside a home; the grandfather caption establishes the family relationship rather than a gardener occupation.",
    context: { sentence: "My grandfather plants flowers with me.", translation: "我的爷爷和我一起种花。" },
    generationPrompt: "A visibly older grey-haired grandfather around seventy planting flowers with his six-year-old grandson in their home garden; older man as main subject, warm eye contact, natural hands, no professional uniform.",
  },
  l2_baby: {
    src: "word-images/l2_baby.webp", alt: "baby: one awake smiling infant in a yellow romper lying on a plain play mat", meaning: "宝宝", reviewStatus: "pass",
    sha256: "4d1fb80f8000ce4a20a758114cc2e193757d8f73255a3cbd488f85e37a62bb24",
    note: "Whole awake infant has a round baby face, small hands and feet and is lying on a play mat; not an older standing child or a generic person.",
    context: { sentence: "The baby is smiling.", translation: "宝宝在笑。" },
    generationPrompt: "One awake six-month-old baby wearing a soft yellow romper, lying on their back on a firm plain padded play mat; whole infant visible, happy and alert, no adult, standing toddler or loose blanket near the face.",
  },
};
