import type { Metadata } from "next";
import { ComingSoonHub } from "@/components/languages/ComingSoonHub";

export const metadata: Metadata = { title: "Python - Próximamente" };

export default function PythonPage() {
  return <ComingSoonHub languageId="python" />;
}
