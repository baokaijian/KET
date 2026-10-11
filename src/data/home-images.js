// Each scene illustrates one concrete home word, not a shared home-topic image.
export const homeImages = {
  l3_house: {
    src: "word-images/l3_house.webp", alt: "house: a whole two-storey house with a pitched roof, windows, a front door and a garden", meaning: "房子", reviewStatus: "pass",
    sha256: "31da14e3d939ea8eb3899e7acc924f473bf6578ce940560831382754bbbc4468",
    note: "The complete exterior, roof, entrance and windows identify a house, not a close-up of one room or door.",
    context: { sentence: "This is a house with a garden.", translation: "这是一栋有花园的房子。" },
    generationPrompt: "One entire lived-in two-storey detached house seen from outside, front door, windows, pitched roof and small garden all visible; eye-level straight-on photograph, no neighbouring buildings, people, vehicles or toy models.",
  },
  l3_room: {
    src: "word-images/l3_room.webp", alt: "room: the inside of a child's room, with walls, a floor, a window, a bed and shelving", meaning: "房间", reviewStatus: "pass",
    sha256: "2bf0d07b151ea63a71b72efeb5e8e509d9055ba5b8cf6fe4e0a0b960fb539b4d",
    note: "The wall corner, ceiling, floor and several furnishings show an enclosed interior space as a whole, unlike the exterior house photograph.",
    context: { sentence: "My room has a bed and a window.", translation: "我的房间里有一张床和一扇窗户。" },
    generationPrompt: "One whole bright simple children's room seen from a corner, enclosed interior with walls, floor, ceiling edge, a window, a single bed, low shelving and a rug; the room as a whole is the subject, no people or exterior building.",
  },
  l3_door: {
    src: "word-images/l3_door.webp", alt: "door: a blue interior door standing open, with its handle, hinges and doorway visible", meaning: "门", reviewStatus: "pass",
    sha256: "73017fd29a7ae6ba28a8fce9b2e819a63531ee1807c97de7beae540e95382d7a",
    note: "A full solid blue door with handle and hinges opens into a hallway; it is not a glazed window or a whole building.",
    context: { sentence: "The blue door is open.", translation: "蓝色的门开着。" },
    generationPrompt: "One whole simple blue interior door open about thirty-five degrees in a white doorway; solid panel, metal handle, hinges and threshold clearly visible, tiny empty hallway beyond, no windows, people or furniture.",
  },
  l5_window: {
    src: "word-images/l5_window.webp", alt: "window: a white-framed glass window with a sill, an open casement and a garden visible outside", meaning: "窗户", reviewStatus: "pass",
    sha256: "271386eaa3006688b31408762aa9a3c1d28e1a0a9dbc3936b56ef356ccb13396",
    note: "Transparent glass panes, a sill and an open framed casement distinguish a window from the solid door; the garden is visible through the glass.",
    context: { sentence: "I can see the garden through the window.", translation: "我能透过窗户看见花园。" },
    generationPrompt: "One whole white-framed glazed home window seen from inside straight on, sill and handle visible, one casement slightly open, garden through clear glass; no curtains hiding the frame, no door, people, furniture or computer screen.",
  },
  l3_chair: {
    src: "word-images/l3_chair.webp", alt: "chair: one wooden chair with a backrest, a green seat and four legs", meaning: "椅子", reviewStatus: "pass",
    sha256: "56903303bbffe110a89df0a7044ddf9a0912473891c9d71cbe2f7b2bc3788786",
    note: "The upright backrest, cushioned seat and four support legs are visible in a full three-quarter view, with no table or other furniture.",
    context: { sentence: "The chair has four legs.", translation: "这把椅子有四条腿。" },
    generationPrompt: "One whole ordinary freestanding wooden chair with a green seat cushion, upright backrest and four visible legs, three-quarter view on a light grey studio floor; no wheels, sofa, stool, table, people or other objects.",
  },
  l3_table: {
    src: "word-images/l3_table.webp", alt: "table: one round wooden table with a flat top and four legs, without drawers", meaning: "桌子", reviewStatus: "pass",
    sha256: "99652ff6a481e0dc90d81cb5e389f7f44f7086bb1076165c69a07cc3f7805afe",
    note: "An empty round tabletop and four legs clearly show a table; no built-in drawers, writing materials or chairs obscure the distinction from desk.",
    context: { sentence: "This round table has no drawers.", translation: "这张圆桌没有抽屉。" },
    generationPrompt: "One simple round light oak dining table with a flat tabletop and four legs, entire object in a three-quarter view, plain light grey studio; no drawers, shelves, desk hutch, chairs, school materials, food, laptop or people.",
  },
  l3_bed: {
    src: "word-images/l3_bed.webp", alt: "bed: a single bed with a white frame, a pillow and a green blanket", meaning: "床", reviewStatus: "pass",
    sha256: "0cdf27ab424c89a373aa12f50b563612059daee9c188578428c03d5a08a2b695",
    note: "The complete sleeping surface, pillow, blanket, headboard and footboard identify a bed; not a sofa, cot or medical bed.",
    context: { sentence: "My bed has a pillow and a green blanket.", translation: "我的床上有一个枕头和一条绿色的毯子。" },
    generationPrompt: "One whole neatly made child's single bed, white wooden frame, headboard and footboard, mattress, white pillow and green blanket; full natural three-quarter view, bright plain wall and floor, no people, toys, lamp, table, sofa or hospital equipment.",
  },
  l10_lamp: {
    src: "word-images/l10_lamp.webp", alt: "lamp: a lit table lamp with a red shade, a white stem and a round base", meaning: "台灯", reviewStatus: "pass",
    sha256: "21f55d8a62573fa8921eb1d66ee27cf84b72061d40e0a9dc56bfb94485c33f97",
    note: "A red lampshade, white stem, round base, power cord and light beneath the shade show a switched-on table lamp, not a ceiling fixture or flashlight.",
    context: { sentence: "The lamp gives us light.", translation: "这盏台灯给我们照明。" },
    generationPrompt: "One whole freestanding table lamp, red fabric shade, white upright stem and round base, turned on with a gentle visible light beneath the shade, realistic cord, plain light grey studio; no ceiling fixture, flashlight, candle, furniture or people.",
  },
};
