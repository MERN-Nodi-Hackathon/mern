export type EventType = 'booking' | 'ai_booking' | 'internal' | 'blocked';

export type FilterType = EventType | 'all';

export interface CalendarEvent {
  id: string;
  type: EventType;
  /** Etiqueta de categoría (ej. "Reservado por IA") */
  label: string;
  /** Línea principal (ej. "Paciente: Martha S.") */
  title: string;
  /** Línea secundaria (ej. "Vía: IA-Web") */
  detail?: string;
  /** Fecha ISO YYYY-MM-DD */
  date: string;
  /** Hora de inicio en número (8 = 08:00, 14 = 14:00) */
  hour: number;
}
