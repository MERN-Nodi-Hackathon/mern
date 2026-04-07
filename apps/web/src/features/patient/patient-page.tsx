import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  UserPlus,
  Filter,
  Mail,
  PhoneCall,
  Edit,
  Eye,
  Archive,
  ChevronLeft,
  ChevronRight,
  History
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';

const STATS = [
  { icon: Users, iconColorClass: 'bg-surface-container text-on-surface-variant', label: 'Total', value: '1,284', sub: 'Pacientes registrados' },
  { icon: CheckCircle2, iconColorClass: 'bg-emerald-50 text-emerald-600', label: 'Confirmados', value: '842', sub: 'Para esta semana', valueClass: 'text-emerald-600' },
  { icon: Clock, iconColorClass: 'bg-amber-50 text-amber-600', label: 'Pendientes', value: '56', sub: 'Requieren atención', valueClass: 'text-amber-600' },
  { icon: Sparkles, iconColorClass: 'bg-emerald-50 text-primary', label: 'Nuevos', value: '12', sub: 'Este mes', valueClass: 'text-primary' },
];

const PATIENTS_DATA = [
  {
    id: '#VA-2024-001',
    name: 'Elena Rodriguez',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtZVJE7DU6xEzrMTBSXN2gf1uBe6xKIWoq8tIvJT9BMzEJnolAIAsixesD8ZLhZ2hbAMPf8DTi7-z4KrJseBdNs9D2yra6cFHXGDrSAT4oMVAwDFmZsSiijfeBzhpXO8Y613u7F77qATNqRkkPcOKP860PCYSmoXz-z3vBlN0aOrlrXlMPaq4FY6gkT9WTo5Tay6RsLhT0fd5NFNb8bfHGKo-NvfWr1y--_eGgUY7oAX2hD1hojN-RmnVWMMZiQuQaJvPXMsJOVdcQ',
    age: '42 años',
    lastVisit: { date: '12 Oct, 2023', reason: 'Chequeo General' },
    nextVisit: { date: '24 Mar, 09:00', status: 'Confirmada', color: 'emerald' },
  },
  {
    id: '#VA-2024-042',
    name: 'Carlos Méndez',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoiIqCSMELTCYZCC5x9pvd2BuIfdJtHtOlW-BS96E2Qn6fCqxMYpRBnfqvxGh_MilPOYliDyA1AF48wj89ABVQQyxNfADQHroWquZdQs9bIOaBrwspEFiRJMnQXxMS8Tz6Qurb4g2VFFL7FpABaqdIXGFHNHpHM6pexevqN3ROA_fiLIMkA2doUFL9R0ECtV1MW6FEo_tnYcY4uNPrnum9G6-Qkpo1B5B5FEl1NMwj_GNAL6WNNfjdDbVVHL8OGrNN2vDnsCAmB4ta',
    age: '68 años',
    lastVisit: { date: '05 Feb, 2024', reason: 'Post-operatorio' },
    nextVisit: { date: '28 Mar, 11:30', status: 'Pendiente', color: 'amber' },
  },
  {
    id: '#VA-2024-089',
    name: 'Sofía Morales',
    photoUrl: '',
    age: '29 años',
    lastVisit: { date: 'Sin visitas previas', reason: '' },
    nextVisit: { date: 'Hoy, 16:45', status: 'Nuevo ingreso', color: 'primary' },
  },
  {
    id: '#VA-2023-956',
    name: 'Javier Ortiz',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgiuLH_kqMnMAm-hjr_-rOtNxW5iEOVyhtUgJ6Pmspl3LybqLQnUnEsGHcXGZZ48AGTxU_FJ0_AQKlnEKOXM6eQAQKvmZCni4Hploa62g27RZ1NCEztbe5Bm63K6fspsOdRPDSUDA7VLViCl0Ig203pyixulI-SIWPVt_CuToCS_fNWxfDRwjq1F4BciVMOlq68eUqSGYInJlaSWgV_Q3s0zhCM439sXPTbjOcqeiHe_pskPFVETtl9HwMkBxehl_B-hhonY2_i8Zs',
    age: '35 años',
    lastVisit: { date: '20 Feb, 2024', reason: 'Revisión RM' },
    nextVisit: { date: 'No programada', status: '', color: 'none' },
  },
];

const NEXT_VISIT_STYLES: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  primary: 'bg-primary/5 text-primary',
};

