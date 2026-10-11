// Objects and actions use different photographs; a park scene is not a verb illustration.
export const parkImages = {
  l7_park: {
    src: "word-images/l7_park.webp", alt: "park: a public park with a lawn, a curving footpath, a bench and a playground", meaning: "公园（名词）", reviewStatus: "pass",
    sha256: "7c54e1de92c931b1251575506ce0351e993f219ea10b4e85e5f647e42dde80b5",
    note: "Open recreation space has a pedestrian path, bench and playground; teaches the noun park, not parking a car.",
    context: { sentence: "This is a park with a playground.", translation: "这是一个有游乐场的公园。" },
    generationPrompt: "A whole public park scene with a curving pedestrian path, green lawn, mature trees, a park bench and distant swings and slide; bright eye-level natural photo, no roads, parked vehicles, private house garden or single-tree close-up.",
  },
  l7_tree: {
    src: "word-images/l7_tree.webp", alt: "tree: one leafy tree with its trunk, branches and whole green canopy visible", meaning: "树木", reviewStatus: "pass",
    sha256: "1d080f9a39fb4212e80e07226c877f495bed172e47b1d2a1c428fc0b185c5036",
    note: "One foreground tree has a brown trunk, branching structure and leafy canopy from ground to crown; background vegetation is secondary.",
    context: { sentence: "This tree has a trunk and leaves.", translation: "这棵树有树干和树叶。" },
    generationPrompt: "One whole real deciduous tree on short grass, brown trunk, spreading branches and green canopy fully visible with margin; bright sky and soft distant meadow, no people, bench, house, plant pot or park panorama.",
  },
  l7_flower: {
    src: "word-images/l7_flower.webp", alt: "flower: one red flower with a visible centre, petals, green stem and leaf", meaning: "花朵", reviewStatus: "pass",
    sha256: "eee683df74f325063509c201c9315509b16c58fa8c318b7f5af36b1185904d4b",
    note: "A single red flower head has a visible centre and complete petals, with stem and a leaf; not a bouquet, tree or generic garden scene.",
    context: { sentence: "This flower has red petals.", translation: "这朵花有红色的花瓣。" },
    generationPrompt: "One fresh red gerbera daisy, circular centre and red petals, slim green stem and one leaf; natural botanical close photograph, pale green garden background, no bouquet, vase, hands, plant pot or insect as subject.",
  },
  l7_ball: {
    src: "word-images/l7_ball.webp", alt: "ball: one round blue-and-yellow rubber playground ball resting on grass", meaning: "球", reviewStatus: "pass",
    sha256: "33d6dd6d718b7ea64c02e9754f0bbb746257d2fad1a56d11f563f9723ae26dea",
    note: "A whole round rubber ball has visible texture, seam and ground contact; not a flat circle, planet or a child playing an unspecified game.",
    context: { sentence: "The ball is on the grass.", translation: "球在草地上。" },
    generationPrompt: "One real round rubber playground ball, blue with one yellow curved panel, resting on short grass; whole ball with realistic rubber texture and contact shadow, no child, goal, bat or pile of balls.",
  },
  l7_play: {
    src: "word-images/l7_play.webp", alt: "play: two children playing a board game, one moving a red game token", meaning: "玩游戏（动词）", reviewStatus: "pass",
    sha256: "635003d570110a4055c86b3d99a36306f018f1c6266fbe7a464eca6884b09a76",
    note: "One child moves a token while another watches the game and smiles; shows playing a game, not a theatre play or performing music.",
    context: { sentence: "We play a game together.", translation: "我们一起玩游戏。" },
    generationPrompt: "Two six-year-old children actively playing a colourful board game at a low table in a bright home playroom; one moves a token, the other watches smiling, visible game board, no drawing, worksheets, musical instrument or block tower.",
  },
  l2_run: {
    src: "word-images/l2_run.webp", alt: "run: a child running across grass with a long stride, bent arms and both feet off the ground", meaning: "跑", reviewStatus: "pass",
    sha256: "2d99f5cae3c51022156700faf33f33e77b1f3ac36143223971c759adc0d34124",
    note: "Full-body side view shows an extended running stride and bent swinging arms, with both shoes airborne; not the relaxed grounded walking pose.",
    context: { sentence: "I run on the grass.", translation: "我在草地上跑步。" },
    generationPrompt: "One six-year-old child in a red T-shirt running across a safe flat lawn, full body, long stride, bent elbows, trailing leg bent back and both shoes momentarily off the ground; crisp side-on action, no road, ball or jumping vertically.",
  },
  l12_jump: {
    src: "word-images/l12_jump.webp", alt: "jump: a child jumping upward with both feet together above the grass and arms raised", meaning: "跳", reviewStatus: "pass",
    sha256: "1d98e5ecae557f61e67b99bd88fbff11487f11501854ca84f8b48094d9853953",
    note: "Both feet are together and clearly above the lawn, arms raised and shadow below; vertical jumping differs from the horizontal running stride.",
    context: { sentence: "I can jump with both feet.", translation: "我能双脚一起跳起来。" },
    generationPrompt: "One six-year-old girl in a turquoise shirt jumping upward on a flat lawn, whole body, both feet together off the ground, knees slightly bent, arms raised, visible gap and natural shadow; no running stride, trampoline, height or hurdle.",
  },
  l2_walk: {
    src: "word-images/l2_walk.webp", alt: "walk: a child walking along a park path with relaxed arms and a shoe on the ground", meaning: "走路（动词）", reviewStatus: "pass",
    sha256: "ca469648001fcf52df11158ecddf9a5869a1b0d686468d8f062f0707d810b64b",
    note: "Upright body, relaxed straight arms and a grounded short step show walking; neither both feet airborne nor a long running stride.",
    context: { sentence: "I walk along the path.", translation: "我沿着小路走。" },
    generationPrompt: "One six-year-old child in a green shirt calmly walking along a flat park path, whole side-on body, upright posture, relaxed arms and modest grounded step; no long airborne running stride, jumping, companions, backpack or road traffic.",
  },
};
