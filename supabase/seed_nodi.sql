-- ============================================================
-- SEED – Nodi / VitalAgent
-- Basado en: user-company-data.json, patient-data.json,
--            personal-data.json, calendar-data.json, agent-data.json
-- Compatible con el schema real de Supabase (proyecto: nodi)
-- ============================================================

-- Usa la clínica existente con id=3 (CDMX) como base para
-- Sanctuary Clinical Center (los datos del JSON son de México)
-- Si quieres una clínica nueva, descomenta el bloque de abajo.

-- ============================================================
-- 1. ACTUALIZAR CLINIC (id=3, CDMX) con datos de user-company-data.json
-- ============================================================
UPDATE public.clinics SET
  name         = 'Sanctuary Clinical Center',
  brand_name   = 'VitalAgent',
  slogan       = 'Automatización Médica',
  description  = 'Centro de referencia en Medicina Interna con automatización IA',
  timezone     = 'America/Mexico_City',
  country_code = 'MX',
  city         = 'Ciudad de México',
  address      = 'Paseo de la Reforma 120, 06600 CDMX, México',
  phone_prefix = '+52',
  logo         = NULL  -- reemplazar con URL real si se tiene
WHERE id = 3;

-- ============================================================
-- 2. PROVIDERS (personal-data.json → doctors)
--    clinic_id = 3 (Sanctuary / CDMX)
-- ============================================================
INSERT INTO public.providers (clinic_id, name, specialization, email, phone)
VALUES
  (3, 'Dra. Elena Valdés',  'Cardiología Clínica',   'e.valdes@sanctuaryclinical.com',  '+52 55 1000 0001'),
  (3, 'Dr. Julián Sotto',   'Neurología Avanzada',   'j.sotto@sanctuaryclinical.com',   '+52 55 1000 0002'),
  (3, 'Dra. Sara Méndez',   'Pediatría General',     's.mendez@sanctuaryclinical.com',  '+52 55 1000 0003'),
  (3, 'Dr. Mateo Ruiz',     'Traumatología',         'm.ruiz@sanctuaryclinical.com',    '+52 55 1000 0004')
ON CONFLICT (clinic_id, name) DO NOTHING;

-- ============================================================
-- 3. SERVICES (derivados de especialidades y motivos de visita)
--    clinic_id = 3
-- ============================================================
INSERT INTO public.services (clinic_id, name, specialty, duration_min, description)
VALUES
  (3, 'Chequeo General',          'Medicina Interna',    30, 'Revisión general de salud'),
  (3, 'Control Post-operatorio',  'Medicina Interna',    45, 'Seguimiento tras cirugía'),
  (3, 'Consulta de Cardiología',  'Cardiología Clínica', 40, 'Evaluación cardiovascular'),
  (3, 'Control de Diabetes',      'Medicina Interna',    30, 'Control glucémico periódico'),
  (3, 'Consulta de Neurología',   'Neurología Avanzada', 50, 'Evaluación neurológica'),
  (3, 'Consulta de Pediatría',    'Pediatría General',   30, 'Atención pediátrica'),
  (3, 'Revisión de Traumatología','Traumatología',       40, 'Evaluación músculo-esquelética'),
  (3, 'Consulta de Urgencias',    'Medicina Interna',    20, 'Atención urgente no programada'),
  (3, 'Revisión RM',              'Neurología Avanzada', 30, 'Revisión de resonancia magnética'),
  (3, 'Chequeo Anual',            'Medicina Interna',    60, 'Revisión anual completa')
ON CONFLICT (clinic_id, name) DO NOTHING;

-- ============================================================
-- 4. PROVIDER_SERVICES (asociar médicos con sus servicios)
-- ============================================================
DO $$
DECLARE
  p_valdes  bigint; p_sotto   bigint;
  p_mendez  bigint; p_ruiz    bigint;
  s_general bigint; s_postop  bigint; s_cardio  bigint;
  s_diab    bigint; s_neuro   bigint; s_ped     bigint;
  s_trauma  bigint; s_urg     bigint; s_rm      bigint;
  s_anual   bigint;
