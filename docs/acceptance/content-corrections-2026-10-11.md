# 词性与释义证据复核（购物、出行与一天照片批次）

这是主任务对 Antigravity 报告线索的独立复核，不是 1687 词教师签字验收。英文与原始词性记录仍保留在官方元数据中，教学标签覆盖单独写入 `vocabulary-corrections.js`；中文解释为项目原创简述，不复制词典例句。

## 已处理

| 单词 | 教学处理 | 核实依据 |
| --- | --- | --- |
| all the time | 从继承的 det 改为 phrase，保留“一直；总是” | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/all-the-time) 独立条目标注 phrase；原始元数据 det 不删除 |
| poor thing / you | 整条表达标为 phrase，而不是只标 poor 的 adj | [Cambridge Grammar: Thing and stuff](https://dictionary.cambridge.org/us/grammar/british-grammar/stuff) 展示 poor thing 用来表达态度的完整说法；教学标签明确针对整个表达 |
| tidy up | 由 v 细化为 phr v，保持“收拾；整理干净” | [Cambridge Dictionary 官方博客](https://dictionaryblog.cambridge.org/2016/06/08/phrasal-verbs-for-everyday-actions/) 将 tidy up 作为日常短语动词；原 v 并非无效，只是不够细化。tidy-up 的带连字符名词不是本词条 |
| far | 副词释义改为“远（表示距离，如 far away 在远处）”，不只写“远的” | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/far) 的距离副词义为 A2；未将较高阶形容词义混进本教学标签 |
| opposite | prep 标签下写“在……对面”，不写形容词形式“对面的” | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/opposite) 的 A2 介词义；[官方语法说明](https://dictionary.cambridge.org/us/grammar/british-grammar/opposite-or-in-front-of) 区分位置关系 |
| red / yellow / green / pink / purple / white | 官方元数据为 adj，中文分别明确为“红色的”等修饰形式 | [Cambridge Learner's Dictionary: red](https://dictionary.cambridge.org/us/dictionary/learner-english/red) 展示形容词颜色用法；这些词的官方词性字段均为 adj。没有声称颜色词不能作名词，而是对齐此处所教词性 |
| spring | 去掉“另一名词含义”编辑备注，保留“春天；春季；弹簧” | 原有两个名词义不变，仅去除面向编写者的备注 |
| wood | 增补“树林”，保留木头、木材 | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/wood) 的材料义与树林义均列为 A2 名词 |
| temperature | 明确“温度；气温；体温”，健康语境不只给模糊的温度 | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/temperature) 的 A2 定义包括地点与身体温度；这是词义解释，不提供医疗阈值或建议 |
| shop | 补齐“商店（名词）；购物（动词）”，照片仍专门解释商店 | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/shop) 分列商店名词与购物动词；不把商店入口图当成两个词义都已表达 |
| walk | 补齐“走路；步行（动词）；散步（名词）”，照片仍专门解释走路 | [Cambridge Learner's Dictionary](https://dictionary.cambridge.org/dictionary/learner-english/walk) 分列 A1 步行动词与 A2 散步名词；不改变原有 n/v 标签或照片指定词义 |

## 无需错误整改的线索

- chat 的“聊天”可以是名词，如一次聊天；当前官方 n 标签和中文不是已证实误译，本批不机械增加所有词典词性。
- golden 已是“金色的；金黄色的”，运行时 adj 与释义一致，旧底层字段不能代替页面实际数据。
- board、subject 现有解释已含学校核心含义，不因代理建议而删除正确含义或假称此前全错。
- cookie、port、chemist、term 的额外同词性含义不能仅因超出某个主题就判为误译；教学主场景与词典完整释义范围需要分开审阅。
- 报告中 85 项扩展词义与词性标签的范围差异仍待逐项核实，本批没有将它们签为通过。

## 验证范围

新增数据回归检查六个颜色词、far/opposite 的词性与释义、wood/temperature 的核心义和 spring 备注移除；shop/walk 加入名词、动词解释完整性回归。已有全词库回归继续验证每个标签来自源记录或带证据的教学覆盖。浏览器语音 mock 与数据测试不能替代教师语义复核或真机听辨。

## 出行批次补充

| 单词 | 本批处理 | 独立核实依据与边界 |
| --- | --- | --- |
| train | 明确“火车；列车（名词）；训练（动词）”，照片只解释列车 | [Cambridge Learner's Dictionary](https://dictionary.cambridge.org/dictionary/learner-english/train) 分列交通工具与训练用法；不同词典给出的动词难度等级不一致，不据此删除官方词表已有 n/v 元数据，也不宣称两义均为该词典 A2 |
| stop | “车站”细化为“停靠站”，短暂停留明确为名词；停止、停下明确为动词 | [Cambridge Learner's Dictionary](https://dictionary.cambridge.org/dictionary/learner-english/stop) 区分活动结束、短时停下、上下客地点与途中停留；照片为过路前停下，不把公交站或 stop 标语当成动词图片 |
| station | 用火车站、长途汽车站举例说明“车站” | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/station) 的交通义说明建筑与周围上下客区域；照片中的站台、候车棚、座椅与轨道明确该例，不声称 station 只有交通义 |
| ticket | “票；车票；入场券”，不局限于车票 | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/ticket) 的核心名词义包括出行与活动的付费凭证；照片为虚构教学火车票，不是可使用的证件，也不是所有票的样式 |
| road | “道路；马路”，覆盖供车辆行驶的路面 | [Cambridge Learner's Dictionary](https://dictionary.cambridge.org/dictionary/learner-english/road) 的道路名词义；照片有铺装路面、中心线及独立人行道，不用公园小径代替 |

bus 与 bicycle 的照片文件未改变，主任务再次查看后，把图片例句改为可见的红色公交车、两个车轮；原“上学”“去公园”仍在儿童句子课语境中，不让静物图承担看不到的目的地信息。train/stop 新增名词、动词完整性回归；出行八词检查图片、双语短句和朗读文本。

## 一天批次补充

| 单词 | 本批处理 | 独立核实依据与边界 |
| --- | --- | --- |
| morning | 从“早上”补全为“早晨；上午” | [Cambridge Learner's Dictionary](https://dictionary.cambridge.org/us/dictionary/learner-english/morning) 指起床或日出后直到中午的时段；图中 7:00 AM 是一个例子，不定义所有人的起床时间 |
| evening | “傍晚；晚上（夜间较早的时候）”，与 night 区分 | [Cambridge Learner's Dictionary](https://dictionary.cambridge.org/us/dictionary/learner-english/evening) 定义为下午与夜间之间；7:00 PM、暮色与家庭阅读是具体场景，不宣称各地七点都日落 |
| dinner | “正餐（通常是晚餐，也可在中午吃）”，不只解释晚餐 | [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/dinner) 包括晚间或中午的主要一餐；照片指定为晚餐，6:00 PM 是示例而非固定课程要求 |

afternoon、night、breakfast、lunch、sleep 保留原有正确常用释义与官方词性。八张照片各用独立场景；时间由实际钟面、双语短句与照片词义共同明确。三餐不以某种食物来定义，sleep 显示闭眼躺在床上睡觉，不与夜景图混用。本批仍不是独立教师逐词语义签字或真实声音验收。
