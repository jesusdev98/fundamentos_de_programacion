import Link from "next/link";
import type { Question, QuizAnswers, QuizResult } from "@/types/quiz";

export function QuizResults({ questions, answers, result, theoryBasePath, onRestart }: { readonly questions: readonly Question[]; readonly answers: QuizAnswers; readonly result: QuizResult; readonly theoryBasePath: string; readonly onRestart: () => void }) {
  return (
    <section aria-labelledby="quiz-result-title">
      <div className="result-summary p-7 sm:p-10"><p className="font-mono text-xs font-extrabold uppercase tracking-[0.12em] text-[#d9b36c]">Resultado</p><h2 id="quiz-result-title" className="mt-3 text-3xl font-extrabold sm:text-4xl">{result.score}/10</h2><p className="mt-3 text-xl font-bold text-[#c8cfcb]">{result.percentage}% de aciertos</p></div>
      <div className="mt-10"><h2 className="section-title text-3xl">Revisión de errores</h2>
        {result.incorrect.length === 0 ? <p className="mt-5 rounded border border-[#50816a] bg-[#e5eee8] p-5 font-bold text-[#20563c]">10/10: has dominado todos los temas de este intento.</p> : <div className="mt-5 space-y-5">{result.incorrect.map((item) => {
          const question = questions.find((candidate) => candidate.id === item.questionId);
          if (!question) return null;
          const selected = question.answers.find((answer) => answer.id === answers[question.id]);
          const correct = question.answers.find((answer) => answer.id === item.correctAnswerId);
          return <article key={question.id} className="quiz-panel p-5 sm:p-7"><p className="eyebrow">{question.concept}</p><h3 className="mt-2 text-lg font-extrabold">{question.prompt}</h3><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div className="result-answer p-4" data-result="incorrect"><dt className="font-extrabold text-[#8b302d]">Tu respuesta</dt><dd>{selected?.text}</dd></div><div className="result-answer p-4" data-result="correct"><dt className="font-extrabold text-[#20563c]">Respuesta correcta</dt><dd>{correct?.text}</dd></div></dl><p className="mt-4 leading-7 text-[#343b37]">{question.explanation}</p><Link className="text-link mt-4 inline-flex min-h-11 items-center" href={`${theoryBasePath}#${question.lessonId}`}>Repasar este tema</Link></article>;
        })}</div>}
      </div>
      <button type="button" className="primary-button mt-8" onClick={onRestart}>Generar otro intento</button>
    </section>
  );
}
