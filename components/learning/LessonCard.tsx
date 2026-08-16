import type { Lesson } from "@/types/learning";
import Link from "next/link";
import { SourceLinks } from "@/components/sources/SourceLinks";
import { CodeBlock } from "./CodeBlock";

export function LessonCard({
  lesson,
  number,
  level,
}: {
  readonly lesson: Lesson;
  readonly number: number;
  readonly level: "facil" | "medio";
}) {
  return (
    <article
      id={lesson.id}
      className="scroll-mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#172033] font-mono text-sm font-black text-white">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {lesson.title}
        </h2>
      </div>
      <div className="mt-6 space-y-4 text-base leading-8 text-slate-700">
        {lesson.explanation.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {lesson.examples.map((example) => (
          <CodeBlock key={example.code} {...example} />
        ))}
      </div>
      <div className="mt-6 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-5">
        <h3 className="font-black text-slate-950">Puntos importantes</h3>
        <ul className="mt-3 space-y-2 text-slate-700">
          {lesson.keyPoints.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="font-black text-[#bd3f1d]" aria-hidden="true">
                •
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      {lesson.exerciseId ? <Link className="secondary-button mt-6" href={`/javascript/${level}/practica#${lesson.exerciseId}`}>Practicar este concepto</Link> : null}
      <SourceLinks sourceIds={lesson.sourceIds} />
    </article>
  );
}
