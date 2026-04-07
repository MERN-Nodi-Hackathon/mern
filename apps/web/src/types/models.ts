/** 
 * CLINIC & AUTH MODELS 
 */

export interface Clinic {
  id: string;
  name: string;
  shortName: string;
  brandName: string;
  slogan: string;
  specialty: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export interface User {
  id: string;
  firstName: string;
  fullName: string;
  role: string;
  photoUrl: string;
  email: string;
}

export interface InboxNotification {
  id: string;
  message: string;
  time: string;
  isRead: boolean;
}

export interface UserPreferences {
  notifications: {
    id: string;
    label: string;
    description: string;
    defaultChecked: boolean;
  }[];
}

export interface BillingInfo {
  plan: string;
  cardType: string;
  cardNumberHidden: string;
  cardExpiry: string;
  nextChargeDate: string;
  priceMonthly: string;
}

/** 
 * PATIENT MODELS 
 */

export type PatientCategory = 'all' | 'general' | 'chronic' | 'urgent';
export type VisitStatus = 'confirmed' | 'pending' | 'new' | 'none';

export interface PatientVisit {
  date: string;
  reason?: string;
  status?: VisitStatus;
}

export interface Patient {
  id: string;
  name: string;
  photoUrl: string;
  age: number;
  category: PatientCategory;
  lastVisit: PatientVisit;
  nextVisit: PatientVisit;
  email: string;
  phone: string;
}

export interface PatientStats {
  id: string;
  label: string;
  value: string;
  sub: string;
}

/** 
 * STAFF / PERSONNEL MODELS 
 */

export type StaffStatus = 'available' | 'busy' | 'away';

export interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  status: StaffStatus;
  statusLabel: string;
  consultorio: string;
  nextTurno?: string;
  timeLeft?: string;
  returnDate?: string;
  urgentAvailable?: boolean;
  photoUrl: string;
  initials: string;
}

export interface StaffShift {
  id: string;
  dayLabel: string;
  dayType: 'morning' | 'surgery' | 'specialty';
  title: string;
  subtitle: string;
  avatars: string[];
  overflow?: string | null;
}

export interface AISuggestion {
  id: string;
  type: string;
  body: string;
  actionLabel: string;
}

/** 
 * CALENDAR / APPOINTMENT MODELS 
 */

export type EventType = 'confirmed' | 'booking' | 'internal' | 'blocked' | 'ai_booking';
export type FilterType = EventType | 'all';

export interface CalendarEvent {
  id: string;
  type: EventType | string;
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

/** 
 * AGENT MODELS 
 */

export interface AgentIdentity {
  greetingMessage: string;
  timezone: string;
  tone: string;
  language: string;
}

export interface AgentMetrics {
  hceStatus: string;
  avgLatencyMs: number;
  modelVersion: string;
  uptime: string;
}

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  options?: { id: string; label: string }[];
}

/** 
 * DASHBOARD MODELS 
 */

export interface DashboardStats {
  todayAppointments: number;
  appointmentGrowth: string;
  aiConversionRate: string;
  activeClinics: number;
  locationsCount: number;
}

export interface RecentActivity {
  initials: string;
  name: string;
  avatarClass: string;
  badgeClass: string;
  badgeLabel: string;
  time: string;
}

export interface AIPulseMetric {
  label: string;
  value: number;
  colorClass: string;
  textClass: string;
}

export interface AIThread {
  label: string;
  active: boolean;
}
