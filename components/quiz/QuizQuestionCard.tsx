import type { Question } from "@/types/quiz";

export function QuizQuestionCard({ question, questionNumber, selectedAnswerId, onSelect }: { readonly question: Question; readonly questionNumber: number; readonly selectedAnswerId?: string; readonly onSelect: (answerId: string) => void }) {
  return (
    <fieldset className="quiz-question min-w-0 p-5 sm:p-8">
      <legend className="sr-only">Pregunta {questionNumber}</legend>
      <p className="eyebrow">Pregunta {questionNumber}</p>
      <h2 className="mt-3 text-xl font-extrabold leading-8 tracking-tight sm:text-2xl">{question.prompt}</h2>
      <div className="mt-7 grid gap-3">{question.answers.map((answer) => {
        const selected = selectedAnswerId === answer.id;
        return <label key={answer.id} className="answer-option p-4" data-selected={selected}><input type="radio" name={`question-${question.id}`} value={answer.id} checked={selected} onChange={() => onSelect(answer.id)} className="h-5 w-5 shrink-0 accent-[#c54b32]" /><span className="font-medium text-[#343b37]">{answer.text}</span></label>;
      })}</div>
    </fieldset>
  );
}