export function PatientPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto min-h-screen">
      <PageHeader
        title="Directorio de Pacientes"
        description="Gestione el historial clínico y la agenda de sus pacientes."
        action={
          <Button className="bg-linear-to-br from-primary to-primary-container text-white px-6 py-6 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-base">
            <UserPlus className="w-5 h-5" />
            Nuevo Paciente
          </Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            iconColorClass={s.iconColorClass}
            label={s.label}
            value={s.value}
            badge={<p className="text-xs text-on-surface-variant font-medium">{s.sub}</p>}
          />
        ))}
      </div>

      {/* Patient Table */}
      <Card className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg text-on-surface">Listado Maestro</h3>
            <div className="flex gap-2">
              <Badge variant="secondary" className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-semibold border-0">Todos</Badge>
              <Badge variant="outline" className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-low rounded-full text-xs font-semibold cursor-pointer border-0">Crónicos</Badge>
              <Badge variant="outline" className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-low rounded-full text-xs font-semibold cursor-pointer border-0">Urgentes</Badge>
            </div>
          </div>
          <Button variant="ghost" className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary hover:bg-primary/5">
            <Filter className="w-5 h-5" />
            Filtros Avanzados
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                {['Paciente', 'Edad', 'Última Cita', 'Próxima Cita', 'Contacto', 'Acciones'].map((h, i) => (
                  <th key={h} className={`${i === 5 ? 'px-8 text-right' : i === 0 ? 'px-8' : 'px-6'} py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {PATIENTS_DATA.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-lowest/60 bg-surface-container-lowest transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border border-outline-variant/10">
                        {p.photoUrl
                          ? <AvatarImage src={p.photoUrl} alt={p.name} />
                          : <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">{p.name.substring(0, 2)}</AvatarFallback>
                        }
                      </Avatar>
                      <div>
                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-xs text-on-surface-variant/60 font-mono">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-on-surface-variant">{p.age}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className={`text-sm font-medium ${p.lastVisit.reason ? 'text-on-surface' : 'italic text-on-surface-variant/50'}`}>{p.lastVisit.date}</p>
                    {p.lastVisit.reason && <p className="text-[10px] text-on-surface-variant/70">{p.lastVisit.reason}</p>}
                  </td>
                  <td className="px-6 py-5">
                    {p.nextVisit.status ? (
                      <div className={`px-3 py-1 rounded-lg inline-flex flex-col ${NEXT_VISIT_STYLES[p.nextVisit.color] ?? ''}`}>
                        <p className="text-xs font-bold">{p.nextVisit.date}</p>
                        <p className="text-[9px] uppercase tracking-tighter">{p.nextVisit.status}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant/50 italic">{p.nextVisit.date}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-surface-container-low text-on-surface-variant hover:text-primary rounded-lg">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-surface-container-low text-on-surface-variant hover:text-primary rounded-lg">
                        <PhoneCall className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-primary" title="Editar historial">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-emerald-600" title="Ver perfil completo">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-error" title="Archivar">
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant/70">Mostrando 1 a 10 de 1,284 pacientes</p>
          <div className="flex gap-1 items-center">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant/60 hover:bg-surface-container-lowest">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {[1, 2, 3].map((n) => (
              <Button key={n} variant="outline" size="icon" className={`w-8 h-8 rounded-lg text-xs ${n === 1 ? 'bg-primary text-white border-0 shadow-sm font-bold' : 'border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-lowest'}`}>
                {n}
              </Button>
            ))}
            <span className="px-2 self-center text-on-surface-variant/50 text-xs">...</span>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant/60 hover:bg-surface-container-lowest">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-low/40 rounded-3xl p-8 border border-outline-variant/5">
          <h4 className="font-bold text-on-surface mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Actividad Reciente del Directorio
          </h4>
          <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
            {[
              { color: 'emerald-500', title: 'Nuevo paciente registrado', body: 'Elena Rodriguez ha completado su registro digital vía VitalAgent AI.', time: 'Hace 12 minutos' },
              { color: 'primary', title: 'Historial actualizado', body: 'Se han adjuntado nuevos resultados de laboratorio al perfil de Carlos Méndez.', time: 'Hace 1 hora' },
            ].map((event) => (
              <div key={event.title} className="relative pl-10">
                <div className={`absolute left-0 top-1.5 w-6 h-6 bg-surface-container-lowest border-2 border-${event.color} rounded-full flex items-center justify-center z-10`}>
                  <div className={`w-2 h-2 bg-${event.color} rounded-full`} />
                </div>
                <p className="text-sm font-bold text-on-surface">{event.title}</p>
                <p className="text-xs text-on-surface-variant">{event.body}</p>
                <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase font-semibold">{event.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-[#191c1e] to-on-primary-fixed rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-primary-fixed-dim border-b border-white/10 pb-2 mb-2">Distribución Mensual</h4>
            <p className="text-lg font-bold leading-tight">Crecimiento constante de pacientes este trimestre.</p>
          </div>
          <div className="flex items-end gap-2 mt-8 h-32">
            {[40, 60, 55, 85, 70].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-lg transition-all ${i === 3 ? 'bg-primary shadow-[0_0_15px_rgba(5,150,105,0.4)] hover:bg-primary-fixed-dim' : 'bg-white/10 hover:bg-white/20'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs font-bold border-t border-white/10 pt-4">
              <span>Eficiencia de IA</span>
              <span className="text-primary-fixed-dim bg-primary/20 px-2 py-1 rounded">+24%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
