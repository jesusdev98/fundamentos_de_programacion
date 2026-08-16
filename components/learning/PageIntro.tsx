type PageIntroProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="border-b border-slate-200 bg-[#eef4eb]">
      <div className="page-container py-12 sm:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title mt-3">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          {description}
        </p>
      </div>
    </header>
  );
}
