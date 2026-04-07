# Guía de Configuración Backend (Supabase)

Esta guía detalla la estructura necesaria en Supabase para que el frontend de **Clinical Sanctuary** pase de datos "mock" a datos reales sin cambios en la UI.

## 1. Mapeo de Servicios a Tablas

| Servicio Frontend | Tabla / Acción Supabase | Notas |
| :--- | :--- | :--- |
| `auth.service.ts` | `auth.users` + `profiles` | Perfiles de médicos y personal. |
| `clinic.service.ts` | `organizations` | Datos persistentes de la clínica/entidad. |
| `patient.service.ts` | `patients` | Registro clínico de pacientes. |
| `staff.service.ts` | `staff` | Directorio de personal médico y administrativo. |
| `calendar.service.ts` | `appointments` | Gestión de citas y disponibilidad. |
| `agent.service.ts` | `agent_configs` | Identidad, tono y configuración de la IA. |
| `dashboard.service.ts` | Views: `v_daily_stats` | Recomendado usar Vistas para métricas agregadas. |
| `settings.service.ts` | `user_preferences` | Preferencias de UI y notificaciones. |

---

## 2. Esquema SQL Sugerido (Prototipo)

Puede ejecutar esto en el editor SQL de Supabase para inicializar la base de datos:

```sql
-- 1. Organizaciones (Clínicas)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand_name TEXT,
  slogan TEXT,
  specialty TEXT,
  logo TEXT,
  description TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Perfiles de Usuario (Extensión de Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  full_name TEXT,
  role TEXT,
  photo_url TEXT,
  email TEXT UNIQUE,
  organization_id UUID REFERENCES organizations(id)
);

-- 3. Pacientes
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  last_visit DATE,
  next_appointment TIMESTAMPTZ,
  category TEXT DEFAULT 'Seguimiento', -- 'Nuevo', 'Crítico', 'Seguimiento'
  avatar_url TEXT
);

-- 4. Citas (Calendario)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  staff_id UUID REFERENCES profiles(id),
  title TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'confirmed', 'cancelled', 'completed'
  type TEXT DEFAULT 'IA Managed' -- 'Manual', 'IA Managed'
);

-- 5. Configuración de Agente IA
CREATE TABLE agent_configs (
  organization_id UUID REFERENCES organizations(id) PRIMARY KEY,
  greeting_message TEXT,
  timezone TEXT DEFAULT 'UTC',
  tone TEXT DEFAULT 'Profesional',
  language TEXT DEFAULT 'Español'
);
```

---

## 3. Notas de Integración Frontend

Cada servicio en `src/services/` tiene un comentario `@TODO` que indica qué tabla o vista debe consultar.

### Ejemplo de refactorización (`patient.service.ts`):
```typescript
// ANTES (Mock)
export async function getPatients() { ... }

// DESPUÉS (Supabase)
import { supabase } from '@/lib/supabase';
export async function getPatients() {
  const { data } = await supabase.from('patients').select('*');
  return data;
}
```

> [!TIP]
> Use **Row Level Security (RLS)** en Supabase para asegurar que los médicos solo vean pacientes de su propia `organization_id`.
