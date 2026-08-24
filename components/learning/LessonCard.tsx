import type { Lesson } from "@/types/learning";
import Link from "next/link";
import { SourceLinks } from "@/components/sources/SourceLinks";
import { CodeBlock } from "./CodeBlock";

export function LessonCard({
  lesson,
  number,
  basePath,
}: {
  readonly lesson: Lesson;
  readonly number: number;
  readonly basePath: string;
}) {
  return (
    <article
      id={lesson.id}
      className="workspace-card min-w-0 scroll-mt-6 p-5 sm:p-7"
    >
      <div className="flex items-start gap-4">
        <span className="lesson-number">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="min-w-0 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {lesson.title}
        </h2>
      </div>
      <div className="mt-6 space-y-4 text-base leading-8 text-[#343b37]">
        {lesson.explanation.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {lesson.examples.map((example) => (
          <CodeBlock key={example.code} {...example} />
        ))}
      </div>
      <div className="callout mt-6 p-5">
        <h3 className="font-extrabold">Puntos importantes</h3>
        <ul className="mt-3 space-y-2 text-[#343b37]">
          {lesson.keyPoints.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="font-black text-[#963622]" aria-hidden="true">
                •
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      {lesson.exerciseId ? <Link className="secondary-button mt-6" href={`${basePath}/practica#${lesson.exerciseId}`}>Practicar este concepto</Link> : null}
      <SourceLinks sourceIds={lesson.sourceIds} />
    </article>
  );
}
