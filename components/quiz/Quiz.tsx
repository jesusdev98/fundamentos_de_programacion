"use client";

import { useState } from "react";
import { createQuizAttempt, evaluateQuiz } from "@/lib/quiz";
import type { Question, QuizAnswers, QuizResult } from "@/types/quiz";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizResults } from "./QuizResults";
import type { LevelSlug } from "@/data/javascript/levels";

export function Quiz({ bank, level }: { readonly bank: readonly Question[]; readonly level: LevelSlug }) {
  const [questions, setQuestions] = useState<readonly Question[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  function start() { setQuestions(createQuizAttempt(bank)); setAnswers({}); setCurrent(0); setResult(null); }
  if (!questions) return <section className="rounded-xl border border-slate-200 bg-white p-7 text-center"><p className="font-black text-slate-950">Banco: 50 / Intento actual: 10</p><p className="mt-3 text-slate-600">Cada intento toma diez preguntas únicas y mezcla sus respuestas.</p><button className="primary-button mt-6" type="button" onClick={start}>Comenzar intento</button></section>;
  if (result) return <QuizResults questions={questions} answers={answers} result={result} level={level} onRestart={start} />;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === questions.length;
  return (
    <section aria-label={`Cuestionario de JavaScript ${level}`}>
      <p className="mb-4 text-sm font-black text-slate-700">Banco: {bank.length} / Intento actual: {questions.length}</p>
      <QuizProgress current={current + 1} total={questions.length} answered={answered} />
      <div className="mt-5"><QuizQuestionCard question={questions[current]} questionNumber={current + 1} selectedAnswerId={answers[questions[current].id]} onSelect={(answerId) => setAnswers((value) => ({ ...value, [questions[current].id]: answerId }))} /></div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><button type="button" className="secondary-button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Anterior</button><div className="flex flex-wrap justify-center gap-2" aria-label="Ir a una pregunta">{questions.map((question, index) => <button key={question.id} type="button" aria-label={`Pregunta ${index + 1}${answers[question.id] ? ", respondida" : ""}`} aria-current={index === current ? "step" : undefined} className={`h-8 w-8 rounded-md text-xs font-black ${index === current ? "bg-[#172033] text-white" : answers[question.id] ? "bg-emerald-100 text-emerald-900" : "bg-slate-200"}`} onClick={() => setCurrent(index)}>{index + 1}</button>)}</div><button type="button" className="secondary-button" disabled={current === questions.length - 1} onClick={() => setCurrent((value) => value + 1)}>Siguiente</button></div>
      <div className="mt-8 border-t border-slate-200 pt-7">{!allAnswered ? <p id="quiz-incomplete" className="mb-4 font-bold text-amber-800" role="status">Faltan {questions.length - answered} respuestas para finalizar.</p> : null}<button type="button" className="primary-button" disabled={!allAnswered} aria-describedby={!allAnswered ? "quiz-incomplete" : undefined} onClick={() => allAnswered && setResult(evaluateQuiz(questions, answers))}>Finalizar cuestionario</button></div>
    </section>
  );
}
