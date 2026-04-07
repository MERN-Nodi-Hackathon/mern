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

type ViewMode = 'day' | 'week' | 'month';

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

/** Devuelve el primer día del mes (ajustado al lunes anterior si es necesario para llenar la grilla) */
function getMonthStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return getWeekStart(d);
}

/** Devuelve un array de 42 fechas (6 semanas × 7 días) para un mes completo */
function getMonthDays(monthStart: Date): Date[] {
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(monthStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Genera el label del mes visible (ej. "Abril 2026") */
function getMonthLabel(date: Date): string {
  return `${MONTH_NAMES_ES[date.getMonth()]} ${date.getFullYear()}`;
}

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

  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(today));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [monthStart, setMonthStart] = useState<Date>(() => getMonthStart(today));
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

  // Navegación por vista
  const handlePrevious = () => {
    if (viewMode === 'day') {
      const prev = new Date(selectedDate);
      prev.setDate(prev.getDate() - 1);
      setSelectedDate(prev);
    } else if (viewMode === 'week') {
      goToPrevWeek();
    } else {
      const prev = new Date(monthStart);
      prev.setMonth(prev.getMonth() - 1);
      setMonthStart(getMonthStart(prev));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + 1);
      setSelectedDate(next);
    } else if (viewMode === 'week') {
      goToNextWeek();
    } else {
      const next = new Date(monthStart);
      next.setMonth(next.getMonth() + 1);
      setMonthStart(getMonthStart(next));
    }
  };

  const handleToday = () => {
    setSelectedDate(today);
    setWeekStart(getWeekStart(today));
    setMonthStart(getMonthStart(today));
  };

  // Días visibles de la semana actual
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const weekLabel = useMemo(() => getWeekRangeLabel(weekDays), [weekDays]);
  const isCurrentWeek = useMemo(
    () => toDateKey(weekStart) === toDateKey(getWeekStart(today)),
    [weekStart, today]
  );

  const isCurrentDay = useMemo(() => toDateKey(selectedDate) === toDateKey(today), [selectedDate, today]);
  const dayLabel = useMemo(() => `${selectedDate.getDate()} ${MONTH_NAMES_ES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`, [selectedDate]);

  const monthLabel = useMemo(() => getMonthLabel(monthStart), [monthStart]);
  const monthDays = useMemo(() => getMonthDays(monthStart), [monthStart]);
  const isCurrentMonth = useMemo(
    () => monthStart.getMonth() === today.getMonth() && monthStart.getFullYear() === today.getFullYear(),
    [monthStart, today]
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

  // Helper para obtener evento
  const getEvent = (day: Date, hour: number): CalendarEvent | undefined =>
    filteredEventsMap.get(`${toDateKey(day)}-${hour}`);

  const isToday = (day: Date) => toDateKey(day) === toDateKey(today);
  const isWeekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6;

  // Navegación de semanas (mantenidas originales)
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

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto">

      {/* ── Encabezado ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Vista General del Horario
          </h2>
          <div className="flex items-center gap-4 mt-3">
            {/* Paginador */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-on-surface-variant hover:bg-white"
                onClick={handlePrevious}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="px-4 font-semibold text-on-surface text-sm min-w-48 text-center">
                {viewMode === 'day' ? dayLabel : viewMode === 'week' ? weekLabel : monthLabel}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-on-surface-variant hover:bg-white"
                onClick={handleNext}
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            {/* Botón Hoy */}
            <Button
              variant="ghost"
              onClick={handleToday}
              disabled={(viewMode === 'day' && isCurrentDay) || (viewMode === 'week' && isCurrentWeek) || (viewMode === 'month' && isCurrentMonth)}
              className="font-medium text-primary hover:bg-primary/5 text-sm rounded-xl disabled:opacity-40"
            >
              Hoy
            </Button>
          </div>
        </div>

        {/* Selector de vista */}
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl self-start md:self-auto">
          <Button
            onClick={() => setViewMode('day')}
            variant={viewMode === 'day' ? 'outline' : 'ghost'}
            className={`px-5 py-1.5 text-sm font-semibold rounded-lg h-9 ${
              viewMode === 'day'
                ? 'bg-white text-primary border-none hover:bg-white hover:text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Día
          </Button>
          <Button
            onClick={() => setViewMode('week')}
            variant={viewMode === 'week' ? 'outline' : 'ghost'}
            className={`px-5 py-1.5 text-sm font-semibold rounded-lg h-9 ${
              viewMode === 'week'
                ? 'bg-white text-primary border-none hover:bg-white hover:text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Semana
          </Button>
          <Button
            onClick={() => setViewMode('month')}
            variant={viewMode === 'month' ? 'outline' : 'ghost'}
            className={`px-5 py-1.5 text-sm font-semibold rounded-lg h-9 ${
              viewMode === 'month'
                ? 'bg-white text-primary border-none hover:bg-white hover:text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
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
        
        {/* VISTA DE DÍA */}
        {viewMode === 'day' && (
          <div className="min-w-[800px]">
            {/* Cabecera */}
            <div className="grid grid-cols-[80px_1fr] bg-surface-container-low border-b border-outline-variant/10">
              <div className="p-4 border-r border-outline-variant/10" />
              <div className="p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {DAY_NAMES_ES[selectedDate.getDay()]}
                </p>
                <p className="text-xl font-extrabold text-on-surface mt-1">
                  {selectedDate.getDate()}/{(selectedDate.getMonth() + 1).toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[600px] overflow-y-auto">
              {WORK_HOURS.map((hour) => (
                <div key={hour}>
                  {hour === 13 && (
                    <div className="grid grid-cols-[80px_1fr] border-b border-outline-variant/5 bg-primary/5">
                      <div className="p-3 text-right text-[11px] font-bold text-primary uppercase self-center">
                        12:00
                      </div>
                      <div className="p-4 flex items-center gap-4 min-h-14">
                        <Utensils className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">
                          Descanso
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-[80px_1fr] border-b border-outline-variant/5">
                    <div className="p-3 text-right text-[11px] font-bold text-on-surface-variant/60 uppercase self-start pt-4">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                    <div className="p-2">
                      {isLoading ? (
                        <div className="h-20 animate-pulse bg-surface-container-low/30 rounded-lg" />
                      ) : getEvent(selectedDate, hour) ? (
                        <EventCell event={getEvent(selectedDate, hour)!} />
                      ) : (
                        <div className="min-h-20" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA DE SEMANA */}
        {viewMode === 'week' && (
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
                    <div className="p-3 text-right text-[11px] font-bold text-on-surface-variant/60 uppercase self-start pt-4">
                      {String(hour).padStart(2, '0')}:00
                    </div>

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
        )}

        {/* VISTA DE MES */}
        {viewMode === 'month' && (
          <div>
            {/* Cabecera */}
            <div className="grid grid-cols-7 gap-0 bg-surface-container-low border-b border-outline-variant/10">
              {DAY_NAMES_ES.map((day) => (
                <div key={day} className="p-4 text-center border-r border-outline-variant/10 last:border-r-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{day}</p>
                </div>
              ))}
            </div>

            {/* Grid de fechas */}
            <div className="grid grid-cols-7 gap-0 divide-x divide-y divide-outline-variant/10">
              {monthDays.map((day) => {
                const dayIsToday = isToday(day);
                const dayIsCurrentMonth = day.getMonth() === monthStart.getMonth();
                const dayIsWeekend = isWeekend(day);
                const dayEvents = WORK_HOURS.map((h) => getEvent(day, h)).filter((e) => e);

                return (
                  <div
                    key={toDateKey(day)}
                    className={`min-h-24 p-3 ${
                      dayIsToday
                        ? 'bg-primary/10 border-2 border-primary'
                        : dayIsWeekend
                        ? 'bg-surface-container-lowest/50'
                        : dayIsCurrentMonth
                        ? 'bg-surface-container-lowest'
                        : 'bg-surface-container-highest/20'
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        dayIsToday
                          ? 'text-primary'
                          : dayIsCurrentMonth
                          ? 'text-on-surface'
                          : 'text-on-surface-variant/50'
                      }`}
                    >
                      {day.getDate()}
                    </p>
                    {dayEvents.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 2).map((event, i) => (
                          <div
                            key={i}
                            className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-1 rounded truncate"
                          >
                            {event?.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="text-[10px] text-on-surface-variant">+{dayEvents.length - 2} más</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
