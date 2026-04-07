import { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Download,
  Bot,
  History,
  Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getEvents } from '@/services/calendar.service';
import { CalendarEvent, EventType, FilterType } from '@/types/models';

// ─── Constantes ────────────────────────────────────────────────────────────────

/** Horas laborales mostradas en el grid (12:00 es descanso, se renderiza aparte) */
const WORK_HOURS = [8, 9, 10, 11, 13, 14, 15, 16, 17] as const;

const MONTH_NAMES_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const DAY_NAMES_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'booking', label: 'Reservación' },
  { value: 'ai_booking', label: 'Reservado por IA' },
  { value: 'internal', label: 'Interno' },
  { value: 'blocked', label: 'Bloqueado' },
];

// ─── Helpers de fecha ──────────────────────────────────────────────────────────

/** Devuelve el lunes de la semana a la que pertenece `date` */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day; // Sunday=0 → retrocede 6 días
  d.setDate(d.getDate() + offset);
  return d;
}

/** Devuelve un arreglo de 7 fechas (Lun→Dom) a partir del lunes dado */
function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Formatea una fecha como "YYYY-MM-DD" para usar como clave de lookup */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Genera el label del rango semanal visible (ej. "7 Abr — 13 Abr 2026") */
function getWeekRangeLabel(days: Date[]): string {
  const start = days.at(0)!;
  const end = days.at(6)!;
  const startStr = `${start.getDate()} ${MONTH_NAMES_ES[start.getMonth()]}`;
  const endStr = `${end.getDate()} ${MONTH_NAMES_ES[end.getMonth()]} ${end.getFullYear()}`;
  return `${startStr} — ${endStr}`;
}

// ─── Sub-componente: celda de evento ──────────────────────────────────────────

