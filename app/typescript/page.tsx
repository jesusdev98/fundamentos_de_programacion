import type { Metadata } from "next";
import { ComingSoonHub } from "@/components/languages/ComingSoonHub";

export const metadata: Metadata = { title: "TypeScript - Próximamente" };

export default function TypeScriptPage() {
  return <ComingSoonHub languageId="typescript" />;
}
