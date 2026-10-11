# 图片生成记录

使用内置 imagegen，每个词单独调用，逐张视觉检查后用 Sharp 转为 640 × 640 WebP。没有抓取网络图片，没有用同一照片替代多个词。源图保留在 Codex 的 generated_images 目录；平台最终资产保存在 `public/word-images/{wordId}.webp`。

## 学校主题补图（2026-10-11）

下列每条为对应独立调用的提示词主体与限制；图片哈希、指定词义和实际视觉依据在 `src/data/additional-images.js`。

| wordId / 最终图片 | 主提示词 | 限制与复核重点 |
| --- | --- | --- |
| l12_pen / public/word-images/l12_pen.webp | ONE clearly recognizable fountain pen for the English word pen, Chinese 钢笔. An unbranded dark green fountain pen with its cap removed and placed alongside, the shiny metal nib clearly visible. Bright light grey studio surface, full pen and cap, crisp three-quarter view. | 不使用铅笔、记号笔或手；检查金属钢笔尖和独立笔帽。 |
| l12_bag / public/word-images/l12_bag.webp | ONE recognizable school bag illustrating English bag, Chinese 包. A small green fabric school backpack standing upright, with two shoulder straps, a carry handle, zipper and front pocket. Bright pale grey studio surface, full object. | 不放置其他文具；检查完整背包、肩带、提手和拉链。 |
| l4_desk / public/word-images/l4_desk.webp | One recognizable writing desk for English desk, Chinese 书桌. One small light wood writing desk with a flat rectangular desktop, four legs, and two small drawers on one side, one drawer slightly open. Bright pale grey room. | 不用餐桌、椅子或电脑代替；检查写字台与内置抽屉。 |
| l4_teacher / public/word-images/l4_teacher.webp | A clearly recognizable school teacher for English teacher, Chinese 老师. One friendly adult woman teacher standing at the front of a primary classroom, holding an open picture book and showing its pictures to two seated children at small school desks. Classroom board with simple shapes only. | 不能只是成人头像；检查老师正在授课、学生课桌和教室黑板。 |
| l5_school / public/word-images/l5_school.webp | An unmistakable primary school illustrating English school, Chinese 学校. A low-rise primary school building, main entrance, classroom windows, fenced playground, children arriving with backpacks and an adult. Classroom board and desks visible through a ground-floor window. | 不用普通住宅代替；检查学校建筑、教室、课桌、操场和学生。 |
| l10_friend / public/word-images/l10_friend.webp | Friendship illustrating English friend, Chinese 朋友. Two six-year-old friends with different appearances walking side by side on a safe footpath, smiling and chatting, carrying backpacks. One child offers a friendly greeting and the other smiles back. | 不能只是两个孤立头像；检查友好互动、共同出行和相互关注。 |

共同限制：真实感摄影、方形构图、清楚主体、自然光，无标语、品牌标记、水印、拼图或泛用图标。

## 家庭与房间主题（2026-10-11）

使用内置 imagegen，每个词独立调用。十六张源图均实际查看后通过代理视觉复核，转换为 640 × 640 WebP；未使用共享场景裁剪来充当不同词的图片。提示词主体、场景句子、视觉依据与哈希分别保存在 `src/data/family-images.js` 和 `src/data/home-images.js`，按逐词 ID 记录。

| 单词 | 最终图片 | 提示词主体 / 实际核验的场景 |
| --- | --- | --- |
| mother | public/word-images/l10_mother.webp | 母亲在家给孩子梳头，上学前照料；句子明确母亲角色。 |
| father | public/word-images/l10_father.webp | 父亲在家门口蹲下帮孩子系鞋带；句子明确父亲角色。 |
| sister | public/word-images/l1_sister.webp | 年长女孩和年幼男孩一起画画；对应“姐姐”，不用成人肖像。 |
| brother | public/word-images/l10_brother.webp | 年长男孩帮年幼女孩搭积木塔；对应“哥哥”，不与爸爸图混用。 |
| family | public/word-images/l10_family.webp | 一家人在家一起吃饭交谈，所有人物清楚，不只拍食物。 |
| grandmother | public/word-images/l10_grandmother.webp | 年长女性在家给孩子读绘本；句子明确奶奶角色，而不是授课老师。 |
| grandfather | public/word-images/l10_grandfather.webp | 年长男性与孩子在家中花园种花；句子明确爷爷角色。 |
| baby | public/word-images/l2_baby.webp | 清醒婴儿在游戏垫上微笑，身体与婴儿特征可见。 |
| house | public/word-images/l3_house.webp | 完整两层房屋外观，有屋顶、入口、窗户和花园，不是玩具或单个房间。 |
| room | public/word-images/l3_room.webp | 房间全景，有墙角、天花板、地板、窗户、床与书架，空间而非单个物件为主体。 |
| door | public/word-images/l3_door.webp | 打开的蓝色实心室内门，门板、把手、合页与门框清楚。 |
| window | public/word-images/l5_window.webp | 白色窗框、透明玻璃、窗台与打开的窗扇，透过玻璃能看到花园。 |
| chair | public/word-images/l3_chair.webp | 单把木椅，靠背、绿色坐垫与四条腿完整可见，没有桌子。 |
| table | public/word-images/l3_table.webp | 单张圆形木桌，平桌面与四条腿可见，没有抽屉、文具或椅子。 |
| bed | public/word-images/l3_bed.webp | 单人床，床头、床尾、床垫、枕头与绿色毯子完整可见。 |
| lamp | public/word-images/l10_lamp.webp | 点亮的红灯罩台灯，白色支柱、底座和电线清楚，不用吊灯代替。 |

