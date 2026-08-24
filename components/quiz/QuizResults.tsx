import Link from "next/link";
import type { Question, QuizAnswers, QuizResult } from "@/types/quiz";

export function QuizResults({ questions, answers, result, theoryBasePath, onRestart }: { readonly questions: readonly Question[]; readonly answers: QuizAnswers; readonly result: QuizResult; readonly theoryBasePath: string; readonly onRestart: () => void }) {
  return (
    <section aria-labelledby="quiz-result-title">
      <div className="rounded-xl bg-[#172033] p-7 text-white sm:p-10"><p className="text-sm font-extrabold uppercase tracking-[0.16em] text-amber-300">Resultado</p><h2 id="quiz-result-title" className="mt-3 text-3xl font-black sm:text-4xl">{result.score}/10</h2><p className="mt-3 text-xl font-bold text-slate-300">{result.percentage}% de aciertos</p></div>
      <div className="mt-10"><h2 className="section-title text-3xl">Revisión de errores</h2>
        {result.incorrect.length === 0 ? <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-5 font-bold text-emerald-900">10/10: has dominado todos los temas de este intento.</p> : <div className="mt-5 space-y-5">{result.incorrect.map((item) => {
          const question = questions.find((candidate) => candidate.id === item.questionId);
          if (!question) return null;
          const selected = question.answers.find((answer) => answer.id === answers[question.id]);
          const correct = question.answers.find((answer) => answer.id === item.correctAnswerId);
          return <article key={question.id} className="rounded-xl border border-rose-200 bg-white p-5 sm:p-7"><p className="eyebrow">{question.concept}</p><h3 className="mt-2 text-lg font-black text-slate-950">{question.prompt}</h3><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div className="rounded-lg bg-rose-50 p-4"><dt className="font-extrabold text-rose-900">Tu respuesta</dt><dd>{selected?.text}</dd></div><div className="rounded-lg bg-emerald-50 p-4"><dt className="font-extrabold text-emerald-900">Respuesta correcta</dt><dd>{correct?.text}</dd></div></dl><p className="mt-4 leading-7 text-slate-700">{question.explanation}</p><Link className="mt-4 inline-block font-extrabold text-[#bd3f1d] underline" href={`${theoryBasePath}#${question.lessonId}`}>Repasar este tema</Link></article>;
        })}</div>}
      </div>
      <button type="button" className="primary-button mt-8" onClick={onRestart}>Generar otro intento</button>
    </section>
  );
}
