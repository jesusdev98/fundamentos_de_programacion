import type { ReactNode } from "react";
import { PageIntro } from "@/components/learning/PageIntro";

export function LegalPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <main id="contenido-principal" tabIndex={-1}>
      <PageIntro eyebrow="Transparencia" title={title} description={description} />
      <div className="legal-copy page-container max-w-4xl space-y-8 py-10 sm:py-14">
        {children}
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="workspace-card p-5 sm:p-7">
      <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-7 text-[#626862] sm:text-base">{children}</div>
    </section>
  );
}
