import type {
  Appointment,
  Clinic,
  Patient,
  Provider,
  Service,
} from '@mern/shared';

function toIso(date: Date) {
  return date.toISOString();
}

function slotFromNow(daysAhead: number, hour: number, durationMinutes: number) {
  const start = new Date();
  start.setDate(start.getDate() + daysAhead);
  start.setHours(hour, 0, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + durationMinutes);

  return {
    start: toIso(start),
    end: toIso(end),
  };
}

const consultationSlot = slotFromNow(1, 9, 30);
const xraySlot = slotFromNow(1, 11, 15);
const followupSlot = slotFromNow(2, 15, 20);

export const demoClinic: Clinic = {
  id: 1,
  name: 'Nodi Family Clinic',
  timezone: 'America/Bogota',
};

export const demoProviders: Provider[] = [
  {
    id: 1,
    clinic_id: 1,
    name: 'Dr. Camila Ortega',
    specialization: 'General practice',
    calendar_id: 'camila.ortega@nodi-calendar',
  },
  {
    id: 2,
    clinic_id: 1,
    name: 'Dr. Mateo Rivas',
    specialization: 'Radiology',
    calendar_id: 'mateo.rivas@nodi-calendar',
  },
  {
    id: 3,
    clinic_id: 1,
    name: 'Valentina Cruz',
    specialization: 'Follow-up coordination',
    calendar_id: null,
  },
];

export const demoServices: Service[] = [
  {
    id: 1,
    clinic_id: 1,
    name: 'General Visit',
    duration_min: 30,
  },
  {
    id: 2,
    clinic_id: 1,
    name: 'Chest X-Ray',
    duration_min: 15,
  },
  {
    id: 3,
    clinic_id: 1,
    name: 'Care Follow-up',
    duration_min: 20,
  },
];

export const demoPatients: Patient[] = [
  {
    id: 1,
    clinic_id: 1,
    name: 'Ana Torres',
    phone: '+57 300 123 4567',
    email: 'ana.torres@example.com',
  },
  {
    id: 2,
    clinic_id: 1,
    name: 'Luis Mejia',
    phone: '+57 301 987 6543',
    email: 'luis.mejia@example.com',
  },
  {
    id: 3,
    clinic_id: 1,
    name: 'Sara Guzman',
    phone: '+57 315 222 1144',
    email: null,
  },
];

export const demoAppointments: Appointment[] = [
  {
    id: 1,
    clinic_id: 1,
    patient_id: 1,
    provider_id: 1,
    service_id: 1,
    start_time: consultationSlot.start,
    end_time: consultationSlot.end,
    status: 'scheduled',
    notes: 'First-time intake',
    external_event_id: null,
    reminder_sent_at: null,
  },
  {
    id: 2,
    clinic_id: 1,
    patient_id: 2,
    provider_id: 2,
    service_id: 2,
    start_time: xraySlot.start,
    end_time: xraySlot.end,
    status: 'scheduled',
    notes: 'Referred from triage',
    external_event_id: 'evt_demo_xray',
    reminder_sent_at: null,
  },
  {
    id: 3,
    clinic_id: 1,
    patient_id: 3,
    provider_id: 3,
    service_id: 3,
    start_time: followupSlot.start,
    end_time: followupSlot.end,
    status: 'pending',
    notes: 'Waiting on confirmation',
    external_event_id: null,
    reminder_sent_at: null,
  },
];
