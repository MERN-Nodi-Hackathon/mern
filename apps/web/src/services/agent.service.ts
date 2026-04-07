import { client } from '@/lib/supabase/client';
import { AgentIdentity, AgentMetrics, ChatMessage } from '@/types/models';

function ensureClient() {
  if (!client) {
    return null;
  }
  return client;
}

async function getSessionUserId(): Promise<string | null> {
  const supabase = ensureClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error obteniendo sesión:', error.message);
    return null;
  }
  return data.session?.user?.id ?? null;
}

async function getProfile(userId: string) {
  const supabase = ensureClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) {
    console.error('Error obteniendo el perfil del usuario:', error.message);
    return null;
  }
  return data as any;
}

async function getClinic(clinicId: number) {
  const supabase = ensureClient();
  const { data, error } = await supabase!.from('clinics').select('*').eq('id', clinicId).maybeSingle();
  if (error) {
    console.error('Error obteniendo la clínica:', error.message);
    return null;
  }
  return data as any;
}

async function getClinicIdForUser(userId: string): Promise<number | null> {
  const profile = await getProfile(userId);
  return profile?.clinic_id ?? null;
}

export async function getAgentIdentity(): Promise<AgentIdentity> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return {
      greetingMessage: 'Hola, soy el asistente de prueba de Doctor 1.',
      timezone: 'America/Bogota',
      tone: 'professional',
      language: 'es',
    };
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return {
      greetingMessage: 'Hola, soy su asistente médico inteligente.',
      timezone: 'America/Bogota',
      tone: 'professional',
      language: 'es',
    };
  }

  const profile = await getProfile(userId);
  const clinicId = await getClinicIdForUser(userId);
  const clinic = clinicId ? await getClinic(clinicId) : null;

  return {
    greetingMessage: `Hola, soy el asistente de ${clinic?.brand_name ?? clinic?.name ?? 'su clínica'}. ¿En qué puedo ayudarte hoy?`,
    timezone: clinic?.timezone ?? 'America/Bogota',
    tone: 'professional',
    language: 'es',
  };
}

export async function getAgentMetrics(): Promise<AgentMetrics> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return {
      hceStatus: 'Operativo',
      avgLatencyMs: 120,
      modelVersion: 'v1.0',
      uptime: '99.8%',
    };
  }

  const userId = await getSessionUserId();
  const clinicId = userId ? await getClinicIdForUser(userId) : null;

  const [totalResult, scheduledResult, pendingResult] = await Promise.all([
    clinicId
      ? supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId)
      : Promise.resolve({ count: 0 }),
    clinicId
      ? supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).eq('status', 'scheduled')
      : Promise.resolve({ count: 0 }),
    clinicId
      ? supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', clinicId).eq('status', 'pending')
      : Promise.resolve({ count: 0 }),
  ]);

  return {
    hceStatus: 'Operativo',
    avgLatencyMs: 120,
    modelVersion: 'v1.0',
    uptime: '99.8%',
  };
}

export async function getPreviewConversation(): Promise<ChatMessage[]> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return [
      { id: 'mock-chat-1', role: 'bot', text: 'Hola, este es un mensaje de prueba para datos mock.' },
      { id: 'mock-chat-2', role: 'user', text: '¿Cuál es el estado de Doctor 1?' },
      { id: 'mock-chat-3', role: 'bot', text: 'Esta conversación es de ejemplo, no está usando el BD.' },
    ];
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return [
      { id: '1', role: 'bot', text: 'Hola, estoy listo para ayudarte a gestionar tu clínica con datos en tiempo real.' },
      { id: '2', role: 'user', text: 'Muéstrame el estado de la agenda.' },
      { id: '3', role: 'bot', text: 'Ahora mismo no hay citas cargadas. Configura tu perfil y agenda para comenzar.' },
    ];
  }

  const clinicId = await getClinicIdForUser(userId);
  if (!clinicId) {
    return [
      { id: '1', role: 'bot', text: 'No pude cargar la clínica vinculada. Por favor, revisa tu sesión.' },
    ];
  }
  const { data, error } = await supabase
    .from('appointments')
    .select('start_time, status, patient:patients!inner(name), service:services!inner(name), provider:providers!inner(name)')
    .eq('clinic_id', clinicId)
    .order('start_time', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return [
      { id: '1', role: 'bot', text: 'No se encontraron citas recientes para mostrar una conversación de ejemplo.' },
    ];
  }

  const appointmentDate = new Date(data.start_time).toLocaleString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return [
    { id: '1', role: 'bot', text: `He cargado la última cita del paciente ${(data.patient as any)?.name ?? 'desconocido'} para ${appointmentDate}.` },
    { id: '2', role: 'user', text: '¿Está confirmada esa consulta?' },
    { id: '3', role: 'bot', text: `Sí, la cita está en estado ${data.status}. El servicio es ${(data.service as any)?.name ?? 'no disponible'} con ${(data.provider as any)?.name ?? 'el proveedor asignado'}.` },
  ];
}

export async function getToneOptions() {
  return [
    { id: 'professional', label: 'Profesional y Empático' },
    { id: 'concise', label: 'Directo y Conciso' },
    { id: 'friendly', label: 'Cercano y Amigable' },
  ];
}

export async function getTimezoneOptions() {
  return [
    { id: 'America/Mexico_City', label: 'Mexico City (CST)' },
    { id: 'America/New_York', label: 'New York (EST)' },
    { id: 'Europe/Madrid', label: 'Madrid (CET)' },
    { id: 'UTC', label: 'UTC' },
  ];
}

export async function getLanguageOptions() {
  return [
    { id: 'es', label: 'Español (ES)' },
    { id: 'en', label: 'English (US)' },
    { id: 'pt', label: 'Português (BR)' },
  ];
}
