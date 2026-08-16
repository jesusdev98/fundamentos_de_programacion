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
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap justify-between gap-2 text-sm font-bold text-slate-700">
        <span>
          Pregunta {current} de {total}
        </span>
        <span>{answered} respondidas</span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[#e85d34] transition-[width] duration-300"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
