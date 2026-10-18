import { useState } from "react";
import { ArrowLeft, Check, Volume2, Sparkles } from "lucide-react";
import { countEnglishWords } from "../utils/learningProgress.js";
import { WRITING_SCAFFOLDS, analyzeWritingDraft } from "../data/writing-scaffolds.js";

export default function ProductionWorkspace({ task, mode, progress, update, exit, say, speaking }) {
  const [submitted, setSubmitted] = useState(false);
  const [checks, setChecks] = useState({});
  const [example, setExample] = useState(false);
  const draft = progress.drafts?.[task.id] || "";
  const count = countEnglishWords(draft);
  const analysis = analyzeWritingDraft(draft, task.minWords);
  const scaffold = WRITING_SCAFFOLDS[task.kind] || WRITING_SCAFFOLDS.email;
  const allChecked = task.points.every((_, index) => checks[index]);
  const selfReviewed = progress.selfReviews?.includes(task.id);

  function insertText(snippet) {
    const trimmed = draft.trimEnd();
    const nextText = trimmed ? `${trimmed} ${snippet}` : snippet;
    update((p) => ({
      ...p,
      drafts: { ...p.drafts, [task.id]: nextText },
      selfReviews: (p.selfReviews || []).filter((id) => id !== task.id),
    }));
    setSubmitted(false);
    setChecks({});
  }

  return (
    <section className="production-workspace">
      <div className="practice-header"><button className="quiet-button" onClick={exit}><ArrowLeft size={18} /> 返回课程</button><span>单元 {task.unit} · {mode === "writing" ? "写作" : "口语"}</span></div>
      {mode === "speaking" ? speaking : <div className="skill-workspace">
        <span className="eyebrow">{task.kind === "story" ? "TELL A STORY · PART 7 SKILLS" : "WRITE AN EMAIL · PART 6 SKILLS"}</span>
        <h2>{task.title}</h2><p>写一篇至少 {task.minWords} 个英文单词的{task.kind === "story" ? "故事" : "邮件"}。</p>
        <ol className="writing-points">{task.points.map((point) => <li key={point}>{point}</li>)}</ol>
        {task.kind === "story" && <p className="tiny">本课用三步情节引导叙事；正式 Part 7 根据三幅图片写故事。</p>}
        <details className="production-scaffold-helper">
          <summary><Sparkles size={15} /> 打开句型脚手架与连接词助手（点击可插入草稿）</summary>
          <p className="tiny">{scaffold.structureTip}</p>
          <div className="scaffold-groups-list">
            {scaffold.groups.map((group) => (
              <div key={group.category} className="scaffold-group-box">
                <h4>{group.category}</h4>
                <div className="scaffold-items-list">
                  {group.items.map((item) => (
                    <button
                      type="button"
                      key={item.en}
                      className="quiet-button"
                      onClick={() => insertText(item.en)}
                    >
                      <span lang="en">+ {item.en}</span>
                      <small className="muted">（{item.zh}）</small>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
        <label className="writing-label" htmlFor="course-draft">我的英文{task.kind === "story" ? "故事" : "邮件"}</label>
        <textarea id="course-draft" lang="en" value={draft} placeholder={task.kind === "story" ? "Last weekend, ..." : "Hi Alex, ..."} onChange={(event) => { const text = event.target.value; update((p) => ({ ...p, drafts: { ...p.drafts, [task.id]: text }, selfReviews: (p.selfReviews || []).filter((id) => id !== task.id) })); setSubmitted(false); setChecks({}); }} />
        <p className="tiny">
          已用连接词：{analysis.usedConnectors.length ? analysis.usedConnectors.join(", ") : "可尝试加入 because / and / but / so / finally"}
        </p>
        <div className="writing-bottom"><span className={count >= task.minWords ? "positive" : "muted"}>{count} / {task.minWords} words</span><button className="primary" disabled={count < task.minWords} onClick={() => setSubmitted(true)}>完成并自查 <Check size={17} /></button></div>
        {submitted && <div className="writing-review" role="status"><h3>逐项确认有没有说清楚</h3>{task.points.map((point, index) => <label className="check-row" key={point}><input type="checkbox" checked={!!checks[index]} onChange={(event) => setChecks({ ...checks, [index]: event.target.checked })} />{point}</label>)}<p className="tiny">检查句首大写、标点、时态和拼写。自动字数检查不代表语言评分。</p><button className="secondary" disabled={!allChecked || selfReviewed} onClick={() => update((p) => ({ ...p, selfReviews: [...new Set([...(p.selfReviews || []), task.id])] }))}>{selfReviewed ? "已记录自查" : "记录这次自查"}<Check size={17} /></button></div>}
        {selfReviewed && !submitted && <p className="positive">这篇草稿已完成自查。</p>}
        <button className="text-button" onClick={() => setExample(!example)}>{example ? "收起参考范文" : "看参考范文"}</button>
        {example && <div className="example"><blockquote lang="en">{task.example}</blockquote><button className="quiet-button" onClick={() => say(task.example)}><Volume2 size={18} /> 听范文</button></div>}
        <p className="tiny">每个单元分别保存草稿，仅保存在本设备。语法与内容可请老师进一步检查。</p>
      </div>}
    </section>
  );
}
