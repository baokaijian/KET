import { useState } from "react";
import { PenLine, Volume2, CheckCircle2, Sparkles, RotateCcw } from "lucide-react";
import {
  WRITING_SCAFFOLDS,
  GUIDED_WRITING_TASKS,
  analyzeWritingDraft,
} from "../data/writing-scaffolds.js";
import { playClickSound, playCorrectSound } from "../utils/audio.js";

export default function GuidedWritingWorkshop({ progress, update, say }) {
  const [taskId, setTaskId] = useState(GUIDED_WRITING_TASKS[0].id);
  const [showSample, setShowSample] = useState(false);
  const [pointChecks, setPointChecks] = useState({});

  const currentTask =
    GUIDED_WRITING_TASKS.find((t) => t.id === taskId) || GUIDED_WRITING_TASKS[0];
  const scaffold = WRITING_SCAFFOLDS[currentTask.kind] || WRITING_SCAFFOLDS.email;
  const draftKey = `guided_${currentTask.id}`;
  const draftText = progress?.drafts?.[draftKey] || "";
  const analysis = analyzeWritingDraft(draftText, currentTask.minWords);
  const isCompleted = (progress?.selfReviews || []).includes(draftKey);
  const allPointsChecked = currentTask.points.every((_, idx) => pointChecks[idx]);

  function updateDraft(nextText) {
    update?.((p) => ({
      ...p,
      drafts: { ...(p.drafts || {}), [draftKey]: nextText },
      selfReviews: (p.selfReviews || []).filter((id) => id !== draftKey),
    }));
  }

  function insertScaffoldText(snippet) {
    playClickSound();
    const trimmed = draftText.trimEnd();
    const separator = !trimmed ? "" : /[,:;]$/.test(trimmed) ? " " : " ";
    updateDraft(trimmed ? `${trimmed}${separator}${snippet}` : snippet);
  }

  function handleRecordSelfCheck() {
    if (!analysis.meetsWordCount || !allPointsChecked) return;
    playCorrectSound();
    update?.((p) => ({
      ...p,
      selfReviews: [...new Set([...(p.selfReviews || []), draftKey])],
    }));
  }

  return (
    <section
      id="guided-writing-section"
      className="guided-writing-section"
      aria-label="阶梯式引导写作工坊"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">STAGE 3 & 4 · GUIDED WRITING WORKSHOP</span>
          <h2>
            <PenLine size={20} /> 阶梯式引导写作工坊（从句型积木到独立成文）
          </h2>
        </div>
        <span className="muted">句型脚手架 · 逻辑连接词 · 实时结构自查</span>
      </div>

      <div className="writing-task-tabs" role="group" aria-label="选择引导式写作任务">
        {GUIDED_WRITING_TASKS.map((task) => {
          const done = (progress?.selfReviews || []).includes(`guided_${task.id}`);
          return (
            <button
              type="button"
              key={task.id}
              aria-pressed={currentTask.id === task.id}
              className={`quiet-button ${currentTask.id === task.id ? "active-writing-tab" : ""}`}
              onClick={() => {
                playClickSound();
                setTaskId(task.id);
                setPointChecks({});
                setShowSample(false);
              }}
            >
              <div>
                <strong>{task.title}</strong>
                <small>
                  {task.stageLabel} · 至少 {task.minWords} 词
                </small>
              </div>
              {done && <CheckCircle2 size={16} className="positive" />}
            </button>
          );
        })}
      </div>

      <div className="guided-writing-grid">
        <div className="guided-editor-column">
          <div className="guided-prompt-card">
            <span className="tag">{currentTask.stageLabel}</span>
            <h3>{currentTask.title}</h3>
            <p>{currentTask.prompt}</p>
            <ol className="writing-points">
              {currentTask.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ol>
            <p className="tiny">
              <Sparkles size={14} /> {scaffold.structureTip}
            </p>
          </div>

          <label className="writing-label" htmlFor="guided-writing-textarea">
            我的英文写作草稿（点击右侧句型积木可一键插入）
          </label>
          <textarea
            id="guided-writing-textarea"
            lang="en"
            rows={7}
            value={draftText}
            placeholder="点击右侧脚手架句型或直接输入英文..."
            onChange={(e) => updateDraft(e.target.value)}
          />

          <div className="guided-coach-bar" role="status">
            <div className="coach-metrics">
              <span className={analysis.meetsWordCount ? "positive" : "muted"}>
                词数：<strong>{analysis.wordCount}</strong> / {currentTask.minWords} 词
              </span>
              <span>句子数：{analysis.sentenceCount} 句</span>
              <span>
                首字母大写：{analysis.startsWithCapital ? "✓" : "待补充"}
              </span>
              <span>
                句末标点：{analysis.endsWithPunctuation ? "✓" : "待补充"}
              </span>
              <span>
                逻辑连接词：
                {analysis.usedConnectors.length > 0
                  ? analysis.usedConnectors.join(", ")
                  : "建议添加 because/so/first 等"}
              </span>
            </div>

            {analysis.suggestions.length > 0 && (
              <ul className="coach-suggestions">
                {analysis.suggestions.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="guided-checklist-box">
            <h4>写作要点自查清单（全部勾选并达标后可记录完成）：</h4>
            {currentTask.points.map((pt, idx) => (
              <label key={pt} className="check-row">
                <input
                  type="checkbox"
                  checked={!!pointChecks[idx]}
                  onChange={(e) =>
                    setPointChecks({ ...pointChecks, [idx]: e.target.checked })
                  }
                />
                <span>{pt}</span>
              </label>
            ))}

            <div className="guided-actions-row">
              <button
                type="button"
                className="primary"
                disabled={!analysis.meetsWordCount || !allPointsChecked || isCompleted}
                onClick={handleRecordSelfCheck}
              >
                <CheckCircle2 size={17} />{" "}
                {isCompleted ? "已完成本篇写作自查" : "完成写作并记录自查"}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowSample((prev) => !prev)}
              >
                {showSample ? "收起高分范文" : "查看参考范文"}
              </button>
              <button
                type="button"
                className="quiet-button"
                disabled={!draftText}
                onClick={() => updateDraft("")}
              >
                <RotateCcw size={15} /> 清空草稿
              </button>
            </div>
          </div>

          {showSample && (
            <div className="example">
              <blockquote lang="en">{currentTask.example}</blockquote>
              <button
                type="button"
                className="quiet-button"
                onClick={() => say?.(currentTask.example, 0.85)}
              >
                <Volume2 size={17} /> 朗读参考范文
              </button>
            </div>
          )}
        </div>

        <aside className="guided-scaffolds-column" aria-label="写作句型脚手架">
          <h3>{scaffold.label}</h3>
          <p className="tiny">点击句型积木即可插入到左侧草稿框，点击小喇叭可听发音：</p>

          <div className="scaffold-groups-list">
            {scaffold.groups.map((group) => (
              <div key={group.category} className="scaffold-group-box">
                <h4>{group.category}</h4>
                <div className="scaffold-items-list">
                  {group.items.map((item) => (
                    <div key={item.en} className="scaffold-chip-row">
                      <button
                        type="button"
                        className="scaffold-insert-btn"
                        onClick={() => insertScaffoldText(item.en)}
                        title={`点击将 "${item.en}" 插入草稿`}
                      >
                        <strong lang="en">+ {item.en}</strong>
                        <small>{item.zh}</small>
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`听句型 ${item.en}`}
                        onClick={() => say?.(item.en, 0.85)}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
