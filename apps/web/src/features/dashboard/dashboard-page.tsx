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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
        <Card className="bg-surface-container-lowest border-0 shadow-[0_20px_50px_rgba(5,150,105,0.05)] group hover:bg-surface-container-low transition-all">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="bg-tertiary-container/10 text-tertiary-container hover:bg-tertiary-container/20 border-none font-bold">
                +12% vs ayer
              </Badge>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Total Citas Hoy
              </p>
              <h3 className="text-4xl font-extrabold text-on-surface mt-1">42</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-0 shadow-[0_20px_50px_rgba(5,150,105,0.05)] group hover:bg-surface-container-low transition-all">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl bg-tertiary-container/10 text-tertiary-container">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold">
                Optimizado
              </Badge>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Tasa de Conversión IA
              </p>
              <h3 className="text-4xl font-extrabold text-on-surface mt-1">89.4%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-0 shadow-[0_20px_50px_rgba(5,150,105,0.05)] group hover:bg-surface-container-low transition-all">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl bg-secondary-container/20 text-secondary">
                <Building2 className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="bg-outline-variant/20 text-on-surface-variant hover:bg-outline-variant/30 border-none font-bold">
                3 Ubicaciones
              </Badge>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Consultorios Activos
              </p>
              <h3 className="text-4xl font-extrabold text-on-surface mt-1">08</h3>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table (Left - 2/3 Width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-on-surface">Actividad Reciente</h3>
            <Button variant="link" className="text-primary font-semibold p-0 h-auto">
              Ver Todo el Historial
            </Button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-x-auto shadow-[0_20px_50px_rgba(5,150,105,0.03)] border border-outline-variant/5">
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
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-fixed text-primary font-bold text-xs">SM</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-on-surface">Sarah Mitchell</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-tertiary-container/10 text-tertiary-container border-none font-bold">
                      Gestionado por IA
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 2 min</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-secondary-container text-secondary font-bold text-xs">JR</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-on-surface">James Rodriguez</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-secondary-container/30 text-on-secondary-fixed-variant border-none font-bold">
                      En Consulta
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 14 min</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-fixed text-primary font-bold text-xs">EL</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-on-surface">Elena Laine</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-tertiary-container/10 text-tertiary-container border-none font-bold">
                      Reserva Confirmada
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 28 min</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-error-container/20 text-error font-bold text-xs">TB</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-on-surface">Thomas Burke</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-error-container text-on-error-container border-none font-bold">
                      Acción Requerida
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">hace 1 hora</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
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
            <Card className="bg-surface-container-lowest border-0 rounded-[10px] h-full">
              <CardContent className="p-6 flex flex-col gap-6">
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
                
                <Button variant="secondary" className="w-full bg-surface-container-low text-primary hover:bg-primary/5 hover:text-primary mt-2">
                  Abrir Monitor de Agentes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Small Quick Tip Card */}
          <Card className="bg-primary/5 border-0 border-l-4 border-l-primary rounded-xl shadow-none">
            <CardContent className="p-5">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-bold text-on-surface">Información Clínica</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                    La IA ha identificado un aumento del 15% en las consultas de fin de semana. Considere ajustar la sensibilidad del triaje automático.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
