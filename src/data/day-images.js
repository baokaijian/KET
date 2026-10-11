// Eight distinct scenes were individually checked; clock times are examples, not definitions.
export const dayImages = {
  "l1_morning": {
    "src": "word-images/l1_morning.webp",
    "alt": "morning: a child opens bedroom curtains in daylight beside a clock showing 7:00 AM",
    "meaning": "早晨；上午（图中为七点）",
    "reviewStatus": "pass",
    "sha256": "e4bfdbbeb11a2e66ebede41ee9a816d661c771c32f6919b8f54d97780f1b479d",
    "note": "Bright daylight, opening curtains and a legible 7:00 AM clock establish a morning example, not a universal wake-up time.",
    "context": {
      "sentence": "It is seven in the morning.",
      "translation": "现在是早上七点。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photo for MORNING, Chinese 早晨；上午, for six-year-olds. Primary request: a cheerful six-year-old child, fully clothed in modest pyjamas, opening the curtains of a bedroom window in early morning daylight. In the large foreground on a bedside table, one physical digital clock clearly shows exactly '7:00 AM' in crisp dark digits and letters. The whole clock display is front-facing, legible and takes enough space to read even in a small learning card. Bright gentle sunlight is entering the window; a made-looking rumpled bed is secondary context. Clear realistic lifestyle photography, fresh daylight, child and large clock both in focus, generous framing. The clock and waking activity establish a specific morning example; do not use only a sun icon or written vocabulary word. No meal, other clocks, evening sky, night scene, nude skin, brands, logos, captions, diagrams, collage, watermark or illustration. Exact text on real clock display: 7:00 AM. Do not print the word MORNING anywhere."
  },
  "l1_afternoon": {
    "src": "word-images/l1_afternoon.webp",
    "alt": "afternoon: a child draws at a desk in daylight beside a clock showing 3:00 PM",
    "meaning": "下午（图中为三点）",
    "reviewStatus": "pass",
    "sha256": "393bb15b7cc4db28f402adecaeea2fc855bf3f63acfc150d05a7686e3526ab52",
    "note": "Drawing in daylight and a legible 3:00 PM clock establish an afternoon example; the activity alone does not define the time.",
    "context": {
      "sentence": "It is three in the afternoon.",
      "translation": "现在是下午三点。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photo for AFTERNOON, Chinese 下午, for six-year-olds. Primary request: a six-year-old child in ordinary daytime clothes drawing with pencils at a home study desk beside a window filled with clear bright daytime light. A real compact digital desk clock in the large sharp foreground displays exactly '3:00 PM'. The whole clock face is clear and front-facing enough to read at small card size, with the child, drawing paper and sunny window in focus behind it. Distinct scene from waking up or evening television; the afternoon time is established by 3:00 PM, not guessed from sky colour alone. Bright natural realistic lifestyle photography, clean uncluttered desk, generous margins. No meals, bed, curtains being opened, toy sun, giant superimposed text, labels, other clocks, brands, logos, watermark, illustration or collage. Exact text on physical clock: 3:00 PM. Do not print AFTERNOON anywhere."
  },
  "l1_evening": {
    "src": "word-images/l1_evening.webp",
    "alt": "evening: an adult and child read on a sofa at dusk beside a clock showing 7:00 PM",
    "meaning": "傍晚；晚上（图中为七点）",
    "reviewStatus": "pass",
    "sha256": "4d39694806f7783600e5ec854be55fcb873bbf424cbcd2fea77374c3ef92b6d5",
    "note": "Reading together, lamplight, dusk and a 7:00 PM clock establish early evening; sunset timing is not universal.",
    "context": {
      "sentence": "It is seven in the evening.",
      "translation": "现在是晚上七点。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photo for EVENING, Chinese 傍晚；晚上（夜间较早的时候）, for six-year-olds. Primary request: a parent and a six-year-old child sitting together on a living-room sofa looking at a picture book, with a softly glowing lamp and a window showing the last pale golden-pink light of dusk outside. A real digital clock on the nearby foreground side table shows exactly '7:00 PM', large crisp display fully inside the frame. Calm early-evening family activity, not a bedroom or meal scene. Warm but bright inspectable realistic lifestyle photograph, clear faces and book, clock and window both in focus, generous margins. Dusk and 7:00 PM establish this particular evening example, not a universal sunset time. No dark silhouetted people, sleeping child, night stars, extra clocks, readable book text, printed word EVENING, logos, labels, watermark, diagrams, icons or collage. Exact physical clock text: 7:00 PM."
  },
  "l1_night": {
    "src": "word-images/l1_night.webp",
    "alt": "night: a quiet lit room with a dark sky and moon outside, and a clock showing 10:00 PM",
    "meaning": "夜晚（图中为晚上十点）",
    "reviewStatus": "pass",
    "sha256": "db0b5e37feedab27a8aa55743cbc83d455f029119f6c9c0ef91efa60267307e1",
    "note": "Dark sky and moon outside a quiet lit room with 10:00 PM distinguish night from the brighter dusk scene; no child is depicted staying up.",
    "context": {
      "sentence": "It is ten at night.",
      "translation": "现在是夜里十点。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photograph for NIGHT, Chinese 夜晚, for six-year-old learners. Primary request: a quiet empty home sitting room at night, with a large window clearly showing a dark night sky, a small natural crescent moon and a few distant stars over softly lit neighbouring homes. The inside room remains bright enough to inspect because one warm table lamp illuminates a foreground table and a small sofa. On the foreground table a real digital clock displays exactly '10:00 PM', large sharp readable display fully inside frame. No people, so this is not encouraging a child to stay awake late. Realistic editorial interior photograph, clear window and clock both in focus, modest uncluttered scene, generous margins. This particular night example is distinguished from evening by dark sky and 10:00 PM. No visible daylight or sunset glow, extra moons, giant moon, meals, sleeping person, other clocks, word NIGHT, captions, logos, icons, watermark, illustrations or collage. Physical clock exact text: 10:00 PM."
  },
  "l2_breakfast": {
    "src": "word-images/l2_breakfast.webp",
    "alt": "breakfast: a child eats porridge, toast and milk at home beside a clock showing 8:00 AM",
    "meaning": "早餐（图中为上午八点）",
    "reviewStatus": "pass",
    "sha256": "a4f32ec0365bb84c83cbc63090efae862566795103412da7389d0885f2ed4d3b",
    "note": "A child eats a morning meal beside a clearly readable 8:00 AM clock; porridge, toast and milk are examples, not requirements for breakfast.",
    "context": {
      "sentence": "I have breakfast at eight.",
      "translation": "我早上八点吃早餐。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photograph for BREAKFAST, Chinese 早餐, for six-year-old learners. Primary request: a six-year-old child seated at a bright home kitchen table eating breakfast from a small bowl of porridge with fruit, with one piece of toast and a glass of milk nearby. A real physical digital clock on the kitchen table clearly displays exactly '8:00 AM'. The child, bowl, breakfast food and entire clock display are all sharp and large enough to inspect. Daylight enters a simple kitchen window; breakfast meal activity is the main subject, not an isolated food product. Cheerful ordinary lifestyle photography, realistic crockery, food and child proportions, uncluttered composition, generous margins. No giant meals, coffee or alcohol for the child, dinner dishes, school cafeteria, other clocks, brands, logos, written vocabulary word, captions, watermark, illustration, collage or icons. Exact clock text: 8:00 AM. This is one breakfast example, not a claim that a particular food or hour defines every breakfast."
  },
  "l2_lunch": {
    "src": "word-images/l2_lunch.webp",
    "alt": "lunch: a child eats from a lunchbox in a school dining room beside a clock showing 12:00 PM",
    "meaning": "午餐（图中为中午十二点）",
    "reviewStatus": "pass",
    "sha256": "191a5a1f2704d734517cd443849d81737efc7350314e0c4baf1d7989eff4a417",
    "note": "Lunchbox, school dining tables and a legible 12:00 PM clock show a midday meal, not another generic food still life.",
    "context": {
      "sentence": "We have lunch at twelve.",
      "translation": "我们中午十二点吃午餐。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photo for LUNCH, Chinese 午餐, for six-year-old learners. Primary request: a six-year-old child in ordinary school-day clothes seated at a small primary-school dining table eating lunch from an open compartment lunchbox, with rice, cooked vegetables and small chicken pieces clearly visible. A real simple digital clock placed on a cafeteria shelf immediately beside the table clearly shows exactly '12:00 PM', front-facing large readable display. A few school chairs and another lunch table establish the dining-room setting; the child, lunchbox and clock are all clear and large enough to inspect. Bright natural midday window light, realistic candid photography, no text on clothing, uncluttered composition and generous margins. This is a specific midday school lunch example, not a rule about what all lunches contain. No breakfast porridge or toast, evening lamp setting, wine, brands, school names, other clocks, printed word LUNCH, captions, logo, watermark, illustration, diagrams or collage. Exact text on physical clock display: 12:00 PM."
  },
  "l2_dinner": {
    "src": "word-images/l2_dinner.webp",
    "alt": "dinner: a family shares an evening meal at home beside a clock showing 6:00 PM",
    "meaning": "正餐（此处为晚餐）",
    "reviewStatus": "fixed",
    "sha256": "37314416c8babba3af5691bfc65678111f90cf83d5dfe4df2ad487c4910aa365",
    "note": "The original rear clock was too small. The edited large foreground clock reads 6:00 PM, the rear clock is removed, and the family meal and dusk remain. This illustrates an evening dinner, not every possible dinner time.",
    "context": {
      "sentence": "We have dinner at six.",
      "translation": "我们晚上六点吃晚餐。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photo for DINNER, Chinese 正餐（此处为晚餐）, for six-year-old learners. Primary request: a family of two adults and a six-year-old child seated together at a modest home dining table, sharing their substantial evening meal with plates of rice, cooked vegetables and chicken, a serving bowl and water glasses. A real digital clock on a small sideboard beside the table clearly reads exactly '6:00 PM', its entire display large, sharp and readable. A window shows gently fading early-evening daylight and a ceiling dining lamp keeps the people and food bright and inspectable. Realistic candid lifestyle photograph, ordinary portions, complete visible faces, natural hands and utensils, generous margins and uncluttered meal setting. This picture teaches one evening dinner example; dinner can also mean a main midday meal, so do not imply a universal fixed schedule. No breakfast porridge, lunchbox, school setting, alcohol, brands, logos, other clocks, vocabulary labels, captions, watermark, illustration, icons, collages or diagrams. Exact physical clock text: 6:00 PM.",
    "refinementPrompt": "Use case: photorealistic-natural. Targeted edit of this DINNER learning photograph. Preserve the same family, their faces, clothes, seated positions, healthy meal, table, sunset window, lighting and square photographic style. Remove the small digital clock from the rear-right sideboard. Put exactly one larger physical tabletop digital clock on the empty foreground-right corner of the dining table, with its entire face and case inside frame, not obscuring people or plates. Its front face should be about one quarter of the photograph width, facing the camera clearly. The clock display must read exactly '6:00 PM', with large sharp white digits and visibly legible PM. This is a real object in the scene, not an overlay or printed caption. Keep natural perspective and shadows. No second clock, additional text, logos or changed faces. This clock time is one evening-meal example, not a universal dinner time."
  },
  "l12_sleep": {
    "src": "word-images/l12_sleep.webp",
    "alt": "sleep: a child lies asleep in bed with closed eyes and a head resting on a pillow",
    "meaning": "睡觉（动词）",
    "reviewStatus": "pass",
    "sha256": "146a49b2a98963b0600c97381f1fe64900279d2879cf59fd1ba7a9222fef25f4",
    "note": "Both eyes are visibly closed, the face and hand relaxed, the head rests on a pillow and the clothed body is under a blanket; the action is sleep, not lying awake.",
    "context": {
      "sentence": "I sleep in my bed.",
      "translation": "我在自己的床上睡觉。"
    },
    "generationPrompt": "Use case: photorealistic-natural. Asset type: one square KET vocabulary photograph for SLEEP, Chinese 睡觉（动词）, for six-year-old learners. Primary request: a fully clothed six-year-old child in modest long-sleeved pyjamas, peacefully asleep lying on their side in an ordinary clean bed. Both eyelids are clearly fully closed, facial muscles relaxed, head resting naturally on a pillow, one hand relaxed beside the face, body under a soft blanket up to the shoulders. The sleeping face, closed eyes, pillow and bed are the clear central subject with generous margins. Soft gentle bedside light sufficiently bright to see eyelids and bed details; calm realistic family editorial photograph, natural anatomy. No awake or reading person, eyes looking down, sitting upright, medical setting, illness, crying, food, clocks, readable words, labels, overlays, logos, watermarks, illustration or collage. Depict the action of sleeping, not merely lying awake or a dark night landscape."
  }
};
