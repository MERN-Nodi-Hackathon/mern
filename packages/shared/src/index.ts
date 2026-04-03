import { z } from 'zod';

export const AppointmentStatusSchema = z.enum([
  'pending',
  'scheduled',
  'rescheduled',
  'cancelled',
  'completed',
]);

export const ClinicSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  timezone: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  clinic_id: z.number().int(),
  email: z.string().email(),
  full_name: z.string().nullable().default(null),
  role: z.enum(['admin', 'staff']),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const ProviderSchema = z.object({
  id: z.number().int(),
  clinic_id: z.number().int(),
  name: z.string(),
  specialization: z.string(),
  calendar_id: z.string().nullable().default(null),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const ServiceSchema = z.object({
  id: z.number().int(),
  clinic_id: z.number().int(),
  name: z.string(),
  duration_min: z.number().int().positive(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const PatientSchema = z.object({
  id: z.number().int(),
  clinic_id: z.number().int(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email().nullable().default(null),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const AppointmentSchema = z.object({
  id: z.number().int(),
  clinic_id: z.number().int(),
  patient_id: z.number().int(),
  provider_id: z.number().int(),
  service_id: z.number().int(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  status: AppointmentStatusSchema,
  notes: z.string().nullable().default(null),
  external_event_id: z.string().nullable().default(null),
  reminder_sent_at: z.string().datetime().nullable().default(null),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const AvailabilitySlotSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  provider_id: z.number().int().optional(),
});

export const PatientIdentitySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional(),
});

export const CreateAppointmentInputSchema = z.object({
  patient_id: z.number().int(),
  provider_id: z.number().int(),
  service_id: z.number().int(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  notes: z.string().optional(),
});

export const RescheduleAppointmentInputSchema = z.object({
  appointment_id: z.number().int(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});

export const CancelAppointmentInputSchema = z.object({
  appointment_id: z.number().int(),
  reason: z.string().optional(),
});

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type Clinic = z.infer<typeof ClinicSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type PatientIdentity = z.infer<typeof PatientIdentitySchema>;
export type CreateAppointmentInput = z.infer<
  typeof CreateAppointmentInputSchema
>;
export type RescheduleAppointmentInput = z.infer<
  typeof RescheduleAppointmentInputSchema
>;
export type CancelAppointmentInput = z.infer<
  typeof CancelAppointmentInputSchema
>;
