import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Titularidad, finalidad educativa y condiciones de uso de Fundamentos de la Programación.",
};

export default function LegalNoticePage() {
  return (
    <LegalPage title="Aviso legal" description="Información sobre la titularidad, la finalidad y el uso responsable de esta plataforma educativa.">
      <LegalSection title="Titularidad y contacto">
        <p>Fundamentos de la Programación es un proyecto personal de Jesús Martínez Escobar.</p>
        <p>Para consultas sobre el sitio o sus contenidos puedes escribir a <a className="text-link" href="mailto:jesusdevcontact@gmail.com">jesusdevcontact@gmail.com</a>.</p>
      </LegalSection>
      <LegalSection title="Finalidad y contenido">
        <p>La plataforma tiene una finalidad exclusivamente educativa e informativa. Sus lecciones, ejercicios, preguntas, explicaciones y ejemplos son contenido original preparado para este proyecto.</p>
        <p>El material facilita el aprendizaje, pero no sustituye formación reglada, asesoramiento profesional ni la consulta de la documentación oficial aplicable a cada tecnología.</p>
      </LegalSection>
      <LegalSection title="Marcas, referencias y enlaces externos">
        <p>Los nombres, marcas y logotipos citados pertenecen a sus respectivos titulares. Este proyecto es independiente y no está afiliado, patrocinado, aprobado ni respaldado por las organizaciones o proyectos enlazados.</p>
        <p>Los enlaces externos se ofrecen para contrastar conceptos y ampliar información. Su disponibilidad, contenido y condiciones dependen de terceros y pueden cambiar sin intervención de esta plataforma.</p>
      </LegalSection>
      <LegalSection title="Disponibilidad y responsabilidad">
        <p>Se procura mantener información correcta y una experiencia funcional, pero no se garantiza que el contenido esté siempre completo, actualizado o libre de errores, ni que el servicio permanezca disponible de forma ininterrumpida.</p>
        <p>El uso de los ejemplos y entornos de práctica queda bajo responsabilidad de quien los utiliza. Dentro de los límites permitidos por la normativa aplicable, el titular no responde por decisiones tomadas únicamente a partir del contenido, por interrupciones técnicas ni por servicios de terceros.</p>
      </LegalSection>
      <LegalSection title="Cambios">
        <p>El contenido, la funcionalidad y este aviso pueden actualizarse para reflejar mejoras técnicas, editoriales o cambios en el funcionamiento real del proyecto.</p>
      </LegalSection>
    </LegalPage>
  );
}
