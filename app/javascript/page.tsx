import type { Metadata } from "next";
import { CurriculumOverview } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";

export const metadata: Metadata = { title: "Aprender JavaScript" };
export default function JavaScriptPage() {
  return <CurriculumOverview curriculum={curricula.javascript} />;
}