共同限制：方形真实感照片、明亮自然或柔和光照、清楚完整主体、无文字、水印、品牌、图标或拼图。家庭关系由明确教学语境建立，不能从照片外貌推断人物的真实亲属关系。不同家庭结构均成立，该照片只是一个例子。

## 公园与健康主题（2026-10-11）

每词独立调用内置 imagegen，十六张最终源图均实际查看后转换为 640 × 640 WebP；提示词主体、照片对应词义、例句与复核哈希保存在 `src/data/park-images.js` 和 `src/data/health-images.js`。下表为提示词主体和实际复核重点，不是完整调用提示词逐字转录。

| 单词 | 最终图片 | 提示词主体 / 实际核验的场景 |
| --- | --- | --- |
| park | public/word-images/l7_park.webp | 公共公园全景，步行小路、草地、长椅、远处秋千滑梯；解释公园，不解释停车。 |
| tree | public/word-images/l7_tree.webp | 一棵前景树，从地面树干到枝条和完整绿冠可见，不用公园全景代替。 |
| flower | public/word-images/l7_flower.webp | 单朵红花，花心、花瓣、绿色茎与叶清楚，不用花束或树木代替。 |
| ball | public/word-images/l7_ball.webp | 草地上的蓝黄橡胶球，球体完整，纹理与接地阴影可见，不是平面圆。 |
| play | public/word-images/l7_play.webp | 两个孩子玩桌游，一个正在移动棋子；照片只解释玩游戏，不解释乐器或戏剧。 |
| run | public/word-images/l2_run.webp | 红衣孩子长步幅跑过草地，手臂弯曲摆动，双脚短暂腾空，侧面全身。 |
| jump | public/word-images/l12_jump.webp | 孩子双脚并拢向上跳，脚下有离地间隙与阴影，区别于横向奔跑。 |
| walk | public/word-images/l2_walk.webp | 绿衣孩子直立、放松手臂、较短落地步幅走在小路上，区别于跑与跳。 |
| ambulance | public/word-images/l2_ambulance.webp | 白色高顶救护车，警示灯、医疗标志、打开侧门内担架；第一次取景裁掉车尾，重新扩大取景后车顶、保险杠、车轮均在画面内，状态 fixed。 |
| doctor | public/word-images/l2_doctor.webp | 医生在明亮诊室用听诊器听穿着衣服的孩子胸部，例句明确角色，不是普通成人头像。 |
| nurse | public/word-images/l9_nurse.webp | 护士调整孩子上臂血压袖带，导管与显示器可见；句子明确角色，制服不是职业证明。 |
| hospital | public/word-images/l5_hospital.webp | 医院入口、无障碍坡道、医护推担架、玻璃内病床，救护车是次要背景，不仅靠建筑十字标志。 |
| medicine | public/word-images/l2_medicine.webp | 封闭药瓶和完整白色药片泡罩，在诊室托盘上，没有散落药片或孩子服药场景。 |
| pharmacy | public/word-images/l12_pharmacy.webp | 药房柜台、药盒药瓶货架、成人取药；区别于杂货店和病房，没有用药剂量提示。 |
| dentist | public/word-images/l5_dentist.webp | 牙医用口镜检查孩子牙齿，牙科躺椅、诊灯和器械托盘明确，无拔牙、钻牙或出血。 |
| tooth | public/word-images/l2_tooth.webp | 一颗门牙的实体教学模型，有牙冠和单根，透明支架承托；中英文均明确是模型示例，不宣称为真实拔出的牙齿。 |

共同限制：真实感方形照片、清楚主体、明亮光线、没有图标、拼图、水印和品牌。生成图的角色由场景句子建立，不用外貌证明职业身份；健康照片只教学词义，不提供诊断或用药指示。救护车初图不入发布包，只发布实际复核后的修正版。

## 后续完整队列

`src/data/word-image-plans.js` 为全部 1687 个词建立唯一文件路径、指定 KET 词义、词性、教学场景和逐词提示词。该队列只用于制作，不把提示词视作图片已存在的证明，不自动写入通过状态。抽象词必须继续检查生成场景是否真的能表达其含义。
