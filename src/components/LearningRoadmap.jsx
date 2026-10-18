import { useState } from "react";
import { Compass, Calendar, Volume2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { LEARNING_STAGES, WEEKLY_SCHEDULE, computeStageProgress } from "../data/learning-roadmap.js";

export default function LearningRoadmap({ progress, curriculum, say, onNavigateStage }) {
  const [activeScheduleId, setActiveScheduleId] = useState(WEEKLY_SCHEDULE[0].id);
  const [expandedStageId, setExpandedStageId] = useState(LEARNING_STAGES[0].id);
  const stageStats = computeStageProgress(progress, curriculum);
  const currentSchedule =
    WEEKLY_SCHEDULE.find((item) => item.id === activeScheduleId) || WEEKLY_SCHEDULE[0];

  function speakRoadmapGuide() {
    say?.(
      "欢迎查看全周期四阶英语学习计划。第一阶段学习自然拼读与音素解码，见词能读；第二阶段积累生活高频词，在真实场景中自然开口交流；第三阶段突破剑桥KET核心词汇、语法与短篇写作；第四阶段进阶到两百词长文深度阅读与观点表达。每天坚持二十五到三十分钟，循序渐进就能稳步成长。",
      0.9,
      undefined,
      undefined,
      "zh-CN",
    );
  }

  return (
    <section className="learning-roadmap-section" aria-label="全周期四阶英语学习规划">
      <div className="section-heading">
        <div>
          <span className="eyebrow">4-STAGE PROGRESSIVE CURRICULUM · 循序渐进全周期方案</span>
          <h2>
            <Compass size={20} /> 从自然拼读入门到流畅交流、文章写作与长文阅读
          </h2>
        </div>
        <button
          type="button"
          className="quiet-button"
          onClick={speakRoadmapGuide}
          aria-label="听全周期学习规划说明"
        >
          <Volume2 size={17} /> 听规划说明
        </button>
      </div>

      <p className="roadmap-intro">
        遵循儿童语言习得规律，以<strong>自然拼读（Phonics）</strong>打通声音与文字的桥梁，再按
        <strong>“听音辨义 → 情景交际 → 引导式造句成文 → 跨学科长文精读”</strong>四阶拾级而上：
      </p>

      <div className="roadmap-stages-grid" role="list" aria-label="四阶成长路线图">
        {LEARNING_STAGES.map((stage) => {
          const stat = stageStats[stage.id] || { percent: 0, summary: "" };
          const isExpanded = expandedStageId === stage.id;
          return (
            <article
              key={stage.id}
              role="listitem"
              className={`roadmap-stage-card stage-order-${stage.order} ${isExpanded ? "expanded" : ""}`}
            >
              <div className="roadmap-stage-top">
                <span className="roadmap-cefr-badge">{stage.cefr}</span>
                <span className="tiny">{stage.duration}</span>
              </div>

              <h3>{stage.title}</h3>
              <p className="roadmap-stage-sub">{stage.subtitle}</p>
              <p className="roadmap-stage-goal">{stage.goal}</p>

              <div className="roadmap-progress-box">
                <div className="roadmap-progress-meta">
                  <span>阶段探索度</span>
                  <strong>{stat.percent}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${stat.percent}%` }} />
                </div>
                <small className="tiny">{stat.summary}</small>
              </div>

              <div className="roadmap-milestones">
                {stage.milestones.map((item) => (
                  <div key={item} className="roadmap-milestone-row">
                    <CheckCircle2 size={15} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="roadmap-stage-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setExpandedStageId(stage.id);
                    onNavigateStage?.(stage.targetPage, stage.targetSection);
                  }}
                >
                  {stage.actionLabel} <ArrowRight size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="roadmap-schedule-card">
        <div className="roadmap-schedule-header">
          <div>
            <span className="eyebrow">WEEKLY STUDY RHYTHM · 科学排期</span>
            <h3>
              <Calendar size={18} /> 推荐每周学习节奏（保护兴趣 · 细水长流）
            </h3>
          </div>
          <div className="roadmap-schedule-tabs" role="group" aria-label="切换每周学习日安排">
            {WEEKLY_SCHEDULE.map((sched) => (
              <button
                type="button"
                key={sched.id}
                aria-pressed={currentSchedule.id === sched.id}
                className={`quiet-button ${currentSchedule.id === sched.id ? "active-schedule-tab" : ""}`}
                onClick={() => setActiveScheduleId(sched.id)}
              >
                {sched.days}
              </button>
            ))}
          </div>
        </div>

        <p className="roadmap-schedule-subtitle">
          <Sparkles size={15} /> <strong>{currentSchedule.title}</strong> · 建议总时长：{currentSchedule.duration}
        </p>

        <div className="roadmap-steps-grid">
          {currentSchedule.steps.map((step, idx) => (
            <div key={step.name} className="roadmap-step-item">
              <span className="roadmap-step-badge">
                环节 {idx + 1} · {step.time}
              </span>
              <strong>{step.name}</strong>
              <p>{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
