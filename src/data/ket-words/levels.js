// KET Learning Levels & Scenario Category Definitions
// Generated from Cambridge A2 Key Vocabulary List PDF

export const topicCategories = [
  { id: "time_calendar", name: "时间日历 Time & Calendar", color: "#23794d", icon: "Calendar", levels: [12], scene: "时间日历", scenePrompt: "认识星期、月份与时段，理解先后顺序并安排生活。" },
  { id: "positions", name: "位置方向 Positions", color: "#23794d", icon: "Move", levels: [3], scene: "位置方向", scenePrompt: "描述物品在哪里，理解上下、前后、旁边和移动方向。" },
  { id: "animals", name: "动物朋友 Animals", color: "#23794d", icon: "PawPrint", levels: [6], scene: "动物朋友", scenePrompt: "认识动物，描述它们的身体、动作与生活环境。" },
  { id: "clothes", name: "穿衣搭配 Clothes", color: "#23794d", icon: "Shirt", levels: [8], scene: "穿衣搭配", scenePrompt: "认识衣服、鞋帽和配饰，按天气选择合适的穿着。" },
  {
    "id": "daily_starters",
    "name": "日常开口 Daily Starters",
    "color": "#2563eb",
    "icon": "MessageCircle",
    "levels": [
      1
    ],
    "scene": "日常开口",
    "scenePrompt": "用这些词完成问候、请求、回答和简单描述。"
  },
  {
    "id": "family_friends",
    "name": "家人与朋友 Family & Friends",
    "color": "#0f766e",
    "icon": "Users",
    "levels": [
      1
    ],
    "scene": "家人与朋友",
    "scenePrompt": "介绍家人朋友，描述人物关系和简单感受。"
  },
  {
    "id": "food_cafe",
    "name": "餐厅点餐 Food & Cafe",
    "color": "#d97706",
    "icon": "UtensilsCrossed",
    "levels": [
      2
    ],
    "scene": "餐厅点餐",
    "scenePrompt": "在家、餐厅或咖啡馆点餐，描述食物和饮品。"
  },
  {
    "id": "body_health",
    "name": "健康求助 Health & Body",
    "color": "#dc2626",
    "icon": "Heart",
    "levels": [
      2
    ],
    "scene": "健康求助",
    "scenePrompt": "描述身体、感受、病痛，并在需要时寻求帮助。"
  },
  {
    "id": "home_room",
    "name": "家庭房间 House & Home",
    "color": "#0891b2",
    "icon": "Home",
    "levels": [
      3
    ],
    "scene": "家庭房间",
    "scenePrompt": "介绍家里的房间、家具、电器和日常物品。"
  },
  {
    "id": "school_library",
    "name": "学校课堂 School & Library",
    "color": "#7c3aed",
    "icon": "School",
    "levels": [
      4
    ],
    "scene": "学校课堂",
    "scenePrompt": "在课堂、图书馆和考试中使用学习词汇。"
  },
  {
    "id": "city_travel",
    "name": "城市出行 Travel & City",
    "color": "#0284c7",
    "icon": "MapPin",
    "levels": [
      5
    ],
    "scene": "城市出行",
    "scenePrompt": "在城市中问路、乘车、旅行和描述地点。"
  },
  {
    "id": "nature_weather",
    "name": "天气计划 Weather & Nature",
    "color": "#16a34a",
    "icon": "Cloud",
    "levels": [
      6
    ],
    "scene": "天气计划",
    "scenePrompt": "谈论天气、季节、自然环境和户外安排。"
  },
  {
    "id": "sports_hobbies",
    "name": "运动爱好 Sports & Hobbies",
    "color": "#ea580c",
    "icon": "Trophy",
    "levels": [
      7
    ],
    "scene": "运动爱好",
    "scenePrompt": "聊运动、比赛、周末活动和个人爱好。"
  },
  {
    "id": "feelings_descriptions",
    "name": "感受描述 Feelings & Descriptions",
    "color": "#db2777",
    "icon": "Smile",
    "levels": [
      8
    ],
    "scene": "感受描述",
    "scenePrompt": "表达心情、观点、外貌和事物特征。"
  },
  {
    "id": "shopping_work",
    "name": "购物与工作 Shopping & Work",
    "color": "#be123c",
    "icon": "ShoppingCart",
    "levels": [
      9
    ],
    "scene": "购物与工作",
    "scenePrompt": "买东西、询价付款，并认识职业和工作场景。"
  },
  {
    "id": "tech_media",
    "name": "科技与娱乐 Tech & Entertainment",
    "color": "#4f46e5",
    "icon": "Smartphone",
    "levels": [
      10
    ],
    "scene": "科技与娱乐",
    "scenePrompt": "使用科技工具，认识音乐、电影、表演和娱乐内容。"
  },
  {
    "id": "exam_expressions",
    "name": "考试表达 Exam Expressions",
    "color": "#64748b",
    "icon": "Target",
    "levels": [
      11
    ],
    "scene": "考试表达",
    "scenePrompt": "复习考试说明、连接词、短语动词和高频表达。"
  },
  {
    "id": "full_review",
    "name": "日常行动 Everyday Actions",
    "color": "#059669",
    "icon": "Sparkles",
    "levels": [
      12
    ],
    "scene": "日常行动",
    "scenePrompt": "描述常见动作、交流、思考和日常安排。"
  }
];

