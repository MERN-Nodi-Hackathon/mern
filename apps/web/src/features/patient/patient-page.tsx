import { useState, useMemo } from 'react';
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
  Search,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import patientData from './patient-data.json';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Category = 'all' | 'general' | 'chronic' | 'urgent';

interface Patient {
  id: string;
  name: string;
  photoUrl: string;
  age: number;
  category: string;
  lastVisit: { date: string; reason: string };
  nextVisit: { date: string; status: string };
  email: string;
  phone: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

const STAT_ICONS = {
  total:     { icon: Users,        colorClass: 'bg-surface-container text-on-surface-variant' },
  confirmed: { icon: CheckCircle2, colorClass: 'bg-emerald-50 text-emerald-600' },
  pending:   { icon: Clock,        colorClass: 'bg-amber-50 text-amber-600' },
  new:       { icon: Sparkles,     colorClass: 'bg-emerald-50 text-primary' },
};

const CATEGORY_FILTERS: { value: Category; label: string }[] = [
  { value: 'all',     label: 'Todos' },
  { value: 'general', label: 'General' },
  { value: 'chronic', label: 'Crónicos' },
  { value: 'urgent',  label: 'Urgentes' },
];

const STATUS_STYLES = {
  confirmed: { badge: 'bg-emerald-50 text-emerald-700', label: 'Confirmada' },
  pending:   { badge: 'bg-amber-50 text-amber-700',     label: 'Pendiente' },
  new:       { badge: 'bg-primary/10 text-primary',     label: 'Nuevo ingreso' },
  none:      { badge: '',                                label: '' },
} as const;

type StatusKey = keyof typeof STATUS_STYLES;


// ─── Sub-componente: Fila de paciente ─────────────────────────────────────────

function PatientRow({ patient }: { patient: Patient }) {
  const statusKey   = (patient.nextVisit.status as StatusKey) || 'none';
  const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.none;
  const initials    = patient.name.substring(0, 2).toUpperCase();

  return (
    <tr className="hover:bg-surface-container-lowest/60 bg-surface-container-lowest transition-colors group">
      {/* Paciente */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-outline-variant/10 shrink-0">
            {patient.photoUrl
              ? <AvatarImage src={patient.photoUrl} alt={patient.name} />
              : <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
            }
          </Avatar>
          <div>
            <p className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm">
              {patient.name}
            </p>
            <p className="text-[10px] text-on-surface-variant/60 font-mono">#{patient.id}</p>
          </div>
        </div>
      </td>

      {/* Edad */}
      <td className="px-4 py-4">
        <p className="text-sm text-on-surface-variant">{patient.age} años</p>
      </td>

      {/* Última cita */}
      <td className="px-4 py-4">
        {patient.lastVisit.date
          ? <>
              <p className="text-sm font-medium text-on-surface">{patient.lastVisit.date}</p>
              {patient.lastVisit.reason && (
                <p className="text-[10px] text-on-surface-variant/70">{patient.lastVisit.reason}</p>
              )}
            </>
          : <p className="text-xs italic text-on-surface-variant/50">Sin visitas previas</p>
        }
      </td>

      {/* Próxima cita */}
      <td className="px-4 py-4">
        {patient.nextVisit.status && patient.nextVisit.status !== 'none'
          ? (
            <div className={`inline-flex flex-col px-3 py-1 rounded-lg ${statusStyle.badge}`}>
              <p className="text-xs font-bold">{patient.nextVisit.date}</p>
              <p className="text-[9px] uppercase tracking-tighter">{statusStyle.label}</p>
            </div>
          )
          : <p className="text-xs italic text-on-surface-variant/40">No programada</p>
        }
      </td>

      {/* Contacto */}
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-surface-container-low text-on-surface-variant hover:text-primary rounded-lg"
            title={patient.email}
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-surface-container-low text-on-surface-variant hover:text-primary rounded-lg"
            title={patient.phone}
          >
            <PhoneCall className="w-4 h-4" />
          </Button>
        </div>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-primary" title="Editar historial">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-emerald-600" title="Ver perfil completo">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-red-500" title="Archivar">
            <Archive className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function PatientPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [currentPage, setCurrentPage]       = useState(1);

  const allPatients = patientData.patients as Patient[];

  // Filtrado: por categoría + búsqueda por nombre o ID
  const filteredPatients = useMemo(() => {
    return allPatients.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [allPatients, activeCategory, searchQuery]);

  // Paginación
  const totalPages  = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));
  const safePage    = Math.min(currentPage, totalPages);
  const paginated   = filteredPatients.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reiniciar página al filtrar
  function handleCategory(cat: Category) {
    setActiveCategory(cat);
    setCurrentPage(1);
  }
  function handleSearch(q: string) {
    setSearchQuery(q);
    setCurrentPage(1);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto min-h-screen">
      <PageHeader
        title="Directorio de Pacientes"
        description="Gestione el historial clínico y la agenda de sus pacientes."
        action={
          <Button className="bg-linear-to-br from-primary to-primary-container text-white px-6 py-5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
            <UserPlus className="w-4 h-4" />
            Nuevo Paciente
          </Button>
        }
      />

      {/* ── Stat Cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {patientData.stats.map((s) => {
          const meta = STAT_ICONS[s.id as keyof typeof STAT_ICONS];
          return (
            <StatCard
              key={s.id}
              icon={meta.icon}
              iconColorClass={meta.colorClass}
              label={s.label}
              value={s.value}
              badge={<p className="text-xs text-on-surface-variant font-medium">{s.sub}</p>}
            />
          );
        })}
      </div>

      {/* ── Tabla de pacientes ────────────────────────────────────────────────── */}
      <Card className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-0 overflow-hidden">

        {/* Cabecera de la tabla: filtros + búsqueda */}
        <div className="px-6 py-5 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-lg text-on-surface">Listado Maestro</h3>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_FILTERS.map(({ value, label }) => {
                const isActive = activeCategory === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleCategory(value)}
                    aria-pressed={isActive}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <Input
                type="text"
                placeholder="Buscar paciente o ID..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-8 h-9 text-sm bg-surface-container-low border-0 rounded-xl w-56 focus-visible:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Button variant="ghost" className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary hover:bg-primary/5 h-9 px-3">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                {['Paciente', 'Edad', 'Última Cita', 'Próxima Cita', 'Contacto', 'Acciones'].map((h, i) => (
                  <th
                    key={h}
                    className={`${i === 0 || i === 5 ? 'px-6' : 'px-4'} ${i === 5 ? 'text-right' : ''} py-3 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginated.length > 0
                ? paginated.map((p) => <PatientRow key={p.id} patient={p} />)
                : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-on-surface-variant/50 italic">
                      No se encontraron pacientes con ese criterio.
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant/70">
            Mostrando {paginated.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(safePage * PAGE_SIZE, filteredPatients.length)} de {filteredPatients.length} pacientes
          </p>
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant/60 hover:bg-surface-container-lowest"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 rounded-lg text-xs ${
                  n === safePage
                    ? 'bg-primary text-white border-0 shadow-sm font-bold'
                    : 'border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-lowest'
                }`}
              >
                {n}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant/60 hover:bg-surface-container-lowest"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
}
