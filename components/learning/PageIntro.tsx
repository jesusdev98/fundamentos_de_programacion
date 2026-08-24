type PageIntroProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="editorial-hero">
      <div className="page-container py-10 sm:py-14">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title mt-3">{title}</h1>
        <p className="lede mt-5">
          {description}
        </p>
      </div>
    </header>
  );
}
