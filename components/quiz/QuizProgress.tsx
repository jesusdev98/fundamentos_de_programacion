export function QuizProgress({
  current,
  total,
  answered,
}: {
  readonly current: number;
  readonly total: number;
  readonly answered: number;
}) {
  return (
    <div className="quiz-panel p-4">
      <div className="flex flex-wrap justify-between gap-2 font-mono text-sm font-bold text-[#343b37]">
        <span>
          Pregunta {current} de {total}
        </span>
        <span>{answered} respondidas</span>
      </div>
      <div
        className="mt-3 h-1 overflow-hidden bg-[#c9c7bc]"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#c54b32] transition-[width] duration-300"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