BEGIN
  SELECT id INTO p_valdes FROM public.providers WHERE clinic_id=3 AND name='Dra. Elena Valdés';
  SELECT id INTO p_sotto  FROM public.providers WHERE clinic_id=3 AND name='Dr. Julián Sotto';
  SELECT id INTO p_mendez FROM public.providers WHERE clinic_id=3 AND name='Dra. Sara Méndez';
  SELECT id INTO p_ruiz   FROM public.providers WHERE clinic_id=3 AND name='Dr. Mateo Ruiz';

  SELECT id INTO s_general FROM public.services WHERE clinic_id=3 AND name='Chequeo General';
  SELECT id INTO s_postop  FROM public.services WHERE clinic_id=3 AND name='Control Post-operatorio';
  SELECT id INTO s_cardio  FROM public.services WHERE clinic_id=3 AND name='Consulta de Cardiología';
  SELECT id INTO s_diab    FROM public.services WHERE clinic_id=3 AND name='Control de Diabetes';
  SELECT id INTO s_neuro   FROM public.services WHERE clinic_id=3 AND name='Consulta de Neurología';
  SELECT id INTO s_ped     FROM public.services WHERE clinic_id=3 AND name='Consulta de Pediatría';
  SELECT id INTO s_trauma  FROM public.services WHERE clinic_id=3 AND name='Revisión de Traumatología';
  SELECT id INTO s_urg     FROM public.services WHERE clinic_id=3 AND name='Consulta de Urgencias';
  SELECT id INTO s_rm      FROM public.services WHERE clinic_id=3 AND name='Revisión RM';
  SELECT id INTO s_anual   FROM public.services WHERE clinic_id=3 AND name='Chequeo Anual';

  INSERT INTO public.provider_services (provider_id, service_id) VALUES
    (p_valdes, s_cardio), (p_valdes, s_general), (p_valdes, s_anual), (p_valdes, s_urg),
    (p_sotto,  s_neuro),  (p_sotto,  s_rm),      (p_sotto,  s_urg),
    (p_mendez, s_ped),    (p_mendez, s_general),  (p_mendez, s_urg),
    (p_ruiz,   s_trauma), (p_ruiz,   s_postop),   (p_ruiz,   s_urg)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================================
