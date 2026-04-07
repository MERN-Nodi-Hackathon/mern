-- ============================================================
-- Seed data – Nodi Family Clinic (multi-country)
-- ============================================================

-- Clinics
insert into public.clinics (id, name, timezone, work_start_hour, work_end_hour, country_code, phone_prefix, city)
values
  (1, 'Nodi Family Clinic – Bogotá',   'America/Bogota',      8, 18, 'CO', '+57', 'Bogotá'),
  (2, 'Nodi Family Clinic – Santiago',  'America/Santiago',    9, 19, 'CL', '+56', 'Santiago'),
  (3, 'Nodi Family Clinic – CDMX',      'America/Mexico_City', 8, 18, 'MX', '+52', 'Ciudad de México'),
  (4, 'Nodi Family Clinic – La Paz',    'America/La_Paz',      8, 17, 'BO', '+591', 'La Paz')
on conflict (id) do nothing;

-- Providers
insert into public.providers (id, clinic_id, name, specialization, calendar_id)
values
  -- Colombia
  (1,  1, 'Dr. Camila Ortega',     'General practice',         'camila.ortega@nodi-calendar'),
  (2,  1, 'Dr. Mateo Rivas',       'Radiology',                'mateo.rivas@nodi-calendar'),
  (3,  1, 'Valentina Cruz',        'Follow-up coordination',   null),
  -- Chile
  (4,  2, 'Dr. Ignacio Sepúlveda', 'Pediatrics',               'ignacio.sepulveda@nodi-calendar'),
  (5,  2, 'Dra. Javiera Muñoz',    'Dermatology',              'javiera.munoz@nodi-calendar'),
  (6,  2, 'Catalina Bravo',        'Nursing',                  null),
  -- México
  (7,  3, 'Dr. Rodrigo Hernández', 'Internal medicine',        'rodrigo.hernandez@nodi-calendar'),
  (8,  3, 'Dra. Fernanda López',   'Gynecology',               'fernanda.lopez@nodi-calendar'),
  (9,  3, 'Miguel Ángel Soto',     'Physical therapy',         null),
  -- Bolivia
  (10, 4, 'Dr. Diego Quispe',      'General practice',         'diego.quispe@nodi-calendar'),
  (11, 4, 'Dra. Lucía Mamani',     'Ophthalmology',            'lucia.mamani@nodi-calendar'),
  (12, 4, 'Karen Flores',          'Follow-up coordination',   null)
on conflict (id) do nothing;

-- Services
insert into public.services (id, clinic_id, name, duration_min)
values
  -- Colombia
  (1,  1, 'General Visit',       30),
  (2,  1, 'Chest X-Ray',         15),
  (3,  1, 'Care Follow-up',      20),
  -- Chile
  (4,  2, 'Pediatric Check-up',  30),
  (5,  2, 'Dermatology Consult', 25),
  (6,  2, 'Vaccination',         10),
  -- México
  (7,  3, 'Internal Medicine',   40),
  (8,  3, 'Prenatal Control',    30),
  (9,  3, 'Rehabilitation',      45),
  -- Bolivia
  (10, 4, 'General Visit',       30),
  (11, 4, 'Eye Exam',            20),
  (12, 4, 'Care Follow-up',      20)
on conflict (id) do nothing;

-- Patients
insert into public.patients (id, clinic_id, name, phone, email, country_code, timezone)
values
  -- Colombia (country_code CO, timezone America/Bogota, phone +57)
  (1,  1, 'Ana Torres',          '+573001234567',   'ana.torres@example.com',       'CO', 'America/Bogota'),
  (2,  1, 'Luis Mejía',          '+573019876543',   'luis.mejia@example.com',        'CO', 'America/Bogota'),
  (3,  1, 'Sara Guzmán',         '+573152221144',   null,                            'CO', 'America/Bogota'),
  -- Chile (country_code CL, timezone America/Santiago, phone +56)
  (4,  2, 'Martín Rojas',        '+56944556677',    'martin.rojas@example.cl',      'CL', 'America/Santiago'),
  (5,  2, 'Isidora Vargas',      '+56933221100',    'isidora.vargas@example.cl',    'CL', 'America/Santiago'),
  (6,  2, 'Tomás Fuentes',       '+56988775544',    null,                            'CL', 'America/Santiago'),
  -- México (country_code MX, timezone America/Mexico_City, phone +52)
  (7,  3, 'Gabriela Ramírez',    '+525512345678',   'gabriela.ramirez@example.mx',  'MX', 'America/Mexico_City'),
  (8,  3, 'Diego Castillo',      '+523387654321',   'diego.castillo@example.mx',    'MX', 'America/Mexico_City'),
  (9,  3, 'Sofía Mendoza',       '+528122334455',   null,                            'MX', 'America/Mexico_City'),
  -- Bolivia (country_code BO, timezone America/La_Paz, phone +591)
  (10, 4, 'Carlos Condori',      '+59171234567',    'carlos.condori@example.bo',    'BO', 'America/La_Paz'),
  (11, 4, 'María José Peña',     '+59167654321',    'mariajose.pena@example.bo',    'BO', 'America/La_Paz'),
  (12, 4, 'Alejandro Huanca',    '+59179988776',    null,                            'BO', 'America/La_Paz')
