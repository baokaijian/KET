import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  Volume2,
} from "lucide-react";
import {
  clearAllLearningData,
  emptyProgress,
  evaluateModeRecommendation,
  exportLearningData,
  importLearningData,
  localDay,
  dayAfter,
  updateProfile,
} from "../utils/learningProgress.js";
import { STAGE_SCRIPTS, THEME_COLEARN_GUIDES } from "../data/colearn-scripts.js";
import { syncLabels } from "../sync/account.js";

export default function ParentCenter({
  progress,
  update,
  curriculum,
  settings,
  setSettings,
  say,
  account,
  onOpenAccount,
  onClose,
  onSwitchMode,
  onLaunchStuckWords,
}) {
  const profile = progress.profile || {};
  const [pinVerified, setPinVerified] = useState(!profile.pin);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [newPin, setNewPin] = useState("");
  const [exportedJson, setExportedJson] = useState("");
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  if (!pinVerified && profile.pin) {
    return (
      <section className="parent-center-shell pin-gate" aria-label="家长密码验证">
        <div className="pin-gate-card">
          <Lock size={32} />
          <h2>进入家长中心</h2>
          <p>请输入 4 位家长 PIN 码（用于防止孩子误触设置）</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput === profile.pin) {
                setPinVerified(true);
                setPinError("");
              } else {
                setPinError("PIN 码不正确，请重试。");
              }
            }}
          >
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              aria-label="输入 4 位家长 PIN 码"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
            />
            {pinError && <p className="error-note" role="alert">{pinError}</p>}
            <div className="pin-gate-actions">
              <button type="button" className="secondary" onClick={onClose}>
                返回儿童端
              </button>
              <button type="submit" className="primary" disabled={pinInput.length !== 4}>
                验证进入
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  const today = localDay();
  const childThemes = curriculum?.childThemes || [];
  const wordRegistry = curriculum?.courseWordById || {};

  // ① 今日简报计算
  const todayModeSessions = (progress.modeSessions || []).filter((s) => s.day === today);
  const todayPracticeSessions = (progress.sessions || []).filter(
    (s) => s.date && s.date.startsWith(today),
  );
  const todayMinutes = Math.max(
    todayPracticeSessions.length * 4,
    Math.round(todayModeSessions.reduce((acc, s) => acc + (s.durationSec || 0), 0) / 60),
  );
  const todayTasksCount =
    todayPracticeSessions.length +
    todayModeSessions.reduce((acc, s) => acc + (s.tasksCompleted || 0), 0);
  const totalScored = todayPracticeSessions.reduce((acc, s) => acc + (s.total || 0), 0);
  const totalCorrect = todayPracticeSessions.reduce((acc, s) => acc + (s.score || 0), 0);
  const todayAccuracy = totalScored > 0 ? Math.round((totalCorrect / totalScored) * 100) : 100;

  // ② 本周 7 天数据
  const last7Days = Array.from({ length: 7 }, (_, idx) => dayAfter(new Date(), idx - 6));
  const weeklyData = last7Days.map((day) => {
    const dayAnswers = Number(progress.days?.[day] || 0);
    const dayMode = (progress.modeSessions || []).filter((s) => s.day === day);
    const mins = Math.max(
      dayAnswers > 0 ? Math.min(20, Math.ceil(dayAnswers * 1.5)) : 0,
      Math.round(dayMode.reduce((acc, s) => acc + (s.durationSec || 0), 0) / 60),
    );
    const soloDone = dayMode.filter((s) => s.mode === "solo" && s.tasksCompleted > 0).length;
    const colearnZero = dayMode.filter((s) => s.mode === "colearn" && s.interventions === 0 && s.tasksCompleted > 0).length;
    const independent = soloDone > 0 || colearnZero > 0 || dayAnswers >= 4;
    return { day, label: day.slice(5), mins, dayAnswers, independent };
  });
  const activeDaysInWeek = weeklyData.filter((d) => d.mins > 0 || d.dayAnswers > 0).length;
  const independentDaysInWeek = weeklyData.filter((d) => d.independent).length;
  const weeklyIndependentRate = activeDaysInWeek > 0 ? Math.round((independentDaysInWeek / activeDaysInWeek) * 100) : 0;

  // ③ 12 主题掌握地图
  const themeMastery = childThemes.map((theme) => {
    const words = theme.vocabulary?.words || [];
    const seenCount = words.filter((w) => progress.seen.includes(w.id)).length;
    const masteredCount = words.filter((w) => progress.mastered.includes(w.id)).length;
    return {
      id: theme.id,
      title: theme.title,
      total: words.length,
      seenCount,
      masteredCount,
      words,
    };
  });
  const strongestTheme =
    [...themeMastery].sort((a, b) => b.masteredCount + b.seenCount - (a.masteredCount + a.seenCount))[0] ||
    themeMastery[0];
  const weakestTheme =
    [...themeMastery].sort((a, b) => a.masteredCount + a.seenCount - (b.masteredCount + b.seenCount))[0] ||
    themeMastery[0];

  // ④ 卡点清单
  const stuckWordIds = [
    ...new Set([
      ...(progress.review || []),
      ...Object.entries(progress.memory || {})
        .filter(([, skills]) =>
          Object.values(skills || {}).some((item) => item.assessed && !item.lastCorrect),
        )
        .map(([id]) => id),
    ]),
  ];
  const stuckWords = stuckWordIds
    .map((id) => wordRegistry[id])
    .filter((w) => w && w.image)
    .slice(0, 8);

  // ⑤ 自动撤除支持与模式切换建议 (M3 / M4)
  const modeRecommendation = evaluateModeRecommendation(progress);
  const currentThemeGuide =
    THEME_COLEARN_GUIDES[weakestTheme?.id || "breakfast"] || THEME_COLEARN_GUIDES.breakfast;

  function handleExport() {
    const data = exportLearningData(progress);
    const json = JSON.stringify(data, null, 2);
    setExportedJson(json);
    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sparks-learning-${today}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // Fallback to textarea display
    }
  }

  function handleImport() {
    try {
      const result = importLearningData(importText);
      update(() => result.progress);
      setImportStatus(
        `已成功导入并回放 ${result.replayedEvents} 条学习事件（已掌握 ${result.summary.masteredCount} 词）。`,
      );
    } catch {
      setImportStatus("导入失败：请确认 JSON 格式完整有效。");
    }
  }

  function handleDeleteAll() {
    if (deleteConfirmText !== "删除") return;
    clearAllLearningData();
    update(() => emptyProgress);
    setConfirmDeleteOpen(false);
    setDeleteConfirmText("");
  }

  return (
    <section className="parent-center-shell" aria-label="家长中心">
      <div className="parent-center-header">
        <div>
          <span className="eyebrow">PARENT CENTER · 3 分钟伴学看板</span>
          <h1>家长中心</h1>
        </div>
        <button type="button" className="primary" onClick={onClose}>
          <ArrowLeft size={18} /> 返回儿童端
        </button>
      </div>

      {/* 三段式核心总览（结论 + 证据 + 动作） */}
      <article className="parent-triad-banner" aria-label="本周伴学三段式结论">
        <div className="triad-item">
          <span className="triad-tag">结论</span>
          <p>
            本周已累计开口学习 <strong>{activeDaysInWeek}</strong> 天，已收集并掌握{" "}
            <strong>{progress.mastered.length}</strong> 个核心词（认识{" "}
            <strong>{progress.seen.length}</strong> 个词）。
          </p>
        </div>
        <div className="triad-item">
          <span className="triad-tag">证据</span>
          <p>
            进展最快的是「{strongestTheme?.title || "一起吃早餐"}」，而「
            {weakestTheme?.title || "窗外的天气"}」还需要多听多看（当前待巩固{" "}
            <strong>{stuckWords.length}</strong> 个词）。
          </p>
        </div>
        <div className="triad-item">
          <span className="triad-tag">动作</span>
          <p>
            今晚花 <strong>5 分钟</strong>，不用做题，只陪他听读「
            {weakestTheme?.title || "一起吃早餐"}」里的前 4 张图词卡。
          </p>
        </div>
      </article>

      {modeRecommendation && (
        <aside className="mode-recommendation-banner" role="status" aria-label="模式切换建议">
          <div>
            <strong>
              <Sparkles size={18} /> 陪学脚手架智能建议
            </strong>
            <p>{modeRecommendation.message}</p>
          </div>
          <button
            type="button"
            className="primary"
            onClick={() => {
              update((p) => updateProfile(p, { modePreference: modeRecommendation.suggestMode }));
              onSwitchMode?.(modeRecommendation.suggestMode);
            }}
          >
            切换到{modeRecommendation.suggestMode === "solo" ? "自学模式" : "陪学模式"}
          </button>
        </aside>
      )}

      <div className="parent-grid-2col">
        {/* ① 今日简报 */}
        <article className="parent-card" aria-label="今日简报">
          <div className="parent-card-head">
            <h2>
              <Clock size={19} /> ① 今日简报
            </h2>
            <span className="tiny">{today}</span>
          </div>
          <div className="parent-metrics-row">
            <div>
              <strong>{todayMinutes} 分钟</strong>
              <span>今日学习时长</span>
            </div>
            <div>
              <strong>{todayTasksCount} 个</strong>
              <span>完成任务</span>
            </div>
            <div>
              <strong>{progress.seen.length} 词</strong>
              <span>累计认识新词</span>
            </div>
            <div>
              <strong>{todayAccuracy}%</strong>
              <span>复习正确率</span>
            </div>
          </div>
          <p className="parent-one-liner">
            解读：
            {todayTasksCount > 0
              ? `今天已完成 ${todayTasksCount} 项任务，控制在 ${profile.dailyMinutes || 10} 分钟黄金注意力时长内。`
              : "今天还没开始，建议晚饭后花 8 分钟完成 1 个看图听词小任务。"}
          </p>
        </article>

        {/* ② 本周曲线 */}
        <article className="parent-card" aria-label="本周学习曲线">
          <div className="parent-card-head">
            <h2>
              <BarChart3 size={19} /> ② 本周曲线
            </h2>
            <span className="tiny">周独立完成率：{weeklyIndependentRate}%</span>
          </div>
          <div className="weekly-bars" role="list" aria-label="近7天学习时长柱状图">
            {weeklyData.map((d) => (
              <div key={d.day} className="weekly-bar-col" role="listitem">
                <div className="weekly-bar-track">
                  <span
                    className={`weekly-bar-fill ${d.independent ? "independent" : ""}`}
                    style={{ height: `${Math.min(100, Math.max(12, d.mins * 5))}%` }}
                  />
                </div>
                <small>{d.mins}m</small>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
          <p className="parent-one-liner">
            解读：
            {activeDaysInWeek >= 3
              ? `本周已坚持 ${activeDaysInWeek} 天，独立完成率 ${weeklyIndependentRate}%，保持每天 10 分钟最护兴趣。`
              : `本周中断较多，建议把每日时长上限保持在 ${profile.dailyMinutes || 10} 分钟，先恢复每天听 4 个词的习惯。`}
          </p>
        </article>
      </div>

      {/* ③ 掌握地图 */}
      <article className="parent-card" aria-label="12主题掌握地图">
        <div className="parent-card-head">
          <h2>
            <CheckCircle2 size={19} /> ③ 掌握地图（12 启蒙主题）
          </h2>
          <span className="tiny">
            已掌握 {progress.mastered.length} / 200（L1 阶段目标）
          </span>
        </div>
        <div className="parent-heatmap-grid">
          {themeMastery.map((item) => {
            const level =
              item.masteredCount >= 6
                ? "high"
                : item.seenCount >= 4 || item.masteredCount >= 2
                  ? "mid"
                  : "low";
            return (
              <div key={item.id} className={`heatmap-cell heat-${level}`}>
                <strong>{item.title}</strong>
                <span>
                  已掌握 {item.masteredCount} / {item.total} · 已见过 {item.seenCount}
                </span>
              </div>
            );
          })}
        </div>
        <p className="parent-one-liner">
          说明：听懂与读懂分别跨 3 个不同学习日独立答对才计入“已掌握”。本平台非官方 KET 模考，不预测剑桥考试分数。
        </p>
      </article>

      <div className="parent-grid-2col">
        {/* ④ 卡点清单 */}
        <article className="parent-card" aria-label="卡点清单">
          <div className="parent-card-head">
            <h2>④ 卡点清单</h2>
            <span className="tiny">近 7 天需巩固词：{stuckWords.length} 个</span>
          </div>
          {stuckWords.length > 0 ? (
            <>
              <div className="stuck-word-tags">
                {stuckWords.slice(0, 5).map((w) => (
                  <span key={w.id} className="stuck-word-chip">
                    <strong lang="en">{w.word}</strong> · {w.translation}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="primary"
                aria-label="今晚陪他看卡点词"
                onClick={() => onLaunchStuckWords?.(stuckWords.slice(0, 5))}
              >
                <Play size={17} /> 今晚陪他看这 {Math.min(5, stuckWords.length)} 个
              </button>
            </>
          ) : (
            <p className="parent-one-liner">
              目前没有连续答错的卡点词！今晚按正常节奏认识 4 个新朋友即可。
            </p>
          )}
        </article>

        {/* ⑤ 陪学建议（台词卡速览） */}
        <article className="parent-card" aria-label="陪学建议与台词">
          <div className="parent-card-head">
            <h2>
              <UserCheck size={19} /> ⑤ 今晚陪学 3 步动作
            </h2>
            <span className="tiny">你不需要会英语</span>
          </div>
          <ul className="parent-action-list">
            <li>
              <strong>1. 看图听音（3 分钟）：</strong>
              {STAGE_SCRIPTS.watch_listen.say[0]}（{STAGE_SCRIPTS.watch_listen.action}）
            </li>
            <li>
              <strong>2. 听辨找图（4 分钟）：</strong>
              {STAGE_SCRIPTS.quiz_choice.say[0]}（注意：{STAGE_SCRIPTS.quiz_choice.caution}）
            </li>
            <li>
              <strong>3. 生活延伸（2 分钟）：</strong>
              {currentThemeGuide.dailyAction}
            </li>
          </ul>
        </article>
      </div>

      {/* ⑥ 时间与内容设置 */}
      <article className="parent-card" aria-label="时间与内容设置">
        <div className="parent-card-head">
          <h2>⑥ 时间与内容设置</h2>
          <span className="tiny">实时生效</span>
        </div>
        <div className="parent-settings-grid">
          <label>
            当前学习模式
            <select
              aria-label="选择学习模式"
              value={profile.modePreference || "classic"}
              onChange={(e) => {
                const val = e.target.value;
                update((p) => updateProfile(p, { modePreference: val }));
                onSwitchMode?.(val);
              }}
            >
              <option value="solo">我自己学（零识字儿童独学）</option>
              <option value="colearn">和爸爸妈妈一起（带家长台词卡陪学）</option>
              <option value="classic">完整探索工作台（全部模块）</option>
            </select>
          </label>

          <label>
            每日建议时长上限
            <select
              aria-label="每日时长上限"
              value={profile.dailyMinutes || 10}
              onChange={(e) =>
                update((p) => updateProfile(p, { dailyMinutes: Number(e.target.value) }))
              }
            >
              <option value={10}>10 分钟（推荐 6 岁起步）</option>
              <option value={15}>15 分钟（常规巩固）</option>
              <option value={20}>20 分钟（周末进阶）</option>
            </select>
          </label>

          <label>
            英语口音
            <select
              aria-label="家长设置英语口音"
              value={settings?.lang || "en-GB"}
              onChange={(e) => setSettings?.({ ...settings, lang: e.target.value })}
            >
              <option value="en-GB">英式英语 (UK)</option>
              <option value="en-US">美式英语 (US)</option>
            </select>
          </label>

          <label>
            朗读语速 ({settings?.rate || 0.85}x)
            <input
              type="range"
              aria-label="家长设置朗读语速"
              min="0.6"
              max="1"
              step="0.05"
              value={settings?.rate || 0.85}
              onChange={(e) => setSettings?.({ ...settings, rate: Number(e.target.value) })}
            />
          </label>
        </div>

        <div className="parent-toggles-row">
          <label className="check-row">
            <input
              type="checkbox"
              checked={Boolean(profile.hideChinese)}
              onChange={(e) =>
                update((p) => updateProfile(p, { hideChinese: e.target.checked }))
              }
            />
            隐藏儿童端中文文字（开启“遮字测试”纯图标语音模式）
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={profile.lockAdvanced !== false}
              onChange={(e) =>
                update((p) => updateProfile(p, { lockAdvanced: e.target.checked }))
              }
            />
            默认收起 L3–L4 进阶与拼写写作区（保护 6 岁专注力）
          </label>
          <button
            type="button"
            className="quiet-button"
            onClick={() => say?.("Hello! Let’s have fun with English today.")}
          >
            <Volume2 size={17} /> 试听当前设备语音
          </button>
        </div>

        <div className="pin-config-row">
          <label>
            家长 4 位 PIN 码（防误触）：
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              aria-label="设置 4 位 PIN 码"
              placeholder={profile.pin ? `已设置 (${profile.pin})` : "未设置（如 1234）"}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </label>
          <button
            type="button"
            className="secondary"
            disabled={newPin.length !== 4}
            onClick={() => {
              update((p) => updateProfile(p, { pin: newPin }));
              setNewPin("");
              setPinVerified(true);
            }}
          >
            保存 PIN 码
          </button>
          {profile.pin && (
            <button
              type="button"
              className="quiet-button"
              onClick={() => update((p) => updateProfile(p, { pin: null }))}
            >
              清除 PIN 码
            </button>
          )}
        </div>
      </article>

      {/* ⑦ 数据与隐私 */}
      <article className="parent-card" aria-label="数据与隐私">
        <div className="parent-card-head">
          <h2>
            <ShieldCheck size={19} /> ⑦ 数据与隐私
          </h2>
          <span className="tiny">
            {account?.user ? syncLabels[account.status] : "本地存储模式"}
          </span>
        </div>
        <p className="parent-one-liner">
          隐私承诺：遵守《儿童个人信息网络保护规定》。口语录音仅留在当前内存供孩子自听，离开即销毁，永不上传；无任何第三方广告与跨站追踪。
        </p>
        <div className="parent-data-actions">
          <button type="button" className="secondary" onClick={onOpenAccount}>
            管理同步账户
          </button>
          <button type="button" className="secondary" onClick={handleExport}>
            <Download size={17} /> 导出学习记录 (JSON)
          </button>
          <button
            type="button"
            className="quiet-button danger-trigger"
            onClick={() => setConfirmDeleteOpen(!confirmDeleteOpen)}
          >
            <Trash2 size={17} /> 清空全部数据
          </button>
        </div>

        {exportedJson && (
          <div className="export-preview-box">
            <label htmlFor="exported-json-textarea">已导出的完整 JSON 记录（可复制备份或回放）：</label>
            <textarea
              id="exported-json-textarea"
              aria-label="导出的 JSON 数据"
              readOnly
              value={exportedJson}
              rows={4}
            />
          </div>
        )}

        <details className="import-data-details">
          <summary>导入 / 回放备份的 JSON 记录</summary>
          <div className="import-box">
            <textarea
              aria-label="粘贴要导入的 JSON 数据"
              placeholder="在此粘贴导出的 JSON 内容…"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={3}
            />
            <button
              type="button"
              className="secondary"
              disabled={!importText.trim()}
              onClick={handleImport}
            >
              <Upload size={16} /> 确认导入并回放
            </button>
            {importStatus && <p role="status" className="tiny">{importStatus}</p>}
          </div>
        </details>

        {confirmDeleteOpen && (
          <div className="danger-confirm-box" role="alert">
            <strong>确认要彻底删除全部学习记录吗？</strong>
            <p>此操作将清空本机所有单词记忆、每日计划、贴纸与模式记录，不可撤销。请在下方输入“删除”确认：</p>
            <div className="danger-confirm-controls">
              <input
                type="text"
                aria-label="输入删除确认清空数据"
                placeholder="请输入：删除"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value.trim())}
              />
              <button
                type="button"
                className="primary danger-btn"
                disabled={deleteConfirmText !== "删除"}
                onClick={handleDeleteAll}
              >
                确认彻底删除
              </button>
              <button
                type="button"
                className="quiet-button"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setDeleteConfirmText("");
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
