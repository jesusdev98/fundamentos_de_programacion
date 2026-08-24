import type { Metadata } from "next";
import { CurriculumOverview } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";

export const metadata: Metadata = { title: "Aprende TypeScript" };

export default function TypeScriptPage() {
  return <CurriculumOverview curriculum={curricula.typescript} />;
}
