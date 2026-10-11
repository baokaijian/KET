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

## 衣物与天气主题（2026-10-11）

十六个词分别调用内置 imagegen，逐张实际视觉检查后转换为 640 × 640 WebP。完整生成提示词保存在 `src/data/clothes-images.js` 和 `src/data/weather-images.js` 的 `generationPrompt`；修正版另保留 `refinementPrompt`。下表是场景摘要，不是提示词逐字转录。

| 单词 | 最终图片 | 实际视觉复核与指定词义 |
| --- | --- | --- |
| shirt | public/word-images/l12_shirt.webp | 蓝色长袖纽扣衬衫，尖领、纽扣、袖口与下摆可见，不用夹克代替。 |
| coat | public/word-images/l12_coat.webp | 绿色长款大衣，翻领与纽扣，衣身明显长于袖子；主词义为外套，大衣只是示例。 |
| hat | public/word-images/l12_hat.webp | 蓝色毛球针织帽，翻折帽沿与开口可见，不用棒球帽图混用。 |
| shoe | public/word-images/l12_shoe.webp | 单只红色帆布运动鞋，鞋带、鞋底、鞋头与鞋跟完整可见。 |
| sock | public/word-images/l8_sock.webp | 单只黄色软袜，袜口、脚跟与脚尖可辨，沒有硬鞋底。 |
| dress | public/word-images/l8_dress.webp | 红色短袖连衣裙，上身与裙摆是一体；只解释名词，不解释穿衣动作。 |
| skirt | public/word-images/l12_skirt.webp | 绿色半身短裙，腰带与裙摆清楚，没有连衣裙上身。 |
| jacket | public/word-images/l12_jacket.webp | 蓝色短款拉链夹克，拉链、立领、袖口与下摆可见，区别于长款大衣。 |
| sun | public/word-images/l6_sun.webp | 海面上方的完整太阳圆盘与反射，区别于月亮或图标。 |
| rain | public/word-images/l6_rain.webp | 下落雨滴、湿润小路、水洼涟漪和溅水，照片指定雨的名词含义。 |
| snow | public/word-images/l6_snow.webp | 栅栏、树枝与地面覆盖积雪，空中有落雪；照片指定雪的名词含义。 |
| wind | public/word-images/l5_wind.webp | 红旗舒展飘动与草向同一方向倾斜；初图近景灌木方向矛盾，移除后重新检查，状态 fixed。 |
| cloud | public/word-images/l5_cloud.webp | 蓝天中的大朵白色积云，云底灰色阴影，照片主体为云。 |
| hot | public/word-images/l6_hot.webp | 孩子在遮阳处扇风、擦汗，旁有饮水，表达炎热天气，不解释烫物或疾病。 |
| cold | public/word-images/l2_cold.webp | 雪景中孩子穿厚外套、帽子、围巾、手套，表达天气冷，不解释名词感冒。 |
| weather | public/word-images/l5_weather.webp | 孩子在室内隔着关闭窗户观察晴天与云；初图太阳在视线附近，移除太阳圆盘后复核，状态 fixed。 |

共同限制：每词唯一生成照片，不使用拼图、文字标签、品牌、水印或泛用图标；单物体衣物可完整观察。天气照片表达具体天气条件，weather 的晴天场景不宣称包含所有天气类型；角色场景不提供医疗判断。只发布最终修正版，未将失败的初图登记为通过。

## 身体主题（2026-10-11）

八个词分别调用内置 imagegen，逐张实际视觉检查后转换为 640 × 640 WebP。完整提示词、指定词义、中英文语境、复核说明和 SHA-256 均保存在 `src/data/body-images.js`；没有共用图片或用图标替代。

| 单词 | 最终图片 | 实际视觉复核与指定词义 |
| --- | --- | --- |
| hand | public/word-images/l2_hand.webp | 一只张开的手掌，五根手指、掌心和手腕清楚。 |
| head | public/word-images/l2_head.webp | 孩子完整头部侧面，从头顶头发到下巴均在取景内，不只显示脸。 |
| eye | public/word-images/l2_eye.webp | 一只睁开的棕色眼睛，虹膜、瞳孔和眼睑可辨。 |
| ear | public/word-images/l2_ear.webp | 一只完整外耳，耳廓与耳垂明确。 |
| mouth | public/word-images/l12_mouth.webp | 张开的微笑嘴巴，嘴唇和牙齿清楚；不用整个人像代替。 |
| nose | public/word-images/l2_nose.webp | 鼻梁、鼻尖和两个鼻孔作为主要主体。 |
| arm | public/word-images/l2_arm.webp | 从衣袖伸出的整条手臂，上臂、肘、前臂、手腕清楚，不只显示手。 |
| leg | public/word-images/l2_leg.webp | 短裤下方的一条腿，大腿、膝、小腿、踝与鞋明确。 |

