import Link from "next/link";

type Props = {
  readonly index: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly linkLabel: string;
};

export function LearningPathCard({
  index,
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: Props) {
  return (
    <article className="group flex min-h-72 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow">{eyebrow}</p>
        <span
          className="font-mono text-4xl font-black text-slate-200"
          aria-hidden="true"
        >
          0{index}
        </span>
      </div>
      <h3 className="mt-8 text-2xl font-black tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-3 flex-1 leading-7 text-slate-600">{description}</p>
      <Link
        className="mt-6 font-extrabold text-[#bd3f1d] underline-offset-4 hover:underline"
        href={href}
      >
        {linkLabel} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
