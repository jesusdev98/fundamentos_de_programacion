import type { Metadata } from "next";
import { CurriculumOverview } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";

export const metadata: Metadata = { title: "Aprender Python" };

export default function PythonPage() {
  return <CurriculumOverview curriculum={curricula.python} />;
}
