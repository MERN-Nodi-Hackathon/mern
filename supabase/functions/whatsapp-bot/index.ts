import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient } from '../_shared/supabase.ts';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const TWILIO_FROM = Deno.env.get('TWILIO_WHATSAPP_NUMBER')!;
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;
const BOOKING_FLOW_URL = 'https://zunsdhbhxbyyuyagbrox.supabase.co/functions/v1/booking-flow';
const SUPABASE_SERVICE_KEY = Deno.env.get('DB_SERVICE_ROLE_KEY')!;

// ─── Rate limiting ────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > 60_000) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= 30;
}

// ─── Timezone por prefijo ─────────────────────────────────────────────────────
const timezoneByPrefix: Record<string, string> = {
  '+593': 'America/Guayaquil',
  '+595': 'America/Asuncion',
  '+598': 'America/Montevideo',
  '+591': 'America/La_Paz',
  '+56': 'America/Santiago',
  '+57': 'America/Bogota',
  '+51': 'America/Lima',
  '+54': 'America/Argentina/Buenos_Aires',
  '+58': 'America/Caracas',
  '+52': 'America/Mexico_City',
};

function getTimezoneFromPhone(phone: string): string {
  for (const prefix of Object.keys(timezoneByPrefix).sort((a, b) => b.length - a.length)) {
    if (phone.startsWith(prefix)) return timezoneByPrefix[prefix];
  }
  return 'America/Bogota';
}

function formatLocalTime(isoString: string, timezone: string) {
  const d = new Date(isoString);
  return {
    fecha: d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: timezone }),
    hora: d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', timeZone: timezone }),
  };
}

// ─── Twilio ───────────────────────────────────────────────────────────────────
async function sendWhatsApp(to: string, body: string) {
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: TWILIO_FROM, To: to, Body: body }),
    },
  );
  if (!res.ok) console.error('Twilio error:', await res.text());
}

// ─── Booking Flow ─────────────────────────────────────────────────────────────
async function callBookingFlow(intent: string, params: Record<string, unknown>) {
  const res = await fetch(BOOKING_FLOW_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
    body: JSON.stringify({ intent, ...params }),
  });
  return res.json();
}

