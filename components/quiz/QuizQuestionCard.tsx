import type { Question } from "@/types/quiz";

export function QuizQuestionCard({ question, questionNumber, selectedAnswerId, onSelect }: { readonly question: Question; readonly questionNumber: number; readonly selectedAnswerId?: string; readonly onSelect: (answerId: string) => void }) {
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <legend className="sr-only">Pregunta {questionNumber}</legend>
      <p className="eyebrow">Pregunta {questionNumber}</p>
      <h2 className="mt-3 text-xl font-black leading-8 tracking-tight text-slate-950 sm:text-2xl">{question.prompt}</h2>
      <div className="mt-7 grid gap-3">{question.answers.map((answer) => {
        const selected = selectedAnswerId === answer.id;
        return <label key={answer.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${selected ? "border-[#e85d34] bg-orange-50 ring-1 ring-[#e85d34]" : "border-slate-200 bg-white hover:border-slate-400"}`}><input type="radio" name={`question-${question.id}`} value={answer.id} checked={selected} onChange={() => onSelect(answer.id)} className="h-4 w-4 accent-[#e85d34]" /><span className="font-medium text-slate-800">{answer.text}</span></label>;
      })}</div>
    </fieldset>
  );
}
