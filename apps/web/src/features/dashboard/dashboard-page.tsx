import { 
  CalendarCheck, 
  TrendingUp, 
  Building2, 
  MoreHorizontal, 
  MessageSquare, 
  Send, 
  FileText, 
  Lightbulb 
} from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Dashboard Header Section */}
      <section className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">
          Vista General del Panel
        </h2>
        <p className="text-on-surface-variant text-lg">
          Inteligencia clínica en tiempo real y coordinación automatizada.
        </p>
      </section>

      {/* Top Row: Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] flex flex-col gap-4 group hover:bg-surface-container-low transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-tertiary-container/10 text-tertiary-container rounded-full">
              +12% vs ayer
            </span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Total Citas Hoy
            </p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">42</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] flex flex-col gap-4 group hover:bg-surface-container-low transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-tertiary-container/10 text-tertiary-container">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
              Optimizado
            </span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Tasa de Conversión IA
            </p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">89.4%</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] flex flex-col gap-4 group hover:bg-surface-container-low transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-secondary-container/20 text-secondary">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-outline-variant/20 text-on-surface-variant rounded-full">
              3 Ubicaciones
            </span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Consultorios Activos
            </p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">08</h3>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table (Left - 2/3 Width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-on-surface">Actividad Reciente</h3>
            <button className="text-sm font-semibold text-primary hover:underline transition-all">
              Ver Todo el Historial
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-x-auto shadow-[0_20px_50px_rgba(5,150,105,0.03)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-none">
                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Nombre del Paciente
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Hora
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">
                        SM
                      </div>
                      <span className="text-sm font-medium text-on-surface">Sarah Mitchell</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container text-[11px] font-bold">
                      Gestionado por IA
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 2 min</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:opacity-70 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-xs">
                        JR
                      </div>
                      <span className="text-sm font-medium text-on-surface">James Rodriguez</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-secondary-container/30 text-on-secondary-fixed-variant text-[11px] font-bold">
                      En Consulta
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 14 min</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:opacity-70 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">
                        EL
                      </div>
                      <span className="text-sm font-medium text-on-surface">Elena Laine</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container text-[11px] font-bold">
                      Reserva Confirmada
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 28 min</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:opacity-70 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center text-error font-bold text-xs">
                        TB
                      </div>
                      <span className="text-sm font-medium text-on-surface">Thomas Burke</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                      Acción Requerida
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 1 hora</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:opacity-70 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Live AI Pulse & Information Panel (Right - 1/3 Width) */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold tracking-tight text-on-surface">Pulso de IA en Vivo</h3>
          
          <div className="bg-linear-to-br from-primary to-primary-container p-1 rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.15)]">
            <div className="bg-surface-container-lowest rounded-[10px] p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-tertiary-container rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-on-surface">Sistema Óptimo</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">99.9% ACTIVIDAD</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Carga de Procesamiento</span>
                    <span className="text-primary">24%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="w-[24%] h-full bg-primary rounded-full"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Eficiencia de Memoria</span>
                    <span className="text-tertiary-container">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-tertiary-container rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4 mt-2">
                <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-4">
                  Hilos Activos
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Análisis de Consultas</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant uppercase">Activo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Send className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Agenda Inteligente</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant uppercase">Activo</span>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-outline" />
                      <span className="text-xs font-medium">Admisión de Pacientes</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant uppercase">Inactivo</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-2.5 bg-surface-container-low text-primary text-xs font-bold rounded-lg hover:bg-primary/5 transition-all">
                Abrir Monitor de Agentes
              </button>
            </div>
          </div>

          {/* Small Quick Tip Card */}
          <div className="bg-primary/5 p-5 rounded-xl border-l-4 border-primary">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-bold text-on-surface">Información Clínica</p>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  La IA ha identificado un aumento del 15% en las consultas de fin de semana. Considere ajustar la sensibilidad del triaje automático.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