// ─── Gemini ───────────────────────────────────────────────────────────────────
async function askGemini(history: { role: string; content: string }[], userMessage: string, context: string) {
  const systemPrompt = `Eres un asistente de agendamiento de clínicas médicas. Responde SIEMPRE en español, de forma amable y concisa.

CONTEXTO ACTUAL:
${context}

REGLAS DE REGISTRO (paciente nuevo):
- Si el paciente NO está registrado, ANTES de agendar obtén:
  1. Nombre completo → pregunta solo esto primero
  2. Correo electrónico → pregunta después (opcional, puedes continuar sin él)
- Haz UNA sola pregunta a la vez
- NUNCA inventes datos del paciente

REGLAS DE ZONAS HORARIAS:
- El paciente habla en su hora local (timezone indicada en el contexto)
- Convierte SIEMPRE la hora local del paciente a UTC para el JSON
- Ejemplo: paciente en Santiago (UTC-3) dice "17:00" → requestedStart con "T20:00:00.000Z"
- Usa el offset del día exacto (puede variar por horario de verano)

REGLAS DE AGENDAMIENTO:
1. Cuando el paciente elija un servicio, muestra SOLO los proveedores que ofrecen ese servicio
2. Con servicio + proveedor + fecha/hora + datos del paciente → responde SOLO el JSON
3. Si dice "mañana en la tarde" → usa 15:00 hora local convertida a UTC
4. Haz UNA sola pregunta si falta información que no puedes inferir
5. NUNCA repitas una pregunta ya respondida

FORMATOS JSON (sin markdown, sin texto extra):

Disponibilidad:
{"intent":"availability","clinicId":1,"serviceId":2,"providerId":1,"requestedStart":"2026-04-07T18:00:00.000Z"}

Agendar:
{"intent":"book","clinicId":1,"serviceId":2,"providerId":1,"requestedStart":"2026-04-07T20:00:00.000Z","patient":{"name":"Juan Pérez","phone":"+56981497412","email":"juan@mail.com"}}

Cancelar:
{"intent":"cancel","clinicId":1,"appointmentId":4}

Reagendar:
{"intent":"reschedule","clinicId":1,"appointmentId":4,"providerId":1,"serviceId":1,"requestedStart":"2026-04-08T20:00:00.000Z"}`;

  const messages = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.content }] })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: messages,
        generationConfig: { temperature: 0.3 },
      }),
    },
  );

  const data = await res.json();
  console.log('Gemini raw:', JSON.stringify(data));
  if (data.error) throw new Error(`Gemini error: ${data.error.message}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Lo siento, no pude procesar tu mensaje.';
}

// ─── Servidor ─────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const clientIp = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(clientIp)) return new Response('', { status: 429 });

  try {
    const formData = await req.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    if (!from || !body) return new Response('', { status: 200 });

    const phone = from.replace('whatsapp:', '');
    const patientTimezone = getTimezoneFromPhone(phone);
    const supabase = createServiceClient();

    // Detectar clínica por prefijo de teléfono
    const phonePrefix = Object.keys(timezoneByPrefix)
      .sort((a, b) => b.length - a.length)
      .find((p) => phone.startsWith(p)) ?? '+57';

    const { data: clinicData } = await supabase
      .from('clinics')
      .select('id, name, timezone, work_start_hour, work_end_hour, country_code, city')
      .eq('phone_prefix', phonePrefix)
      .maybeSingle();

    // Fallback a clínica 1 si no hay match por prefijo
    const clinicId = clinicData?.id ?? 1;

    const [
      { data: services },
      { data: providers },
      { data: patient },
    ] = await Promise.all([
      supabase.from('services').select('id, name, description, duration_min').eq('clinic_id', clinicId),
      supabase
        .from('providers')
        .select('id, name, specialization, provider_services(service_id)')
        .eq('clinic_id', clinicId),
      supabase.from('patients').select('id, name, phone, email, timezone').eq('clinic_id', clinicId).eq('phone', phone).maybeSingle(),
    ]);

    // Citas próximas del paciente
    let appointments = null;
    if (patient) {
      const { data } = await supabase
        .from('appointments')
        .select('id, start_time, status, service:services(name), provider:providers(name)')
        .eq('clinic_id', clinicId)
        .eq('patient_id', patient.id)
        .in('status', ['scheduled', 'rescheduled'])
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);
      appointments = data;
    }

    const ahora = new Date();
    const horaActualLocal = ahora.toLocaleString('es-CL', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: patientTimezone,
    });

    // Construir lista de providers con sus servicios
    const providersList = (providers ?? []).map((p) => {
      const serviceIds = (p.provider_services as { service_id: number }[])?.map((ps) => ps.service_id) ?? [];
      const providerServiceNames = (services ?? [])
        .filter((s) => serviceIds.includes(s.id))
        .map((s) => s.name)
        .join(', ');
      return `- ID ${p.id}: ${p.name} (${p.specialization}) → servicios: ${providerServiceNames || 'ninguno asignado'}`;
    }).join('\n');

    const context = `
Fecha y hora actual (hora del paciente): ${horaActualLocal}
Fecha y hora UTC: ${ahora.toISOString()}
Timezone del paciente: ${patientTimezone}
Clínica ID: ${clinicId} — ${clinicData?.name ?? 'Nodi Family Clinic'} (${clinicData?.city ?? ''})
Timezone de la clínica: ${clinicData?.timezone ?? 'America/Bogota'}
Horario de atención: ${clinicData?.work_start_hour ?? 8}:00 a ${clinicData?.work_end_hour ?? 18}:00 (hora de la clínica)

Servicios disponibles:
${(services ?? []).map((s) => `- ID ${s.id}: ${s.name}${s.description ? ` — ${s.description}` : ''} (${s.duration_min} min)`).join('\n')}

Proveedores y sus servicios:
${providersList}

Paciente que escribe:
${patient
  ? `- Registrado ✓\n- Nombre: ${patient.name}\n- Teléfono: ${patient.phone}\n- Email: ${patient.email ?? 'no registrado'}\n- ID: ${patient.id}`
  : `- Paciente nuevo (no registrado)\n- Teléfono: ${phone}\n- Debes pedir nombre completo antes de agendar`}

${appointments && appointments.length > 0
  ? `Citas próximas:\n${appointments.map((a) => {
      const { fecha, hora } = formatLocalTime(a.start_time, patientTimezone);
      return `- ID ${a.id}: ${(a.service as { name: string })?.name} con ${(a.provider as { name: string })?.name} el ${fecha} a las ${hora} (${a.status})`;
    }).join('\n')}`
  : 'Sin citas próximas.'}`;

    // Historial
    const { data: sessionData } = await supabase
      .from('whatsapp_sessions')
      .select('history')
      .eq('phone', phone)
      .maybeSingle();

    const history: { role: string; content: string }[] = sessionData?.history ?? [];
    const geminiResponse = await askGemini(history, body, context);

    // Guardar historial
    history.push({ role: 'user', content: body });
    history.push({ role: 'model', content: geminiResponse });
    if (history.length > 12) history.splice(0, 2);
    await supabase.from('whatsapp_sessions').upsert({ phone, history, updated_at: new Date().toISOString() });

    let replyText = geminiResponse;

    try {
      const cleaned = geminiResponse.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.intent) {
        console.log('Ejecutando intent:', parsed.intent, parsed);
        const result = await callBookingFlow(parsed.intent, parsed);
        console.log('Resultado booking-flow:', JSON.stringify(result));

        if (parsed.intent === 'availability') {
          const slots: { start: string }[] = result.candidateSlots ?? [];
          if (slots.length === 0) {
            replyText = 'No encontré horarios disponibles para esa fecha. ¿Quieres intentar con otro día?';
          } else {
            const lista = slots.slice(0, 5).map((s) => {
              const { fecha, hora } = formatLocalTime(s.start, patientTimezone);
              return `• ${fecha} a las ${hora}`;
            }).join('\n');
            replyText = `Estos son los horarios disponibles:\n${lista}\n\n¿Cuál te acomoda?`;
          }
        } else if (parsed.intent === 'book') {
          if (result.status === 'ok' && result.appointment) {
            const { fecha, hora } = formatLocalTime(result.appointment.start_time, patientTimezone);
            replyText = `✅ ¡Cita agendada! Te esperamos el ${fecha} a las ${hora}. Recibirás un recordatorio 24 horas antes.`;
          } else {
            replyText = `No pude agendar la cita: ${result.message ?? 'error desconocido'}. ¿Quieres intentar con otro horario?`;
          }
        } else if (parsed.intent === 'cancel') {
          replyText = result.status === 'ok'
            ? '✅ Tu cita ha sido cancelada. ¿Hay algo más en que pueda ayudarte?'
            : `No pude cancelar la cita: ${result.message ?? 'error desconocido'}`;
        } else if (parsed.intent === 'reschedule') {
          if (result.status === 'ok' && result.appointment) {
            const { fecha, hora } = formatLocalTime(result.appointment.start_time, patientTimezone);
            replyText = `✅ Tu cita fue reagendada para el ${fecha} a las ${hora}.`;
          } else {
            replyText = `No pude reagendar la cita: ${result.message ?? 'error desconocido'}`;
          }
        }
      }
    } catch {
      // No era JSON — usar respuesta de Gemini directo
    }

    await sendWhatsApp(from, replyText);
    return new Response('', { status: 200 });

  } catch (error) {
    console.error('whatsapp-bot error:', error);
    return new Response('', { status: 200 });
  }
});