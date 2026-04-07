import { Link } from 'react-router-dom';
import { ActivitySquare, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SECTIONS = [
  {
    title: '1. Aceptación de los Términos',
    content: `Al acceder y utilizar la plataforma VitalAgent, usted acepta quedar vinculado por estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio. El uso continuado de la plataforma tras cualquier modificación a estos términos constituye su aceptación de los nuevos términos.`,
  },
  {
    title: '2. Descripción del Servicio',
    content: `VitalAgent es una plataforma de automatización médica que facilita la gestión de citas, el seguimiento de pacientes y la coordinación del personal clínico. El servicio se proporciona "tal cual" y puede estar sujeto a interrupciones para mantenimiento o actualizaciones. Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del servicio en cualquier momento.`,
  },
  {
    title: '3. Privacidad y Datos del Paciente',
    content: `El tratamiento de datos de pacientes dentro de VitalAgent se rige por las regulaciones de protección de datos aplicables, incluyendo el RGPD para usuarios en la Unión Europea y la HIPAA para usuarios en los Estados Unidos. La clínica es el responsable del tratamiento de los datos de sus pacientes. VitalAgent actúa como encargado del tratamiento y se compromete a implementar las medidas técnicas y organizativas adecuadas para garantizar la seguridad de los datos.`,
  },
  {
    title: '4. Responsabilidades del Usuario',
    content: `Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta. Acepta notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta. VitalAgent no será responsable de las pérdidas causadas por el uso no autorizado de su cuenta si no se tomaron las precauciones razonables para proteger sus credenciales.`,
  },
  {
    title: '5. Propiedad Intelectual',
    content: `Todos los derechos de propiedad intelectual sobre la plataforma VitalAgent, incluyendo, entre otros, el software, los algoritmos de IA, los diseños, los textos y los gráficos, son propiedad exclusiva de VitalAgent o sus licenciadores. El uso del servicio no le otorga ningún derecho sobre dicha propiedad intelectual más allá del acceso limitado necesario para utilizar el servicio según lo establecido en estos términos.`,
  },
  {
    title: '6. Limitación de Responsabilidad',
    content: `En la máxima medida permitida por la ley aplicable, VitalAgent no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, ni de ninguna pérdida de beneficios o ingresos, ya sea incurrida directa o indirectamente, ni de ninguna pérdida de datos, fondo de comercio u otras pérdidas intangibles que resulten del uso del servicio.`,
  },
  {
    title: '7. Modificaciones y Contacto',
    content: `Nos reservamos el derecho de modificar estos términos en cualquier momento. Le notificaremos cualquier cambio significativo mediante un aviso prominente en nuestra plataforma o por correo electrónico. Para cualquier consulta sobre estos Términos de Servicio, puede contactarnos en: legal@vitalagent.io`,
  },
];

export function TermsPage() {
  return (
    <main className="min-h-screen bg-surface py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-4">
            <ActivitySquare className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Términos de Servicio</h1>
          <p className="text-on-surface-variant text-sm mt-2">
            Última actualización: Octubre 2024 · VitalAgent — Automatización Médica
          </p>
        </div>

        {/* Content */}
        <div className="bg-surface-container-lowest rounded-3xl p-10 border border-outline-variant/10 space-y-8">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Por favor, lea atentamente estos Términos de Servicio antes de utilizar VitalAgent. Al acceder a nuestra plataforma, usted confirma que ha leído, entendido y acepta estar sujeto a estos términos.
          </p>

          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-base font-bold text-on-surface">{section.title}</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="border-t border-outline-variant/10 pt-6">
            <p className="text-xs text-on-surface-variant/60 text-center">
              © 2024 VitalAgent. Todos los derechos reservados. · legal@vitalagent.io
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 font-semibold">
            <Link to="/login">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Volver al Login
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
