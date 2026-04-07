import { useState, useMemo, useEffect } from 'react';
import {
  RotateCw,
  Stethoscope,
  Clock,
  Calendar,
  Zap,
  Bot,
  UserPlus,
  X,
  Filter,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { getMedicalTeam, getStaffShifts, getAISuggestions, getStaffStats } from '@/services/staff.service';
import { StaffMember, StaffShift, AISuggestion, StaffStatus } from '@/types/models';

// ─── Tipos Locales ────────────────────────────────────────────────────────────

// ─── Constantes y Mapeos ──────────────────────────────────────────────────────

const STATUS_CONFIG = {
  available: {
    label: 'Disponible',
    class: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-500/20',
    icon: CheckCircle2
  },
  busy: {
    label: 'En Consulta',
    class: 'bg-primary/10 text-primary',
    ring: 'ring-primary/20',
    icon: Clock
  },
  away: {
    label: 'Fuera de Turno',
    class: 'bg-surface-container-high text-on-surface-variant',
    ring: '',
    icon: AlertCircle
  },
} as const;

const SHIFT_TYPE_CONFIG = {
  morning:   { color: 'bg-emerald-50 text-emerald-600', hover: 'group-hover:text-primary' },
  surgery:   { color: 'bg-amber-50 text-amber-600',     hover: 'group-hover:text-amber-600' },
  specialty: { color: 'bg-blue-50 text-blue-600',      hover: 'group-hover:text-blue-600' },
} as const;

// ─── Sub-componente: Tarjeta de Médico ────────────────────────────────────────

function DoctorCard({ doctor }: { doctor: StaffMember }) {
  const config    = STATUS_CONFIG[doctor.status] || STATUS_CONFIG.away;
  const isInactive = doctor.status === 'away';

  return (
    <Card
      className={`p-6 rounded-3xl border-0 transition-all duration-300 group ${
        isInactive
          ? 'bg-transparent border-dashed border-2 border-outline-variant/20 shadow-none'
          : 'bg-surface-container-lowest shadow-[0_20px_50px_rgba(5,150,105,0.03)] hover:shadow-[0_20px_50px_rgba(5,150,105,0.08)]'
      }`}
    >
      <div className={`flex justify-between items-start mb-5 ${isInactive ? 'opacity-60' : ''}`}>
        <div className="relative">
          <Avatar className={`w-14 h-14 rounded-2xl border-2 border-surface-container-lowest shadow-sm ${config.ring ? `ring-4 ${config.ring}` : ''} ${isInactive ? 'grayscale opacity-70' : ''}`}>
            <AvatarImage src={doctor.photoUrl} className="object-cover" />
            <AvatarFallback className="rounded-2xl bg-surface-container font-bold text-on-surface-variant">{doctor.initials}</AvatarFallback>
          </Avatar>
          {!isInactive && (
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-container-lowest ${doctor.status === 'available' ? 'bg-emerald-500' : 'bg-primary'}`} />
          )}
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${config.class}`}>
          {doctor.statusLabel}
        </span>
      </div>

      <h4 className={`text-base font-bold text-on-surface leading-tight mb-1 ${isInactive ? 'opacity-60' : ''}`}>
        {doctor.name}
      </h4>
      <p className={`text-xs text-on-surface-variant font-medium mb-5 ${isInactive ? 'opacity-60' : ''}`}>
        {doctor.specialty}
      </p>

      <div className={`space-y-2.5 pt-4 border-t border-outline-variant/10 ${isInactive ? 'opacity-60' : ''}`}>
        <div className="flex items-center text-[11px] font-medium text-on-surface-variant">
          <Stethoscope className="w-3.5 h-3.5 mr-2 shrink-0 opacity-60" />
          Consultorio: {doctor.consultorio}
        </div>

        {doctor.status === 'available' && doctor.nextTurno && (
          <div className="flex items-center text-[11px] font-medium text-on-surface-variant">
            <RotateCw className="w-3.5 h-3.5 mr-2 shrink-0 opacity-60" />
            Prox: {doctor.nextTurno}
          </div>
        )}

        {doctor.status === 'busy' && doctor.timeLeft && (
          <div className="flex items-center text-[11px] font-medium text-primary">
            <Clock className="w-3.5 h-3.5 mr-2 shrink-0 opacity-80" />
            Libre en: {doctor.timeLeft}
          </div>
        )}

        {doctor.status === 'away' && (
          <>
            {doctor.returnDate && (
              <div className="flex items-center text-[11px] font-medium text-on-surface-variant/70">
                <Calendar className="w-3.5 h-3.5 mr-2 shrink-0 opacity-60" />
                Vuelve: {doctor.returnDate}
              </div>
            )}
            {doctor.urgentAvailable && (
              <div className="flex items-center text-[11px] font-bold text-emerald-600/80">
                <Zap className="w-3.5 h-3.5 mr-2 shrink-0" />
                Disponible Urgencias
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export function PersonalPage() {
  const [activeFilter, setActiveFilter] = useState<StaffStatus | 'all'>('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [isLoading, setIsLoading]       = useState(true);

  const [personnel, setPersonnel]       = useState<StaffMember[]>([]);
  const [shifts, setShifts]             = useState<StaffShift[]>([]);
  const [suggestions, setSuggestions]   = useState<AISuggestion[]>([]);
  const [stats, setStats]               = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [teamData, shiftsData, suggsData, statsData] = await Promise.all([
        getMedicalTeam(),
        getStaffShifts(),
        getAISuggestions(),
        getStaffStats()
      ]);
      setPersonnel(teamData);
      setShifts(shiftsData);
      setSuggestions(suggsData);
      setStats(statsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredTeam = useMemo(() => {
    return personnel.filter((doc) => {
      const matchFilter = activeFilter === 'all' || doc.status === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || doc.name.toLowerCase().includes(q) || doc.specialty.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [personnel, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto min-h-screen">
      <div className="flex-1 grid grid-cols-12 gap-8">

        {/* ── Columna Izquierda: Grid de Médicos y Turnos ─────────────────────── */}
        <section className="col-span-12 lg:col-span-8 space-y-8">
          <PageHeader
            title="Equipo Clínico"
            description="Supervisión en tiempo real de la disponibilidad del equipo."
            action={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                  <Input
                    placeholder="Buscar médico o especialidad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 h-10 w-64 bg-surface-container-low border-0 rounded-xl text-sm focus-visible:ring-primary/20"
                  />
                </div>
                <Button className="bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all rounded-xl h-10 px-5">
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir
                </Button>
              </div>
            }
          />

          {/* Filtros de estado */}
          <div className="flex items-center gap-2">
            {(['all', 'available', 'busy', 'away'] as (StaffStatus | 'all')[]).map((f) => {
              const isActive = activeFilter === f;
              const labels = { all: 'Todos', available: 'Disponibles', busy: 'En Consulta', away: 'Fuera' };
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>

          {/* Grid de Doctores */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-surface-container-low border-0 rounded-3xl" />
              ))
            ) : filteredTeam.length > 0 ? (
              filteredTeam.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
            ) : (
              <div className="col-span-full py-20 text-center bg-surface-container-low/20 rounded-3xl border-2 border-dashed border-outline-variant/10">
                <p className="text-sm text-on-surface-variant/50 font-medium italic">No se encontraron miembros del equipo</p>
              </div>
            )}
          </div>

          {/* Turnos de la Semana */}
          <div className="bg-surface-container-low/40 rounded-4xl p-8 border border-outline-variant/5">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Turnos Semanales</h3>
                <p className="text-xs text-on-surface-variant/60 mt-1 uppercase font-bold tracking-tighter">Asignación de Guardias</p>
              </div>
              <Button variant="link" className="text-primary font-bold hover:text-primary/80 px-0 h-auto text-sm">
                Ver Gestión Completa
              </Button>
            </div>
            <div className="grid gap-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse bg-surface-container-lowest rounded-2xl border border-outline-variant/5" />
                ))
              ) : (
                shifts.map((shift) => {
                  const config = SHIFT_TYPE_CONFIG[shift.dayType as keyof typeof SHIFT_TYPE_CONFIG] || SHIFT_TYPE_CONFIG.morning;
                  return (
                    <div key={shift.id} className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-all group shadow-sm border border-outline-variant/5">
                      <div className="flex items-center space-x-5">
                        <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center font-black text-sm tracking-wider shadow-sm`}>
                          {shift.dayLabel}
                        </div>
                        <div>
                          <p className={`text-[15px] font-bold text-on-surface ${config.hover} transition-colors`}>{shift.title}</p>
                          <p className="text-[13px] text-on-surface-variant/70 mt-1 font-medium">{shift.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex -space-x-3">
                        {shift.avatars.map((src, i) => (
                          <Avatar key={i} className="w-10 h-10 border-2 border-surface-container-lowest hover:z-20 transition-transform hover:scale-110 shadow-sm">
                            <AvatarImage src={src} className="object-cover" />
                            <AvatarFallback className="bg-surface-container" />
                          </Avatar>
                        ))}
                        {shift.overflow && (
                          <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[11px] font-black text-on-surface-variant z-10 shadow-sm">
                            {shift.overflow}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ── Columna Derecha: Panel IA ───────────────────────────────────────── */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="bg-surface-container-lowest/80 backdrop-blur-3xl p-7 rounded-[40px] border border-primary/10 shadow-[0_30px_60px_rgba(5,150,105,0.08)] sticky top-28">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-on-surface leading-tight">Gestión IA</h4>
                <p className="text-[10px] uppercase font-black text-primary tracking-widest mt-1">
                  {stats?.modelVersion || 'Cargando...'}
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-5 mb-8 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <p className="text-sm text-on-surface/90 leading-relaxed font-medium pl-2 italic">
                "{stats?.agentInsight || 'Analizando eficiencia del equipo...'}"
              </p>
            </div>

            <h5 className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/40 mb-6 px-1">Optimizaciones Sugeridas</h5>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse bg-surface-container-lowest border border-outline-variant/15 rounded-3xl" />
                ))
              ) : (
                suggestions.map((s) => (
                  <div key={s.id} className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/15 shadow-sm hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{s.type}</span>
                    </div>
                    <p className="text-[13px] text-on-surface leading-normal mb-5 font-medium">
                      {s.body.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-black text-primary">{part}</strong> : part)}
                    </p>
                    <div className="flex space-x-2">
                      <Button className="flex-1 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary/90 h-9">
                        {s.actionLabel}
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-xl border-outline-variant/20 text-on-surface-variant hover:bg-red-50 hover:text-red-500 h-9 w-9">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Métricas de Eficiencia */}
            <div className="mt-10 pt-8 border-t border-outline-variant/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-on-surface">Eficiencia de Guardia</span>
                <span className="text-2xl font-black text-primary tracking-tight">{stats?.teamEfficiency || 0}%</span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-primary h-full rounded-full shadow-[0_0_15px_rgba(5,150,105,0.3)] transition-all duration-1000" 
                  style={{ width: `${stats?.teamEfficiency || 0}%` }}
                />
              </div>
              <p className="text-[11px] font-bold text-on-surface-variant/50 mt-5 text-center">
                ↑ {stats?.efficiencyIncrease || 0}% vs. promedio histórico
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
