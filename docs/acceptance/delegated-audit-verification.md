# 独立代理审计与主任务复核

## 分工与权限

- Antigravity：全词库英文、中文释义、词性与分类的独立审查；仅可交付自己的内容审计报告。
- DeepSeek Harness：六岁儿童学习流程、听读复习、持久化与故障路径审查；交付 `deepseek-learning-audit.md`。任务已在本机执行并确认完成，报告 15 项发现，不是平台验收结论。
- 主任务：核对证据，复现问题，实施修改，扩展回归，提交代码。代理不得改源码、图片、测试、已有文档、通过状态或执行提交、推送。

## 本批次已核实并整改

| 来源 | 问题 | 主任务证据与修复 | 状态 |
| --- | --- | --- | --- |
| 官方 PDF / 内容审查线索 | 附录遗漏衣物、个人感受、最后一页天气与工作 | 本机逐页抽取核实；导入实际覆盖所有附录页和 25 个主题标题，1687 应用词全部匹配源记录；新增纯解析回归 | 已修复 |
| 官方 PDF / 内容审查线索 | design、train 漏词性；IT、May、Miss 大小写碰撞 | 合并括号词义限定，保留可选短语成分；区分 IT/it、May/may、Miss/miss。design/train 为 n/v，it 为 pron，May/Miss 为 n，as well 不混入 as well (as) 的 prep；均核对原 PDF | 已修复 |
| 主任务 | unhappy、unfortunately、diving、for sale、Guess what? 的源词性不适合所教含义 | 按词典证据新增独立纠错清单，原始 PDF 值保留；右侧形容词 right hand 的中文改为“右边的；右侧的” | 已修复 |
| 主任务 | 全主题重新分组可能继承不同内容的旧通过记录 | 冻结 b0663dc 的全部 219 个分组；当前 217 个分组中 113 个原样保留，104 个改用内容 ID，1687 词 ID 和历史记录不变 | 已修复 |
| DeepSeek F1 | 家长输入题进入儿童每日复习 | 同时过滤新计划、已保存计划和复习题转换；保留家长记忆记录，不删除历史。单测及浏览器注入旧计划复现 | 已修复 |
| DeepSeek F2 | 无语音 API 或无回调导致无法继续 | 播放启动及结束超时检测；安全跳过不调用记分，不计对错或独立掌握。测试缺 API、无回调、超时取消与旧回调 | 已修复 |
| DeepSeek F3 | 阅读语音提示在刷新后丢失 | heard 纳入当前题目会话快照；真实退出/刷新/重进后的答对仍不增加独立阅读成功日 | 已修复 |
| DeepSeek F4 | 错题列表提前展示词义答案 | 列表只显示英文与练习类型，释义留到题目反馈；浏览器验证答题前列表不含答案 | 已修复 |

词典证据：[unhappy](https://dictionary.cambridge.org/dictionary/english/unhappy)、[unfortunately](https://dictionary.cambridge.org/dictionary/english/unfortunately)、[diving](https://dictionary.cambridge.org/dictionary/english/diving)、[for sale](https://dictionary.cambridge.org/dictionary/english/for-sale)、[Guess what?](https://dictionary.cambridge.org/dictionary/english/guess-what)、[right-hand](https://dictionary.cambridge.org/us/dictionary/english/right-hand)。中文解释为项目自行编写，不批量复制词典原文。

## 尚未验收

- DeepSeek F5：每日复习积压与新内容速率不匹配，需要长期模拟校准。当前最多 20 项复习与积压降为 4 个新词的规则不变，未宣称已解决。
- DeepSeek F6–F15：故事答案位置、误触纠错策略、午夜边界、题目复用、bag 跨主题复用、sock/mouth 的句子覆盖、旧代码、触控尺寸、计划存储与自主引导。报告是线索，尚未逐项完成主任务复现、整改与验收。
- Antigravity 报告草稿已收到，尚在汇总。本次修复不等于全词库语义审阅完成；报告所称 354 错误、88 待确认、1245 正常不是主任务验收统计。报告摘要写 9 个儿童主题、13 单元 / 168 节课，与审计基线实际 12 个儿童主题、12 单元 / 219 词汇课不符。多义词适用多个主题、有效扩展含义与个人教学偏好不能自动判为错误；剩余建议必须逐条重新核对，不能直接批量删改或签 pass。
- 图片仍为 74 / 1687，1613 pending；真实设备听辨、真实儿童与独立教师审阅尚未完成。

所有部分整改都保留总验收失败，不能将 pending 改成 pass 规避门禁。

## 最终修改后的实际回归（2026-10-11）

- 代码检查与生产构建通过，保留全词库分包大小提示。
- 57 / 57 数据与逻辑测试通过；Python 导入回归不依赖 PDF 库，实际 PDF 提取另用本机 pdfplumber 核对。
- 桌面与 Chromium 手机视口共 80 / 80 浏览器流程通过；GitHub Pages `/KET/` 生产路径同样 80 / 80。
- 已发布 74 张照片的文件、解码和哈希检查通过；未新增图片，也未修改任何图片复核状态。
- `test:acceptance` 实际退出 1：功能阶段全部通过后，全词库图片门禁仍为 74 / 1687。审计清单中的剩余问题和真实设备听辨不因此成为通过状态。
- 初次新增用例因测试注入了无效的空 lastDay 被进度清洗移除而失败，修正测试数据后完成最终全量回归；没有绕过清洗规则或放宽断言。