function EventCell({ event }: { event: CalendarEvent }) {
  if (event.type === 'blocked') {
    return (
      <div className="h-full min-h-20 rounded-lg bg-surface-container-high/60 p-2 flex items-center justify-center">
        <Lock className="w-4 h-4 text-on-surface-variant/40" />
      </div>
    );
  }

  const containerClass: Record<Exclude<EventType, 'blocked'>, string> = {
    booking:
      'bg-primary-container text-white shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-transform',
    ai_booking:
      'bg-primary-container text-white shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-transform',
    internal:
      'bg-primary-fixed text-on-primary-fixed border-l-4 border-primary cursor-pointer hover:opacity-90 transition-opacity',
    confirmed:
      'bg-emerald-500 text-white shadow-sm cursor-pointer hover:scale-[1.02] transition-transform',
  };

  return (
    <div className={`h-full min-h-20 rounded-lg p-3 ${containerClass[event.type as Exclude<EventType, 'blocked'>]}`}>
      <p className="text-[10px] font-bold uppercase opacity-80 mb-1 truncate">{event.label}</p>
      <p className="text-xs font-bold leading-tight truncate">{event.title}</p>
      {event.detail && (
        <p className="text-[10px] mt-1 opacity-90 truncate">{event.detail}</p>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function CalendarPage() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(today));
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getEvents();
      setEvents(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Días visibles de la semana actual
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const weekLabel = useMemo(() => getWeekRangeLabel(weekDays), [weekDays]);
  const isCurrentWeek = useMemo(
    () => toDateKey(weekStart) === toDateKey(getWeekStart(today)),
    [weekStart, today]
  );

  // Mapa de todos los eventos: "YYYY-MM-DD-HH" → CalendarEvent
  const eventsMap = useMemo(() => {
    const map = new Map<string, CalendarEvent>();
    events.forEach((ev) => {
      map.set(`${ev.date}-${ev.hour}`, ev);
    });
    return map;
  }, [events]);

  // Mapa filtrado: sólo los tipos activos
  const filteredEventsMap = useMemo(() => {
    if (activeFilter === 'all') return eventsMap;
    const filtered = new Map<string, CalendarEvent>();
    eventsMap.forEach((event, key) => {
      if (event.type === activeFilter) filtered.set(key, event);
    });
    return filtered;
  }, [eventsMap, activeFilter]);


  // Navegación de semanas
  const goToPrevWeek = () =>
    setWeekStart((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 7);
      return n;
    });
  const goToNextWeek = () =>
    setWeekStart((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 7);
      return n;
    });
  const goToToday = () => setWeekStart(getWeekStart(today));

  const getEvent = (day: Date, hour: number): CalendarEvent | undefined =>
    filteredEventsMap.get(`${toDateKey(day)}-${hour}`);

  const isToday = (day: Date) => toDateKey(day) === toDateKey(today);
  const isWeekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6;

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto">

      {/* ── Encabezado ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Vista General del Horario
          </h2>
          <div className="flex items-center gap-4 mt-3">
            {/* Paginador de semanas */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-on-surface-variant hover:bg-white"
                onClick={goToPrevWeek}
                aria-label="Semana anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="px-4 font-semibold text-on-surface text-sm min-w-48 text-center">
                {weekLabel}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-on-surface-variant hover:bg-white"
                onClick={goToNextWeek}
                aria-label="Semana siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            {/* Botón Hoy — sólo activo si no estamos en la semana actual */}
            <Button
              variant="ghost"
              onClick={goToToday}
              disabled={isCurrentWeek}
              className="font-medium text-primary hover:bg-primary/5 text-sm rounded-xl disabled:opacity-40"
            >
              Hoy
            </Button>
          </div>
        </div>

        {/* Selector de vista (solo Semana funcional) */}
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl self-start md:self-auto">
          <Button
            variant="ghost"
            className="px-5 py-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface rounded-lg"
            title="Vista de día (próximamente)"
          >
            Día
          </Button>
          <Button
            variant="outline"
            className="px-5 py-1.5 text-sm font-bold bg-white text-primary rounded-lg border-none hover:bg-white hover:text-primary shadow-sm h-9"
          >
            Semana
          </Button>
          <Button
            variant="ghost"
            className="px-5 py-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface rounded-lg"
            title="Vista de mes (próximamente)"
          >
            Mes
          </Button>
        </div>
      </div>



      {/* ── Filtros de tipo de evento ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filtrar por tipo de evento">
        {FILTER_OPTIONS.map(({ value, label }) => {
          const isActive = activeFilter === value;
          return (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              aria-pressed={isActive}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Grid del Calendario ─────────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] overflow-x-auto w-full">
        <div className="min-w-[800px]">

          {/* Cabecera de días */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-surface-container-low border-b border-outline-variant/10">
            <div className="p-4 border-r border-outline-variant/10" />
            {weekDays.map((day, i) => {
              const dayIsToday = isToday(day);
              const dayIsWeekend = isWeekend(day);
              return (
                <div
                  key={i}
                  className={`p-4 text-center border-r border-outline-variant/10 last:border-r-0 ${
                    dayIsToday ? 'bg-primary/5' : dayIsWeekend ? 'bg-surface-container-lowest/50' : ''
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      dayIsToday ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {DAY_NAMES_ES[i]}
                  </p>
                  <p
                    className={`text-xl font-extrabold ${
                      dayIsToday
                        ? 'text-primary'
                        : dayIsWeekend
                        ? 'text-on-surface-variant/50'
                        : 'text-on-surface'
                    }`}
                  >
                    {day.getDate()}
                  </p>
                  {dayIsToday && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Cuerpo del grid */}
          <div className="max-h-[600px] overflow-y-auto">
            {WORK_HOURS.map((hour) => (
              <div key={hour}>
                {/* Fila especial de descanso justo antes de las 13:00 */}
                {hour === 13 && (
                  <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5 bg-primary/5">
                    <div className="p-3 text-right text-[11px] font-bold text-primary uppercase self-center">
                      12:00
                    </div>
                    <div className="col-span-7 p-4 flex items-center gap-4 min-h-14">
                      <Utensils className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        Periodo de Descanso y Mantenimiento del Sistema
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5">
                  {/* Etiqueta de hora */}
                  <div className="p-3 text-right text-[11px] font-bold text-on-surface-variant/60 uppercase self-start pt-4">
                    {String(hour).padStart(2, '0')}:00
                  </div>

                  {/* Celdas por día */}
                  {weekDays.map((day, di) => {
                    const event = getEvent(day, hour);
                    const dayIsToday = isToday(day);
                    const dayIsWeekend = isWeekend(day);

                    return (
                      <div
                        key={di}
                        className={`p-2 border-r border-outline-variant/5 last:border-r-0 ${
                          dayIsToday
                            ? 'bg-primary/5'
                            : dayIsWeekend
                            ? 'bg-surface-container-lowest/40'
                            : ''
                        }`}
                      >
                        {isLoading ? (
                          <div className="h-20 animate-pulse bg-surface-container-low/30 rounded-lg" />
                        ) : event ? (
                          <EventCell event={event} />
                        ) : (
                          <div className="min-h-20" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Acciones rápidas ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Download,
            iconBg: 'bg-primary/10',
            title: 'Exportar Registro',
            description: 'Generar PDF para facturación de seguros',
          },
          {
            icon: Bot,
            iconBg: 'bg-surface-container-highest',
            title: 'Ejecutar Optimización',
            description: 'Reasignación por IA de espacios pendientes',
          },
          {
            icon: History,
            iconBg: 'bg-primary/10',
            title: 'Historial Paciente',
            description: 'Vista rápida de interacciones de hoy',
          },
        ].map(({ icon: Icon, iconBg, title, description }) => (
          <Card
            key={title}
            className="bg-surface-container-lowest border-0 rounded-xl hover:shadow-[0_20px_50px_rgba(5,150,105,0.06)] transition-all cursor-pointer"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center text-primary`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">{title}</h4>
                <p className="text-[11px] text-on-surface-variant">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* FAB móvil */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button
          size="icon"
          className="w-14 h-14 bg-primary text-white rounded-full shadow-[0_20px_50px_rgba(5,150,105,0.3)] hover:scale-110 transition-transform active:scale-95"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