-- 5. PATIENTS (patient-data.json)
--    clinic_id = 3, timezone Mexico City
-- ============================================================
INSERT INTO public.patients (clinic_id, name, phone, email, timezone, date_of_birth, country_code, category)
VALUES
  (3, 'Elena Rodriguez',  '+52 55 1234 5678', 'elena.r@email.com',    'America/Mexico_City', '1982-06-15', 'MX', 'Seguimiento'),
  (3, 'Carlos Méndez',    '+52 33 9876 5432', 'c.mendez@email.com',   'America/Mexico_City', '1956-03-22', 'MX', 'Seguimiento'),
  (3, 'Sofía Morales',    '+52 55 4567 8901', 'sofia.m@email.com',    'America/Mexico_City', '1997-11-08', 'MX', 'Nuevo'),
  (3, 'Javier Ortiz',     '+52 81 3456 7890', 'j.ortiz@email.com',    'America/Mexico_City', '1989-04-30', 'MX', 'Crítico'),
  (3, 'Mariana Torres',   '+52 55 6789 0123', 'm.torres@email.com',   'America/Mexico_City', '1970-09-12', 'MX', 'Seguimiento'),
  (3, 'Roberto Aguilar',  '+52 33 2345 6789', 'r.aguilar@email.com',  'America/Mexico_City', '1977-01-05', 'MX', 'Crítico'),
  (3, 'Ana Gutiérrez',    '+52 55 8901 2345', 'a.gutierrez@email.com','America/Mexico_City', '1961-07-19', 'MX', 'Seguimiento'),
  (3, 'Luis Ramírez',     '+52 81 4567 8901', 'l.ramirez@email.com',  'America/Mexico_City', '1993-02-28', 'MX', 'Nuevo'),
  -- Pacientes del calendar-data.json
  (3, 'Roberto V.',       '+52 55 2000 0001', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Carmen L.',        '+52 55 2000 0002', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Diego M.',         '+52 55 2000 0003', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Isabel F.',        '+52 55 2000 0004', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Tomás R.',         '+52 55 2000 0005', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Carlos M.',        '+52 55 2000 0006', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Gloria P.',        '+52 55 2000 0007', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Martha S.',        '+52 55 2000 0008', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'John D.',          '+52 55 2000 0009', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Alex T.',          '+52 55 2000 0010', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Patricia N.',      '+52 55 2000 0011', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Sofía B.',         '+52 55 2000 0012', NULL,                   'America/Mexico_City', NULL,         'MX', 'Nuevo'),
  (3, 'Miguel R.',        '+52 55 2000 0013', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Ana Gómez',        '+52 55 2000 0014', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Laura S.',         '+52 55 2000 0015', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'María P.',         '+52 55 2000 0016', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'José M.',          '+52 55 2000 0017', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Luisa V.',         '+52 55 2000 0018', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Andrés K.',        '+52 55 2000 0019', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Ana B.',           '+52 55 2000 0020', NULL,                   'America/Mexico_City', NULL,         'MX', 'Nuevo'),
  (3, 'Sofía L.',         '+52 55 2000 0021', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Fernando H.',      '+52 55 2000 0022', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Valentina R.',     '+52 55 2000 0023', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento'),
  (3, 'Elena R.',         '+52 55 2000 0024', NULL,                   'America/Mexico_City', NULL,         'MX', 'Seguimiento')
ON CONFLICT (clinic_id, phone) DO NOTHING;

-- ============================================================
-- 6. APPOINTMENTS (calendar-data.json)
--    Solo los de tipo booking y ai_booking (con paciente)
--    Los internos y bloqueados no generan appointment en la BD
-- ============================================================
DO $$
DECLARE
  -- Providers
  p_valdes  bigint; p_sotto bigint; p_mendez bigint; p_ruiz bigint;
  -- Services
  s_general bigint; s_cardio bigint; s_neuro bigint;
  s_trauma  bigint; s_postop bigint; s_ped bigint;
BEGIN
  SELECT id INTO p_valdes FROM public.providers WHERE clinic_id=3 AND name='Dra. Elena Valdés';
  SELECT id INTO p_sotto  FROM public.providers WHERE clinic_id=3 AND name='Dr. Julián Sotto';
  SELECT id INTO p_mendez FROM public.providers WHERE clinic_id=3 AND name='Dra. Sara Méndez';
  SELECT id INTO p_ruiz   FROM public.providers WHERE clinic_id=3 AND name='Dr. Mateo Ruiz';

  SELECT id INTO s_general FROM public.services WHERE clinic_id=3 AND name='Chequeo General';
  SELECT id INTO s_cardio  FROM public.services WHERE clinic_id=3 AND name='Consulta de Cardiología';
  SELECT id INTO s_neuro   FROM public.services WHERE clinic_id=3 AND name='Consulta de Neurología';
  SELECT id INTO s_trauma  FROM public.services WHERE clinic_id=3 AND name='Revisión de Traumatología';
  SELECT id INTO s_postop  FROM public.services WHERE clinic_id=3 AND name='Control Post-operatorio';
  SELECT id INTO s_ped     FROM public.services WHERE clinic_id=3 AND name='Consulta de Pediatría';

  -- Semana anterior (1–4 Abr)
  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Roberto V.'),
    p_valdes, s_cardio,
    '2026-04-01 09:00:00-06', '2026-04-01 09:40:00-06',
    'completed', 'Vía: Portal Web'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Carmen L.'),
    p_mendez, s_ped,
    '2026-04-02 08:00:00-06', '2026-04-02 08:30:00-06',
    'completed', 'Vía: IA-Web'
  WHERE p_mendez IS NOT NULL AND s_ped IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Diego M.'),
    p_ruiz, s_trauma,
    '2026-04-03 10:00:00-06', '2026-04-03 10:40:00-06',
    'completed', 'Lugar: Consultorio C'
  WHERE p_ruiz IS NOT NULL AND s_trauma IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Isabel F.'),
    p_valdes, s_cardio,
    '2026-04-04 09:00:00-06', '2026-04-04 09:40:00-06',
    'completed', 'Vía: IA-Web'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Tomás R.'),
    p_ruiz, s_trauma,
    '2026-04-04 15:00:00-06', '2026-04-04 15:40:00-06',
    'completed', 'Lugar: Consultorio B'
  WHERE p_ruiz IS NOT NULL AND s_trauma IS NOT NULL;

  -- Semana actual (7–11 Abr)
  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Carlos M.'),
    p_valdes, s_cardio,
    '2026-04-07 09:00:00-06', '2026-04-07 09:40:00-06',
    'scheduled', 'Vía: Portal Web'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Gloria P.'),
    p_valdes, s_general,
    '2026-04-07 14:00:00-06', '2026-04-07 14:30:00-06',
    'scheduled', 'Lugar: Consultorio A'
  WHERE p_valdes IS NOT NULL AND s_general IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Martha S.'),
    p_mendez, s_ped,
    '2026-04-08 08:00:00-06', '2026-04-08 08:30:00-06',
    'scheduled', 'Vía: IA-Web'
  WHERE p_mendez IS NOT NULL AND s_ped IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='John D.'),
    p_sotto, s_neuro,
    '2026-04-08 09:00:00-06', '2026-04-08 09:50:00-06',
    'scheduled', 'Vía: Recepción'
  WHERE p_sotto IS NOT NULL AND s_neuro IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Alex T.'),
    p_ruiz, s_trauma,
    '2026-04-08 13:00:00-06', '2026-04-08 13:40:00-06',
    'scheduled', 'Vía: App Móvil'
  WHERE p_ruiz IS NOT NULL AND s_trauma IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Elena R.'),
    p_valdes, s_cardio,
    '2026-04-09 09:00:00-06', '2026-04-09 09:40:00-06',
    'scheduled', 'Lugar: Consultorio B'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Patricia N.'),
    p_mendez, s_general,
    '2026-04-09 16:00:00-06', '2026-04-09 16:30:00-06',
    'scheduled', 'Lugar: Consultorio D'
  WHERE p_mendez IS NOT NULL AND s_general IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Sofía B.'),
    p_sotto, s_neuro,
    '2026-04-10 08:00:00-06', '2026-04-10 08:50:00-06',
    'scheduled', 'Vía: IA-Web'
  WHERE p_sotto IS NOT NULL AND s_neuro IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Miguel R.'),
    p_ruiz, s_postop,
    '2026-04-10 10:00:00-06', '2026-04-10 10:45:00-06',
    'scheduled', 'Vía: Portal Web'
  WHERE p_ruiz IS NOT NULL AND s_postop IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Ana Gómez'),
    p_ruiz, s_trauma,
    '2026-04-11 08:00:00-06', '2026-04-11 08:40:00-06',
    'scheduled', 'Lugar: Sala OR-2'
  WHERE p_ruiz IS NOT NULL AND s_trauma IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Laura S.'),
    p_valdes, s_cardio,
    '2026-04-11 13:00:00-06', '2026-04-11 13:40:00-06',
    'scheduled', 'Lugar: Consultorio A'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

  -- Semana siguiente (14–18 Abr)
  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='María P.'),
    p_valdes, s_general,
    '2026-04-14 09:00:00-06', '2026-04-14 09:30:00-06',
    'pending', 'Vía: Portal Web'
  WHERE p_valdes IS NOT NULL AND s_general IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='José M.'),
    p_sotto, s_neuro,
    '2026-04-15 10:00:00-06', '2026-04-15 10:50:00-06',
    'pending', 'Vía: IA-Web'
  WHERE p_sotto IS NOT NULL AND s_neuro IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Luisa V.'),
    p_ruiz, s_trauma,
    '2026-04-15 14:00:00-06', '2026-04-15 14:40:00-06',
    'pending', 'Lugar: Consultorio B'
  WHERE p_ruiz IS NOT NULL AND s_trauma IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Andrés K.'),
    p_mendez, s_general,
    '2026-04-16 09:00:00-06', '2026-04-16 09:30:00-06',
    'pending', 'Lugar: Consultorio C'
  WHERE p_mendez IS NOT NULL AND s_general IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Ana B.'),
    p_valdes, s_cardio,
    '2026-04-16 15:00:00-06', '2026-04-16 15:40:00-06',
    'pending', 'Vía: IA-Web'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Sofía L.'),
    p_mendez, s_ped,
    '2026-04-17 08:00:00-06', '2026-04-17 08:30:00-06',
    'pending', 'Lugar: Consultorio C'
  WHERE p_mendez IS NOT NULL AND s_ped IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Fernando H.'),
    p_sotto, s_neuro,
    '2026-04-18 09:00:00-06', '2026-04-18 09:50:00-06',
    'pending', 'Vía: Recepción'
  WHERE p_sotto IS NOT NULL AND s_neuro IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Valentina R.'),
    p_valdes, s_cardio,
    '2026-04-18 13:00:00-06', '2026-04-18 13:40:00-06',
    'pending', 'Vía: IA-Web'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

  -- Citas de patient-data.json (pasadas / próximas de los pacientes principales)
  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Carlos Méndez'),
    p_ruiz, s_postop,
    '2024-02-05 11:30:00-06', '2024-02-05 12:15:00-06',
    'completed', 'Post-operatorio rodilla'
  WHERE p_ruiz IS NOT NULL AND s_postop IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Javier Ortiz'),
    p_sotto, s_neuro,
    '2024-02-20 10:00:00-06', '2024-02-20 10:50:00-06',
    'completed', 'Revisión RM columna'
  WHERE p_sotto IS NOT NULL AND s_neuro IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Mariana Torres'),
    p_valdes, s_general,
    '2026-04-15 10:00:00-06', '2026-04-15 10:30:00-06',
    'pending', 'Control diabetes'
  WHERE p_valdes IS NOT NULL AND s_general IS NOT NULL;

  INSERT INTO public.appointments (clinic_id, patient_id, provider_id, service_id, start_time, end_time, status, notes)
  SELECT 3,
    (SELECT id FROM public.patients WHERE clinic_id=3 AND name='Roberto Aguilar'),
    p_valdes, s_cardio,
    '2026-04-08 08:00:00-06', '2026-04-08 08:40:00-06',
    'pending', 'Seguimiento dolor torácico'
  WHERE p_valdes IS NOT NULL AND s_cardio IS NOT NULL;

