import { useState, useEffect } from 'react';
import {
  CalendarCheck,
  TrendingUp,
  Building2,
  MoreHorizontal,
  MessageSquare,
  Send,
  FileText,
  Lightbulb,
  Bot
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { getDashboardStats, getRecentActivity, getAIPulse } from '../../services/dashboard.service';
import { DashboardStats, RecentActivity, AIPulseMetric, AIThread } from '@/types/models';

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [pulse, setPulse] = useState<{ metrics: AIPulseMetric[], threads: AIThread[] } | null>(null);
  const [showFullHistory, setShowFullHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [s, a, p] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getAIPulse()
      ]);
      setStats(s);
      setActivity(a);
      setPulse(p);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="h-20 animate-pulse bg-surface-container-low rounded-3xl w-full" />
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 animate-pulse bg-surface-container-low rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-96 animate-pulse bg-surface-container-low rounded-3xl" />
          <div className="h-96 animate-pulse bg-surface-container-low rounded-3xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Vista General del Panel"
        description="Inteligencia clínica en tiempo real y coordinación automatizada."
      />

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={CalendarCheck}
          iconColorClass="bg-primary/10 text-primary"
          label="Total Citas Hoy"
          value={stats?.todayAppointments || 0}
          badge={
            <Badge variant="secondary" className="bg-tertiary-container/10 text-tertiary-container hover:bg-tertiary-container/20 border-none font-bold">
              {stats?.appointmentGrowth}
            </Badge>
          }
        />
        <StatCard
          icon={TrendingUp}
          iconColorClass="bg-tertiary-container/10 text-tertiary-container"
          label="Tasa de Conversión IA"
          value={stats?.aiConversionRate || '0%'}
          badge={
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold">
              Optimizado
            </Badge>
          }
        />
        <StatCard
          icon={Building2}
          iconColorClass="bg-secondary-container/20 text-secondary"
          label="Consultorios Activos"
          value={stats?.activeClinics || 0}
          badge={
            <Badge variant="secondary" className="bg-outline-variant/20 text-on-surface-variant hover:bg-outline-variant/30 border-none font-bold">
              {stats?.locationsCount} Ubicaciones
            </Badge>
          }
        />
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-on-surface">Actividad Reciente</h3>
            <Button 
              variant="link" 
              className="text-primary font-semibold p-0 h-auto"
              onClick={() => setShowFullHistory(true)}
            >
              Ver Todo el Historial
            </Button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-x-auto shadow-[0_20px_50px_rgba(5,150,105,0.03)] border border-outline-variant/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-none">
                  {['Nombre del Paciente', 'Estado', 'Hora', 'Acción'].map((h) => (
                    <th key={h} className="px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {activity.map((row) => (
                  <tr key={row.name} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={`${row.avatarClass} font-bold text-xs`}>
                            {row.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-on-surface">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`${row.badgeClass} border-none font-bold`}>
                        {row.badgeLabel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.time}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Pulse Panel */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold tracking-tight text-on-surface">Pulso de IA en Vivo</h3>

          <div className="bg-linear-to-br from-primary to-primary-container p-1 rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.15)]">
            <Card className="bg-surface-container-lowest border-0 rounded-[10px] h-full">
              <CardContent className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-tertiary-container rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-on-surface">Sistema Óptimo</span>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">99.9% ACTIVIDAD</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Carga de Procesamiento', value: 24, colorClass: 'bg-primary', textClass: 'text-primary' },
                    { label: 'Eficiencia de Memoria', value: 92, colorClass: 'bg-tertiary-container', textClass: 'text-tertiary-container' },
                  ].map((metric) => (
                    <div key={metric.label} className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-on-surface-variant">{metric.label}</span>
                        <span className={metric.textClass}>{metric.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full ${metric.colorClass} rounded-full`} style={{ width: `${metric.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-outline-variant/10 pt-4 mt-2">
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-4">Hilos Activos</p>
                  <div className="space-y-3">
                    {pulse?.threads.map(({ label, active }) => (
                      <div key={label} className={`flex items-center justify-between ${!active ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-3">
                          {/* Use dynamic icon components if mapping is needed, for now just simple icon */}
                          <Bot className={`w-4 h-4 ${active ? 'text-primary' : 'text-outline'}`} />
                          <span className="text-xs font-medium">{label}</span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant uppercase">
                          {active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="secondary" className="w-full bg-surface-container-low text-primary hover:bg-primary/5 hover:text-primary mt-2">
                  Abrir Monitor de Agentes
                </Button>
              </CardContent>
            </Card>
          </div>

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

      {/* Modal de Historial Completo */}
      {showFullHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-surface-container-low border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface">Historial Completo de Actividad</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowFullHistory(false)}
                className="text-on-surface-variant hover:bg-surface-container-highest"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-none">
                    {['Nombre del Paciente', 'Estado', 'Hora', 'Acción'].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {activity.map((row) => (
                    <tr key={row.name} className="hover:bg-surface-container-high transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={`${row.avatarClass} font-bold text-xs`}>
                              {row.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-on-surface">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`${row.badgeClass} border-none font-bold`}>
                          {row.badgeLabel}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{row.time}</td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
