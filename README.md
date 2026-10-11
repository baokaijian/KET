# Sparks · KET 英语探索

简洁、无需登录、适合孩子自主开始的英语学习网站。React / Vite 纯静态应用，可部署到 GitHub Pages。

## 新版体验

- 今天：5 分钟课程、每日目标、词汇照片和下一课。
- 学习天地：3 组入门课程，共 12 个逐项视觉复核的词；辨图、拼写、听力练习。
- KET 小测：听力、阅读、综合练习，25 词邮件写作与本地录音口语自评。
- 成长记录：练习结果、错题复习、掌握单词、完成课程和学习天数。
- 英式/美式朗读选择、慢速与例句朗读。系统 TTS 无法保证每台设备音色一致。
- 手机、平板与桌面布局；页面位置使用 hash，静态部署后刷新不依赖服务端路由。

## 内容边界

**目前不是 1687 词完整图片验收通过版本，也不是正式 KET 模拟考试。**

旧版 1687 词条保留供查词，但有 862 条占位释义以及未核实音标。占位释义显示“释义待复核”；未核实的图片、音标与模板例句不展示，不用于自动掌握度判定。新版已校对的 12 词按指定词义展示照片，不将 `book` 的名词照片用于“预订”动词义。

照片由内置 imagegen 分别生成，放在 `public/learning-images/`。`src/data/image-reviews.js` 保存 Codex 实际视觉复核说明与文件哈希；这是代理视觉复核，不是家长签字，也不是系统语音听辨验收。替换图片后哈希测试必须失败，直到重新检查并记录证据。

旧的 `public/word-images/` 模板图保留作历史文件，不再进入页面或发布包。构建时只把 favicon 和已发布照片复制到忽略版本控制的 `public/learning-assets/`，再发布到 `dist/`。旧模板生成器已停用，不会再次把生成完成自动标成通过。

## 本地运行

需要 Node.js 22.12 或更高版本。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址。录音需要麦克风权限，线上需要 HTTPS；录音不上传，只在当前页面播放。学习记录和写作草稿保存在当前浏览器，新版使用独立存储键，不覆盖旧版进度。

## 发布到 GitHub Pages

1. 把代码推送到当前仓库默认分支 `main` 或 `master`。
2. 在仓库 Settings → Pages → Build and deployment 中，Source 选择 **GitHub Actions**。
3. `Deploy Sparks to GitHub Pages` 工作流会先跑检查，再构建与发布。

当前仓库是 `baokaijian/KET`，项目站点路径自动设为 `/KET/`，预期地址为 `https://baokaijian.github.io/KET/`。这只是部署目标，配置就绪不代表已经上线。用户名站点仓库 `用户名.github.io` 自动使用根路径 `/`。如使用自定义域名，可在仓库 Actions variables 中设置 `VITE_BASE_PATH=/`，域名仍需自行在 Pages 设置中配置。

本地模拟项目路径：

```sh
VITE_BASE_PATH=/KET/ npm run build
PLAYWRIGHT_PRODUCTION=1 PLAYWRIGHT_BASE_PATH=/KET/ npm run test:e2e
```

也可运行 `npm run test:pages`，它使用独立发布目录 `dist-pages`，检查 `/KET/` 子路径下全部桌面与手机流程，且确认旧模板图没有进入发布包。

配置参考 [Vite 官方 GitHub Pages 指南](https://vite.dev/guide/static-deploy.html#github-pages)。

## 检查与验收

```sh
npm run test:acceptance
npm run review:images
```

发布课程的验收包含：代码检查、构建、数据和音频逻辑、图片解码及哈希、桌面/手机 12 词截图、学习与拼写错误、听力成功/失败、结果与原题错题复习、草稿保存、录音权限失败、模拟麦克风的原生录音与退出清理、英美口音和慢速参数。录音测试不使用真人麦克风录音。

`npm run test:full-content` 是独立的全词库图片门禁。当前应失败，真实结果为 **12 / 1687**，余下 1675 项 `pending`，不是把它们标为通过来绕过验收。逐词表在 `docs/acceptance/image-review-checklist.md`。

真实设备仍需家长听辨单词/例句发音与音效，并体验麦克风录制、回放和清理。浏览器自动测试使用语音 mock，只证明传入文本、语言、速率和错误处理正确，不能证明实际声音准确。

## KET 范围

正式 A2 Key 包含阅读与写作、听力和口语；本项目是自编入门练习，不能替代官方样题与教师评估。写作只做字数和要点自查，口语只做录音与自评，不给虚假的语法、发音或证书预测分数。

参考 [Cambridge 官方考试结构](https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/format/) 与 [Cambridge Dictionary 的 book 词义和音标](https://dictionary.cambridge.org/us/dictionary/english/book/)。