END $$;

-- ============================================================
-- 7. WHATSAPP SESSION (ejemplo de sesión activa del agente IA)
-- ============================================================
INSERT INTO public.whatsapp_sessions (phone, history, updated_at)
VALUES
  ('+525512345678', '[
    {"role": "assistant", "content": "¡Hola! Soy su VitalAgent. ¿Cómo puedo ayudarle con su salud hoy?"},
    {"role": "user",      "content": "Me gustaría programar una cita de seguimiento con el Dr. Ruiz para mi rodilla."},
    {"role": "assistant", "content": "Veo que el Dr. Mateo Ruiz tiene disponibilidad esta semana. ¿Le conviene el miércoles 15 de abril a las 14:00?"},
    {"role": "user",      "content": "Sí, perfecto."},
    {"role": "assistant", "content": "Listo, su cita ha sido agendada para el miércoles 15 de abril a las 14:00 con el Dr. Mateo Ruiz."}
  ]'::jsonb, timezone('utc', now())),
  ('+525567890123', '[
    {"role": "assistant", "content": "¡Hola! Soy su VitalAgent. ¿Cómo puedo ayudarle con su salud hoy?"},
    {"role": "user",      "content": "Quiero saber el resultado de mi última cita."},
    {"role": "assistant", "content": "Su última visita fue el 1 de marzo con motivo de Control de Diabetes. ¿Desea agendar su próximo control?"}
  ]'::jsonb, timezone('utc', now()))
ON CONFLICT (phone) DO NOTHING;
