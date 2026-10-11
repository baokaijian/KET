import { useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, BookOpen, Headphones, PenLine, Mic, Target } from "lucide-react";
import { useLocalStorageState } from "../hooks/useLocalStorageState.js";

function CourseButton({ lesson, progress, launch }) {
  const passed = progress.completed.includes(lesson.id);
  return (
    <button className="course-row" onClick={() => launch(lesson)} aria-label={`开始${lesson.title}`}>
      <span><strong>{lesson.title}</strong><small>{lesson.words ? `${lesson.words.length} 个词 · ` : ""}{lesson.minutes} 分钟{lesson.guide ? " · 先讲解，后练习" : ""}</small></span>
      {passed ? <CheckCircle2 size={20} className="positive" /> : <ArrowRight size={20} />}
    </button>
  );
}

export default function CourseHub({ curriculum, progress, launch, produce }) {
  const [unitId, setUnitId] = useLocalStorageState("sparks_course_unit", 1);
  const [vocabPage, setVocabPage] = useState(0);
  if (!curriculum) return <p role="status">正在准备完整课程…</p>;
  const unit = curriculum.curriculumUnits.find((item) => item.id === unitId) || curriculum.curriculumUnits[0];
  const required = [...unit.vocabulary, ...unit.grammar, unit.skillLesson, unit.checkpoint];
  const passed = required.filter((lesson) => progress.completed.includes(lesson.id)).length;
  const next = curriculum.nextCourseLesson(progress);
  return (
    <section className="course-hub" aria-label="KET 系统课程">
      <div className="section-heading"><div><span className="eyebrow">YOUR A2 JOURNEY</span><h2>KET 系统课程</h2></div><span className="muted">12 单元 · 1687 词 · 听读写说</span></div>
      <div className="course-continue">
        <div><strong>接着学：{next.title}</strong><p>每课约 8–12 分钟。客观练习答对至少 80% 后记为通过。</p></div>
        <button className="primary" onClick={() => launch(next)}>继续课程 <ArrowRight size={18} /></button>
      </div>
      <div className="unit-navigation" aria-label="选择课程单元">
        {curriculum.curriculumUnits.map((item) => <button key={item.id} aria-pressed={unitId === item.id} onClick={() => { setUnitId(item.id); setVocabPage(0); }}><small>{item.phase} · {String(item.id).padStart(2, "0")}</small><strong>{item.name}</strong></button>)}
      </div>
      <div className="unit-heading"><div><h3>单元 {unit.id} · {unit.name}</h3><p>{unit.description}</p></div><span className="tag">已通过 {passed} / {required.length} 课</span></div>
      <div className="course-sections">
        <div className="course-column">
          <h4><BookOpen size={18} /> 词汇积累 <span>{unit.vocabulary.reduce((sum, lesson) => sum + lesson.words.length, 0)} 词</span></h4>
          {unit.vocabulary.slice(vocabPage * 5, vocabPage * 5 + 5).map((lesson) => <CourseButton key={lesson.id} lesson={lesson} progress={progress} launch={launch} />)}
          {unit.vocabulary.length > 5 && <div className="pagination"><button className="quiet-button" disabled={vocabPage === 0} onClick={() => setVocabPage(vocabPage - 1)}>上一组</button><span>{vocabPage + 1} / {Math.ceil(unit.vocabulary.length / 5)}</span><button className="quiet-button" disabled={(vocabPage + 1) * 5 >= unit.vocabulary.length} onClick={() => setVocabPage(vocabPage + 1)}>下一组</button></div>}
        </div>
        <div className="course-column">
          <h4><PenLine size={18} /> 语法与理解</h4>
          {unit.grammar.map((lesson) => <CourseButton key={lesson.id} lesson={lesson} progress={progress} launch={launch} />)}
          <CourseButton lesson={unit.skillLesson} progress={progress} launch={launch} />
          <h4><Mic size={18} /> 写作与表达</h4>
          <button className="course-row" onClick={() => produce(unit.production, "writing")}><span><strong>{unit.production.title}</strong><small>{unit.production.minWords} 词{unit.production.kind === "story" ? "故事" : "邮件"} · 草稿与自查</small></span><PenLine size={19} /></button>
          <button className="course-row" onClick={() => produce(unit.production, "speaking")}><span><strong>说说{unit.name}</strong><small>3 个话题 · 录音回听 · 练习理由和互动</small></span><Mic size={19} /></button>
          <CourseButton lesson={unit.checkpoint} progress={progress} launch={launch} />
        </div>
      </div>
      <details className="exam-coverage"><summary><Target size={18} /> 查看 KET 各部分专项练习</summary><div className="coverage-grid">{curriculum.examCoverage.map((part) => <button className="quiet-button" key={part.id} onClick={() => { if (part.lessonId) launch(curriculum.courseLessons.find((lesson) => lesson.id === part.lessonId)); else produce(curriculum.curriculumUnits.find((item) => item.production.id === part.taskId).production, part.mode || "writing"); }}>{part.id.startsWith("L") ? <Headphones size={17} /> : part.id.startsWith("S") ? <Mic size={17} /> : <BookOpen size={17} />}{part.title}</button>)}</div><p className="tiny">按官方技能结构组织的自编练习，不是正式模拟卷。听力关键信息使用文字选项；故事写作先用三步情节引导，逐步练到图示叙事。</p></details>
      <p className="tiny"><RotateCcw size={13} /> 所有单元都可自由选择；做错的客观题会进入成长记录中的复习区。</p>
    </section>
  );
}