on conflict (id) do nothing;

-- Appointments
insert into public.appointments (
  id, clinic_id, patient_id, provider_id, service_id,
  start_time, end_time, status, notes, external_event_id
)
values
  -- Colombia
  (1,  1, 1, 1, 1,
   timezone('utc', now()) + interval '1 day' + interval '9 hour',
   timezone('utc', now()) + interval '1 day' + interval '9 hour 30 minute',
   'scheduled', 'First-time intake', null),
  (2,  1, 2, 2, 2,
   timezone('utc', now()) + interval '1 day' + interval '11 hour',
   timezone('utc', now()) + interval '1 day' + interval '11 hour 15 minute',
   'scheduled', 'Referred from triage', 'evt_demo_xray'),
  (3,  1, 3, 3, 3,
   timezone('utc', now()) + interval '2 day' + interval '15 hour',
   timezone('utc', now()) + interval '2 day' + interval '15 hour 20 minute',
   'pending', 'Waiting on confirmation', null),
  -- Chile
  (4,  2, 4, 4, 4,
   timezone('utc', now()) + interval '1 day' + interval '10 hour',
   timezone('utc', now()) + interval '1 day' + interval '10 hour 30 minute',
   'scheduled', 'Annual pediatric check-up', null),
  (5,  2, 5, 5, 5,
   timezone('utc', now()) + interval '1 day' + interval '14 hour',
   timezone('utc', now()) + interval '1 day' + interval '14 hour 25 minute',
   'scheduled', 'Skin rash evaluation', null),
  (6,  2, 6, 6, 6,
   timezone('utc', now()) + interval '3 day' + interval '9 hour',
   timezone('utc', now()) + interval '3 day' + interval '9 hour 10 minute',
   'pending', 'Flu vaccine', null),
  -- México
  (7,  3, 7, 7, 7,
   timezone('utc', now()) + interval '1 day' + interval '8 hour',
   timezone('utc', now()) + interval '1 day' + interval '8 hour 40 minute',
   'scheduled', 'Hypertension follow-up', null),
  (8,  3, 8, 8, 8,
   timezone('utc', now()) + interval '2 day' + interval '10 hour',
   timezone('utc', now()) + interval '2 day' + interval '10 hour 30 minute',
   'scheduled', 'Second trimester control', 'evt_prenatal_02'),
  (9,  3, 9, 9, 9,
   timezone('utc', now()) + interval '2 day' + interval '16 hour',
   timezone('utc', now()) + interval '2 day' + interval '16 hour 45 minute',
   'pending', 'Post-surgery rehab', null),
  -- Bolivia
  (10, 4, 10, 10, 10,
   timezone('utc', now()) + interval '1 day' + interval '8 hour',
   timezone('utc', now()) + interval '1 day' + interval '8 hour 30 minute',
   'scheduled', 'Routine check-up', null),
  (11, 4, 11, 11, 11,
   timezone('utc', now()) + interval '1 day' + interval '11 hour',
   timezone('utc', now()) + interval '1 day' + interval '11 hour 20 minute',
   'scheduled', 'Vision screening', null),
  (12, 4, 12, 12, 12,
   timezone('utc', now()) + interval '3 day' + interval '14 hour',
   timezone('utc', now()) + interval '3 day' + interval '14 hour 20 minute',
   'pending', 'Post-treatment follow-up', null)
on conflict (id) do nothing;
