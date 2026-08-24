import type { Exercise } from "@/types/learning";
import { SandboxPlayground } from "./SandboxPlayground";

export function JavaScriptPlayground({ exercise, onCorrect }: { readonly exercise: Exercise; readonly onCorrect: () => void }) {
  return <SandboxPlayground exercise={exercise} onCorrect={onCorrect} language="JavaScript" note="Ejecuta el núcleo de JavaScript dentro de un Worker aislado. No admite DOM, red, import ni export. El cuerpo es async, por lo que acepta Promises y await, pero no equivale exactamente a un script global." />;
}
