import { useState } from "react";
import { ArrowRight, Target } from "lucide-react";

export default function CourseAssessment({ curriculum, start, produce }) {
  const [part, setPart] = useState("R1");
  if (!curriculum) return <p role="status">正在打开专项训练…</p>;
  const selected = curriculum.examCoverage.find((item) => item.id === part);
  function launch() {
    if (selected.lessonId) start(curriculum.courseLessons.find((lesson) => lesson.id === selected.lessonId));
    else produce(curriculum.curriculumUnits.find((unit) => unit.production.id === selected.taskId).production, selected.mode || "writing");
  }
  return <section className="course-assessment" aria-label="A2 专项测评">
    <div className="section-heading"><div><span className="eyebrow">A2 KEY · NEXT LEVEL</span><h2>专项训练与阶段测评</h2></div><Target size={24} /></div>
    <p>从告示、邮件到完整对话，练习真正的信息理解。写作与口语使用自查，不生成考试分数。</p>
    <div className="assessment-picker"><label htmlFor="exam-part">选择专项</label><select id="exam-part" value={part} onChange={(event) => setPart(event.target.value)}>{curriculum.examCoverage.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><button className="primary" onClick={launch}>开始专项 <ArrowRight size={18} /></button></div>
    <div className="checkpoint-grid">{curriculum.curriculumUnits.map((unit) => <button key={unit.id} className="quiet-button" onClick={() => start(unit.checkpoint)}><span>单元 {unit.id} · {unit.name}</span><ArrowRight size={16} /></button>)}</div>
    <button className="secondary" onClick={() => start({ title: "A2 综合理解检查", skill: "mixed", questions: curriculum.curriculumUnits.flatMap((unit) => unit.skillLesson.questions) })}>A2 综合检查 · 36 题 <ArrowRight size={18} /></button>
    <p className="tiny">分数只表示本次自编练习的正确率，不等同于 Cambridge English Scale 或正式考试成绩。</p>
  </section>;
}
