"use client";

import { useState } from "react";
import { createQuizAttempt, evaluateQuiz } from "@/lib/quiz";
import type { Question, QuizAnswers, QuizResult } from "@/types/quiz";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizResults } from "./QuizResults";

export function Quiz({ bank, languageName, theoryBasePath }: { readonly bank: readonly Question[]; readonly languageName: string; readonly theoryBasePath: string }) {
  const [questions, setQuestions] = useState<readonly Question[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  function start() { setQuestions(createQuizAttempt(bank)); setAnswers({}); setCurrent(0); setResult(null); }
  if (!questions) return <section className="quiz-panel p-6 text-center sm:p-8"><p className="font-mono text-sm font-extrabold">Banco: 50 / Intento actual: 10</p><p className="mt-3 text-[#626862]">Cada intento selecciona diez preguntas únicas y baraja sus respuestas.</p><button className="primary-button mt-6" type="button" onClick={start}>Comenzar intento</button></section>;
  if (result) return <QuizResults questions={questions} answers={answers} result={result} theoryBasePath={theoryBasePath} onRestart={start} />;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === questions.length;
  return (
    <section aria-label={`Cuestionario de ${languageName}`}>
      <p className="mb-4 font-mono text-sm font-extrabold text-[#343b37]">Banco: {bank.length} / Intento actual: {questions.length}</p>
      <QuizProgress current={current + 1} total={questions.length} answered={answered} />
      <div className="mt-5"><QuizQuestionCard question={questions[current]} questionNumber={current + 1} selectedAnswerId={answers[questions[current].id]} onSelect={(answerId) => setAnswers((value) => ({ ...value, [questions[current].id]: answerId }))} /></div>
      <div className="quiz-actions mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><button type="button" className="secondary-button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Anterior</button><div className="flex flex-wrap justify-center gap-2" aria-label="Ir a una pregunta">{questions.map((question, index) => <button key={question.id} type="button" aria-label={`Pregunta ${index + 1}${answers[question.id] ? ", respondida" : ""}`} aria-current={index === current ? "step" : undefined} data-answered={Boolean(answers[question.id])} className="question-jump" onClick={() => setCurrent(index)}>{index + 1}</button>)}</div><button type="button" className="secondary-button" disabled={current === questions.length - 1} onClick={() => setCurrent((value) => value + 1)}>Siguiente</button></div>
      <div className="mt-8 border-t border-[#c9c7bc] pt-7">{!allAnswered ? <p id="quiz-incomplete" className="mb-4 font-bold text-[#875615]" role="status">Faltan {questions.length - answered} respuestas para finalizar.</p> : null}<button type="button" className="primary-button" disabled={!allAnswered} aria-describedby={!allAnswered ? "quiz-incomplete" : undefined} onClick={() => allAnswered && setResult(evaluateQuiz(questions, answers))}>Finalizar cuestionario</button></div>
    </section>
  );
}