共同限制：明亮真实感照片，没有文字标签、品牌、水印、拼图或医疗诊断提示。例句明确单数的身体部位；句子课、起步故事与进阶故事补入 mouth 等词汇的真实语境。原始生成文件保存在本机 Codex 生成目录，本项目仅发布逐张检查后的 WebP。

## 购物主题（2026-10-11）

七个尚缺图片的词分别调用内置 imagegen，新图逐张检查后转换为 640 × 640 WebP。完整生成提示词、pay 的修正提示词、中英文语境、视觉依据和最终哈希保存在 `src/data/shopping-images.js`。bag 仍使用原有已检查照片，不重新生成或把同一个词计为新增资产。

| 单词 | 最终图片 | 实际视觉复核与指定词义 |
| --- | --- | --- |
| shop | public/word-images/l5_shop.webp | 杂货店的完整入口、食品货架、蔬果陈列、购物者与收银台；明确商店的名词义。 |
| buy | public/word-images/l9_buy.webp | 顾客接过装有两个苹果的纸袋，同时将硬币交给摊主；不是赠送、选购或单独的付款机画面。 |
| money | public/word-images/l12_money.webp | 打开的零钱包和有金属边缘、压印表面的硬币；只用硬币举例解释钱，不教授具体币种或面额。 |
| price | public/word-images/l9_price.webp | 购物袋挂有清楚的 £3 价签，例句是 three pounds，与图中数字和货币一致。 |
| fruit | public/word-images/l2_fruit.webp | 可分别辨认的苹果、香蕉、橙子及半个橙子；通过明确例子表达水果类别，不复用 apple 图。 |
| vegetable | public/word-images/l2_vegetable.webp | 胡萝卜、西兰花和菠菜，均为儿童熟悉的食用蔬菜，没有混入水果。 |
| pay | public/word-images/l9_pay.webp | 顾客用卡接触收银终端的感应区，旁有商品袋；初图数字重复，修正版逐键确认 1–9 和 0 后登记 fixed，只发布修正版。 |
| bag | public/word-images/l12_bag.webp | 原有绿色背包图，提手、肩带、拉链明确；例句“This backpack is a kind of bag.”说明背包是包的一种，学校和购物课共用同一 word ID 的语义，不让不同词共用照片。 |

共同限制：不同词使用不同照片与哈希；buy/pay/money/price 分别展示购买交换、刷卡付款、硬币和物品价签。除价格与付款机的真实物体信息外，不使用文字标签、图标、拼图、水印或品牌；人物身份靠教学句子而非外貌推断。

## 出行主题（2026-10-11）

六个缺图词分别使用内置 imagegen 生成，逐张实际查看后缩放为 640 × 640 WebP。完整提示词、对应词义、双语语境、视觉依据与哈希保存于 `src/data/travel-images.js`。公交车与自行车沿用原有两个词各自的图片，实际再次查看，例句字段新增到已有词条，并不计为新增资产。

| 单词 | 最终资产 | 实际视觉复核 |
| --- | --- | --- |
| car | public/word-images/l5_car.webp | 完整蓝色家用小汽车，车门、挡风玻璃、车轮、车灯可见，不是公交车或救护车。 |
| train | public/word-images/l5_train.webp | 完整驾驶室与连接的客运车厢位于钢轨上；只表达火车名词义，不表达训练动词。 |
| road | public/word-images/l5_road.webp | 铺装路面、白色中心线、路缘与两侧人行道；没有孩子站在车道上，不是公园步道。 |
| station | public/word-images/l5_station.webp | 候车棚、站房、站台、座椅、铁轨与远处列车；乘客在黄色安全线后，场所而非单一列车是主语义。 |
| ticket | public/word-images/l10_ticket.webp | 完整纸票，TRAIN TICKET / ONE WAY 两行准确可读，有铁路背景；虚构教学车票，不教授真实票价、线路或证件信息。 |
| stop | public/word-images/l12_stop.webp | 成人与孩子双脚静止在人行道、路缘后，成人抬手示意停下，行人红灯亮、绿灯灭；不是在车道中行走或公交站名词。 |
| bus / bicycle | public/word-images/l5_bus.webp / public/word-images/l7_bicycle.webp | 再次查看原红色公交车与两轮绿色自行车，图片字节及原哈希不变；新图片例句描述红色和两个车轮，而不是照片无法证明的目的地。 |

