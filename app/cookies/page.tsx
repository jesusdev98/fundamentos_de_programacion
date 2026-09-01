import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Información sobre cookies y solicitudes técnicas en Fundamentos de la Programación.",
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies" description="La plataforma no instala cookies propias de analítica, publicidad o seguimiento.">
      <LegalSection title="Uso actual de cookies">
        <p>Este proyecto no instala cookies propias para analítica, publicidad, personalización, seguimiento ni almacenamiento del progreso. Tampoco usa almacenamiento local o de sesión para esas finalidades.</p>
        <p>Al no activar tecnologías propias que requieran consentimiento, el sitio no muestra un banner de cookies. Un banner sin una elección real añadiría fricción sin aportar control efectivo.</p>
      </LegalSection>
      <LegalSection title="Solicitudes técnicas y terceros">
        <p>Una solicitud HTTP necesaria para cargar una página o un archivo no es por sí misma una cookie. Vercel entrega el sitio y puede gestionar registros o mecanismos técnicos de su infraestructura conforme a sus propias condiciones.</p>
        <p>jsDelivr sólo recibe solicitudes desde esta plataforma cuando ejecutas una práctica de Python y el navegador necesita descargar Pyodide. Esas solicitudes al CDN no implican que este proyecto cree una cookie propia, aunque los servicios de terceros conservan el control de sus sistemas.</p>
      </LegalSection>
      <LegalSection title="Cambios futuros">
        <p>Antes de incorporar analítica, publicidad, seguimiento u otra tecnología que requiera información adicional o consentimiento, se actualizará esta página y se implementarán los controles necesarios.</p>
        <p>Para consultas puedes escribir a <a className="text-link" href="mailto:jesusdevcontact@gmail.com">jesusdevcontact@gmail.com</a>.</p>
      </LegalSection>
    </LegalPage>
  );
}
