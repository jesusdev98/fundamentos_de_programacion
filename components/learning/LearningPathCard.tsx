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
    <article className="workspace-card flex min-h-72 flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow">{eyebrow}</p>
        <span
          className="font-mono text-3xl font-bold text-[#c9c7bc]"
          aria-hidden="true"
        >
          0{index}
        </span>
      </div>
      <h3 className="mt-8 text-2xl font-extrabold tracking-tight">
        {title}
      </h3>
      <p className="mt-3 flex-1 leading-7 text-[#626862]">{description}</p>
      <Link
        className="text-link mt-6 inline-flex min-h-11 items-center"
        href={href}
      >
        {linkLabel} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