共同限制：一个词一张专属照片，不同词不共用照片。人物身体完整，停车与候车情境明确安全；无图标、拼图或水印。火车票允许真实物体上的用途文字，行人信号允许照片内实体信号，不把写出的单词或符号独自当成图片语义证据。

## 一天主题（2026-10-11）

八词分别调用内置 imagegen；晚餐初图的钟太小，另调用一次局部修改，将钟移至前景放大并移除后方小钟。所有最终照片均实际查看，再用 Sharp 转为 640 × 640 WebP，未使用网络图片或共享图裁剪。完整生成提示词、晚餐修正提示词、双语短句、alt、视觉依据与最终哈希在 `src/data/day-images.js`。

| 单词 | 最终资产 | 实际视觉复核 |
| --- | --- | --- |
| morning | public/word-images/l1_morning.webp | 孩子在日光下拉开卧室窗帘；前景钟清楚显示 7:00 AM。 |
| afternoon | public/word-images/l1_afternoon.webp | 孩子在日光下书桌前画画；钟显示 3:00 PM，区别于早晨拉窗帘。 |
| evening | public/word-images/l1_evening.webp | 成人与孩子在沙发上看绘本，窗外暮色、室内灯光，钟为 7:00 PM。 |
| night | public/word-images/l1_night.webp | 安静房间有灯光，窗外深色天空、月亮与星星，钟为 10:00 PM；没有孩子熬夜。 |
| breakfast | public/word-images/l2_breakfast.webp | 孩子在家吃麦片粥、吐司，旁有牛奶；8:00 AM 明确为早餐示例。 |
| lunch | public/word-images/l2_lunch.webp | 学校用餐场景、打开的饭盒、米饭和蔬菜，钟为 12:00 PM。 |
| dinner | public/word-images/l2_dinner.webp | 家人在暮色中共进正餐；修正后前景钟为 6:00 PM 且无重复钟，仅发布 fixed 修正版。 |
| sleep | public/word-images/l12_sleep.webp | 孩子穿睡衣躺在床上，双眼闭合、头枕枕头、手放松，明确睡觉动作。 |

钟面数字与 AM/PM 已逐张核对；钟是照片中的实体，不是写着单词的覆盖标签。活动或食物不独自代表时间定义，照片时刻只是例子，完整释义与指定照片含义分开展示。原始 PNG 保留在本机 Codex 的 generated_images 目录，失败的晚餐初图不进入发布包。

## 原反馈六词（2026-10-12）

all/also/always/a.m./and/answer 分别使用内置 imagegen 生成真实感照片，实际查看全部原图及转换后的 640 × 640 WebP，再接入平台。六个原文件均为未发布的旧图标模板，确认字节与已提交基线一致后才替换；此次没有使用网络图片、拼图、共享裁剪或自动批量签核。完整实际提示词、双语语境、词典依据、视觉说明与最终哈希保存在 `src/data/starter-images.js`。

| 单词 | 最终资产 | 实际视觉复核 |
| --- | --- | --- |
| all | public/word-images/l1_all.webp | 四个孩子完整站在一起，四个均戴帽；句子明确是这四个人全部戴帽。 |
| also | public/word-images/l1_also.webp | 孩子已有苹果，成人与孩子正交接另一个香蕉；两句语境说明增加。 |
| always | public/word-images/l1_always.webp | 孩子把鞋放在门旁，墙上 Mon-Sun 七列各有一个绿勾；只是习惯教学示例，不证明终身行为。 |
| a.m. | public/word-images/l1_a_m.webp | 前景实体钟完整显示 9:00 AM，孩子在阅读；该时刻是午夜到中午区间中的例子。 |
| and | public/word-images/l1_and.webp | 一整本蓝书与一只红杯并列，例句连接两个名词；任何一个物品不单独代表 and。 |
| answer | public/word-images/l1_answer.webp | 白板问题 2 + 1 = ? 与孩子卡片答案 3 清楚可见；照片指定“答案”的名词义。 |

所有六词需配语境理解，均为实际替换后登记 `fixed`。桌面/手机截图分别保存完整图片视口与例句视口并实际查看；文件和文本断言不是独立教师语义签字或真实设备声音验收。

## 后续完整队列

`src/data/word-image-plans.js` 为全部 1687 个词建立唯一文件路径、指定 KET 词义、词性、教学场景和逐词提示词。该队列只用于制作，不把提示词视作图片已存在的证明，不自动写入通过状态。抽象词必须继续检查生成场景是否真的能表达其含义。