export const levels = [
  {
    "id": 1,
    "name": "日常开口",
    "emoji": "🌱",
    "description": "用这些词完成问候、请求、回答和简单描述。",
    "topics": [
      "daily_starters",
      "family_friends"
    ],
    "targetWeeks": "第 1-4 周",
    "unlockRequirement": 0
  },
  {
    "id": 2,
    "name": "食物与健康",
    "emoji": "🍎",
    "description": "分主题学习食物与身体，点餐课与健康课分别安排。",
    "topics": [
      "food_cafe",
      "body_health"
    ],
    "targetWeeks": "第 5-8 周",
    "unlockRequirement": 70
  },
  {
    "id": 3,
    "name": "家庭房间",
    "emoji": "🏠",
    "description": "介绍家里的房间、家具、电器和日常物品。",
    "topics": [
      "home_room"
    ],
    "targetWeeks": "第 9-12 周",
    "unlockRequirement": 70
  },
  {
    "id": 4,
    "name": "学校课堂",
    "emoji": "🏫",
    "description": "在课堂、图书馆和考试中使用学习词汇。",
    "topics": [
      "school_library"
    ],
    "targetWeeks": "第 13-16 周",
    "unlockRequirement": 70
  },
  {
    "id": 5,
    "name": "城市出行",
    "emoji": "🚗",
    "description": "在城市中问路、乘车、旅行和描述地点。",
    "topics": [
      "city_travel"
    ],
    "targetWeeks": "第 17-20 周",
    "unlockRequirement": 70
  },
  {
    "id": 6,
    "name": "自然与动物",
    "emoji": "⛅",
    "description": "分主题认识动物、天气、季节和自然环境。",
    "topics": [
      "animals",
      "nature_weather"
    ],
    "targetWeeks": "第 21-24 周",
    "unlockRequirement": 70
  },
  {
    "id": 7,
    "name": "运动爱好",
    "emoji": "🏃",
    "description": "聊运动、比赛、周末活动和个人爱好。",
    "topics": [
      "sports_hobbies"
    ],
    "targetWeeks": "第 25-28 周",
    "unlockRequirement": 70
  },
  {
    "id": 8,
    "name": "感受与穿衣",
    "emoji": "😊",
    "description": "表达心情、观点、外貌和事物特征。",
    "topics": [
      "clothes",
      "feelings_descriptions"
    ],
    "targetWeeks": "第 29-32 周",
    "unlockRequirement": 70
  },
  {
    "id": 9,
    "name": "购物付款",
    "emoji": "🛒",
    "description": "买东西、询价付款，并认识职业和工作场景。",
    "topics": [
      "shopping_work"
    ],
    "targetWeeks": "第 33-36 周",
    "unlockRequirement": 70
  },
  {
    "id": 10,
    "name": "科技媒体",
    "emoji": "📱",
    "description": "使用手机、电脑、网络、媒体和娱乐内容。",
    "topics": [
      "tech_media"
    ],
    "targetWeeks": "第 37-40 周",
    "unlockRequirement": 70
  },
  {
    "id": 11,
    "name": "考试表达",
    "emoji": "🎯",
    "description": "复习考试说明、连接词、短语动词和高频表达。",
    "topics": [
      "exam_expressions"
    ],
    "targetWeeks": "第 41-44 周",
    "unlockRequirement": 70
  },
  {
    "id": 12,
    "name": "综合复习",
    "emoji": "🎓",
    "description": "整理未归类词和高频综合表达，完成最后冲刺。",
    "topics": [
      "full_review"
    ],
    "targetWeeks": "第 45-48 周",
    "unlockRequirement": 70
  }
];
