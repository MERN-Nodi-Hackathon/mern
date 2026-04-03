insert into public.clinics (id, name, timezone)
values (1, 'Nodi Family Clinic', 'America/Bogota')
on conflict (id) do nothing;

insert into public.providers (id, clinic_id, name, specialization, calendar_id)
values
  (1, 1, 'Dr. Camila Ortega', 'General practice', 'camila.ortega@nodi-calendar'),
  (2, 1, 'Dr. Mateo Rivas', 'Radiology', 'mateo.rivas@nodi-calendar'),
  (3, 1, 'Valentina Cruz', 'Follow-up coordination', null)
on conflict (id) do nothing;

insert into public.services (id, clinic_id, name, duration_min)
values
  (1, 1, 'General Visit', 30),
  (2, 1, 'Chest X-Ray', 15),
  (3, 1, 'Care Follow-up', 20)
on conflict (id) do nothing;

insert into public.patients (id, clinic_id, name, phone, email)
values
  (1, 1, 'Ana Torres', '+57 300 123 4567', 'ana.torres@example.com'),
  (2, 1, 'Luis Mejia', '+57 301 987 6543', 'luis.mejia@example.com'),
  (3, 1, 'Sara Guzman', '+57 315 222 1144', null)
on conflict (id) do nothing;

insert into public.appointments (
  id,
  clinic_id,
  patient_id,
  provider_id,
  service_id,
  start_time,
  end_time,
  status,
  notes,
  external_event_id
)
values
  (
    1,
    1,
    1,
    1,
    1,
    timezone('utc', now()) + interval '1 day' + interval '9 hour',
    timezone('utc', now()) + interval '1 day' + interval '9 hour 30 minute',
    'scheduled',
    'First-time intake',
    null
  ),
  (
    2,
    1,
    2,
    2,
    2,
    timezone('utc', now()) + interval '1 day' + interval '11 hour',
    timezone('utc', now()) + interval '1 day' + interval '11 hour 15 minute',
    'scheduled',
    'Referred from triage',
    'evt_demo_xray'
  ),
  (
    3,
    1,
    3,
    3,
    3,
    timezone('utc', now()) + interval '2 day' + interval '15 hour',
    timezone('utc', now()) + interval '2 day' + interval '15 hour 20 minute',
    'pending',
    'Waiting on confirmation',
    null
  )
on conflict (id) do nothing;
