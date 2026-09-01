import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Información sobre privacidad y tratamiento técnico de datos en Fundamentos de la Programación.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacidad" description="Qué datos no solicita la plataforma y qué tratamientos técnicos pueden realizar sus proveedores.">
      <LegalSection title="Datos que solicita la plataforma">
        <p>El sitio no ofrece registro, cuentas, formularios ni un backend para guardar datos personales. Tampoco almacena progreso, respuestas, puntuaciones o código introducido en los editores.</p>
        <p>No se han integrado herramientas propias de analítica, publicidad, perfiles de usuario ni seguimiento entre sitios.</p>
      </LegalSection>
      <LegalSection title="Alojamiento en Vercel">
        <p>La plataforma se aloja en Vercel. Al solicitar una página, Vercel puede procesar datos técnicos habituales de conexión, como la dirección IP, la fecha, la ruta solicitada, información del navegador y registros de seguridad o funcionamiento.</p>
        <p>Ese tratamiento depende de la infraestructura y las condiciones de Vercel. La ausencia de analítica añadida por este proyecto no impide que el proveedor mantenga los registros técnicos necesarios para prestar y proteger su servicio.</p>
      </LegalSection>
      <LegalSection title="Ejecución de Python y jsDelivr">
        <p>Pyodide no se descarga al visitar páginas informativas, lecciones o cuestionarios. Sólo cuando pulsas «Ejecutar» en una práctica de Python, el navegador solicita a jsDelivr los archivos fijados de Pyodide 314.0.4.</p>
        <p>En esa solicitud, jsDelivr puede recibir datos técnicos de conexión. La ejecución posterior del código ocurre en un Worker del navegador; la plataforma no lo envía a un backend propio. No podemos ofrecer garantías absolutas sobre el tratamiento realizado por servicios de terceros.</p>
      </LegalSection>
      <LegalSection title="Contacto y cambios">
        <p>Para consultas de privacidad puedes escribir a <a className="text-link" href="mailto:jesusdevcontact@gmail.com">jesusdevcontact@gmail.com</a>. No incluyas secretos, contraseñas ni información innecesaria en el mensaje.</p>
        <p>Esta información se actualizará si cambian los proveedores o se incorporan funciones que impliquen un tratamiento distinto.</p>
      </LegalSection>
    </LegalPage>
  );
}
