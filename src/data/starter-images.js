// Function-word scenes must be read with their bilingual contexts, not as object labels.
export const starterImages = {
  "l1_all": {
    "src": "word-images/l1_all.webp",
    "alt": "all: all four children in the pictured group are wearing hats",
    "meaning": "全部；所有的（四个孩子全都戴着帽子）",
    "note": "All four visible children wear hats of different colours; no member of this specific group is left out. The paired sentence supplies the quantifier, not the name of a person or a hat. Replaces an unpublished template.",
    "context": {
      "sentence": "All four children are wearing hats.",
      "translation": "四个小朋友全都戴着帽子。"
    },
    "requiresContext": true,
    "reviewStatus": "fixed",
    "sha256": "46340f3554af8711b10698e6ec49c778b470740a2167b3f14cff394bd9a74d7c",
    "meaningSource": "https://dictionary.cambridge.org/dictionary/english/all",
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary learning photograph for ALL, Chinese 全部；所有的, for six-year-olds. Primary request: exactly four primary-school children standing together on a bright outdoor playground, all four wearing clearly visible hats. Each child's hat is a different solid colour (red, blue, green, yellow), and every one of the four has a hat, without exceptions. Full group portrait with natural happy faces, hats, bodies and feet inside the frame, uncluttered schoolyard background, daylight, realistic candid photography, clear details, generous margins. This specific group teaches 'All four children are wearing hats.' The meaning is all members of the pictured four-child group, not all children in the world. No fifth child, no bare-headed child, no hats held in hands instead of worn, no hats cropped out, no text, captions, logos, speech bubbles, icons, montage, illustration, watermark or template layout."
  },
  "l1_also": {
    "src": "word-images/l1_also.webp",
    "alt": "also: a child already holds an apple and receives an additional banana from an adult",
    "meaning": "也；还（已有苹果，又有香蕉）",
    "note": "The apple is already held while the adult and child both hold the arriving banana. The two-sentence context makes the added item explicit; the photo alone is not a synonym for a fruit. Replaces an unpublished template.",
    "context": {
      "sentence": "I have an apple. I also have a banana.",
      "translation": "我有一个苹果。我还有一根香蕉。"
    },
    "requiresContext": true,
    "reviewStatus": "fixed",
    "sha256": "a2c6272b56c1b9c5191a78500fca43a013a5fb398a5851b260b3615705126d21",
    "meaningSource": "https://dictionary.cambridge.org/dictionary/english/also",
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photo for ALSO, Chinese 也；还, for six-year-old learners. Primary request: a child seated at a bright kitchen table already holding one whole red apple in their LEFT hand, while a visible adult's RIGHT hand offers one yellow banana to the child's RIGHT hand. The child's right fingers have just grasped the banana while the adult still holds its far end. Both the already-held apple and the additional banana are large, whole and easy to identify, with the child looking happily at the incoming banana. Two separate natural actions clearly show 'I have an apple. I also have a banana.' This is an addition scene, not two isolated fruits or a generic friendship scene. Natural realistic family photography, clear hands and fruit, uncluttered daylight kitchen, generous square framing with face, hands and complete fruit visible. No additional fruit, extra hands, extra fingers, cartoon arrows, plus sign, written word ALSO, labels, speech bubbles, captions, logos, collage, watermark or illustration."
  },
  "l1_always": {
    "src": "word-images/l1_always.webp",
    "alt": "always: a child puts shoes by the door beside a weekly chart with all seven days checked",
    "meaning": "总是；每次都（把鞋放在门旁的习惯）",
    "note": "The shoe-placement action accompanies seven distinct checked columns, Mon through Sun. This is an illustrative routine paired with the word always, not evidence of a real child's lifelong behaviour. Replaces an unpublished template.",
    "context": {
      "sentence": "I always put my shoes by the door.",
      "translation": "我总是把鞋放在门旁。"
    },
    "requiresContext": true,
    "reviewStatus": "fixed",
    "sha256": "27da2a6d0db07eba114f981b17cdf8878244160e9eb4990d742a59fc4bf601aa",
    "meaningSource": "https://dictionary.cambridge.org/dictionary/english/always",
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photograph for ALWAYS, Chinese 总是；每一次都, for a six-year-old. Primary request: a six-year-old child at a bright home entrance bending to place a pair of blue everyday shoes neatly on a small shoe mat beside the door. Bare socks, fully clothed, natural hands, no unsafe action. On the wall immediately beside the child is a real paper weekly habit chart attached to a small clipboard. The chart has exactly seven clearly printed column headings in order 'Mon Tue Wed Thu Fri Sat Sun', and exactly one large green handwritten check mark under EACH heading, seven checks in one row, no blank or crossed-out day. The shoe-placement action and all seven checked days are both large and in clear focus. The chart is a physical prop in a realistic lifestyle photograph, NOT an overlay, infographic, cartoon, or collage. It establishes a repeated routine for this example: 'I always put my shoes by the door.' It is illustrative, not proof of a real child's lifetime behaviour. Bright inspectable natural light, modest clean hallway, white chart, clearly readable dark day labels, generous framing. No extra columns or days, no multiple rows, no unreadable tiny print, no words ALWAYS or habit slogans, no text elsewhere, logos, captions, watermarks, icons, blurry chart or illustration."
  },
  "l1_a_m": {
    "src": "word-images/l1_a_m.webp",
    "alt": "a.m.: a real classroom clock clearly reads 9:00 AM while a child reads a book",
    "meaning": "上午（图中为上午九点，属于午夜到中午之间）",
    "note": "The large physical display reads 9:00 AM, with AM distinct from PM. Nine is one before-noon example, not a definition limited to sunlight or school hours. Replaces an unpublished template.",
    "context": {
      "sentence": "It is nine in the morning.",
      "translation": "现在是上午九点。"
    },
    "requiresContext": true,
    "reviewStatus": "fixed",
    "sha256": "a39a019217bc7dbc1643ae280a0abdf89f7ddc812e03b3d945e59b143d0a7a6f",
    "meaningSource": "https://dictionary.cambridge.org/dictionary/english/am",
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photograph for A.M. (a.m.), Chinese 午夜十二点到中午十二点之间；图中为上午九点, for six-year-olds. Primary request: a large real white tabletop digital clock dominating the left foreground of a bright primary-school classroom desk, displaying exactly '9:00 AM' in large sharp dark characters. The letters AM must be very clear, not PM and not missing. To the right a fully clothed six-year-old child seated at the school desk is looking at an open picture book with no readable book words. Bright natural daytime light through a classroom window, a few school chairs in the quiet background. The clock is fully inside frame and in focus, approximately forty percent of the image width, with the complete 9:00 AM display readable even at a small card size. Realistic clear editorial photography with natural textures, generous framing and no dramatic blur. This is one before-noon time example; a.m. also includes times after midnight, so do not imply that all a.m. times are sunny or school time. No other clocks, morning wake-up curtains, breakfast meal, fake sun, written teaching captions, brands, logos, watermarks, diagrams, montage or icons. Exact text only on the physical clock display: 9:00 AM."
  },
  "l1_and": {
    "src": "word-images/l1_and.webp",
    "alt": "and: one blue book and one red cup appear side by side as two different objects",
    "meaning": "和（连接书与杯子这两个事物）",
    "note": "One complete blue book and one complete red cup are distinct, equally visible objects. The phrase joins their names with and; neither object alone is labelled as the conjunction. Replaces an unpublished template.",
    "context": {
      "sentence": "A book and a cup.",
      "translation": "一本书和一个杯子。"
    },
    "requiresContext": true,
    "reviewStatus": "fixed",
    "sha256": "9b175d60fa4dd1fca789d85804b2d5ad7ade6ff1721a988f235bc08b643a181e",
    "meaningSource": "https://dictionary.cambridge.org/dictionary/english/and",
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photograph for AND, Chinese 和；连接两个事物, for six-year-old learners. Primary request: exactly one closed blue hardcover children's book AND exactly one plain red ceramic cup, side by side on a clean pale table in a bright home. The whole blue book, its spine and pages, and the entire red cup with a visible curved handle must be fully inside frame with generous margins. The book is on the left and the cup on the right, separated enough to clearly see two different objects, equally prominent. Real realistic still-life photograph, natural soft window daylight, crisp materials and textures, uncluttered neutral surroundings, no decorative gradients. The image is intended to be paired with 'A book and a cup.' to teach conjunction, not to falsely label either object as the word AND. No person, additional book, saucer, plate, pencils, visible book title or cover text, cup text, plus sign, written word AND, captions, logos, watermark, infographic, illustration, collage or template layout."
  },
  "l1_answer": {
    "src": "word-images/l1_answer.webp",
    "alt": "answer: a child responds with a card showing 3 to the teacher's question 2 + 1 = ?",
    "meaning": "答案（名词，图中答案是三）",
    "note": "The physical board shows 2 + 1 = ? and the child's response card shows 3, the correct answer. The sentence teaches the noun sense, not every use including answering a phone. Replaces an unpublished template.",
    "context": {
      "sentence": "The answer is three.",
      "translation": "答案是三。"
    },
    "requiresContext": true,
    "reviewStatus": "fixed",
    "sha256": "5cb57fedffe9dedb4e8c0832f16040ddaf118a433e1b3e5462085166e8c43389",
    "meaningSource": "https://dictionary.cambridge.org/dictionary/english/answer",
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photograph for ANSWER, Chinese 答案（名词）, for a six-year-old learner. Primary request: a bright primary-school classroom, a teacher beside a real clean whiteboard pointing to one very large readable arithmetic question written on it, exactly '2 + 1 = ?'. A six-year-old child facing the teacher holds up a real white answer card at chest height with exactly one large clear handwritten numeral '3'. The teacher is smiling and looking at the correct card. Both the question and the child's response card are large, unobstructed and in focus. Teacher, child, board and card fit inside the square frame with generous margins. Realistic natural classroom photography, ordinary clothes, natural hands, daylight, no dramatic blur. This specific scene illustrates 'The answer is three.' and distinguishes an answer from only a phone or generic speech icon. Exact physical board text: 2 + 1 = ?. Exact physical card text: 3. No other written words or numbers, no incorrect maths, no second card, no raised signs reading ANSWER, no speech bubbles, captions, subtitles, logos, watermarks, collage, illustration, worksheet scan or infographic."
  }
};
