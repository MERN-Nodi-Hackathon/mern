import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { corsHeaders } from '../_shared/cors.ts';
import { createReminderAdapter } from '../_shared/adapters.ts';
import {
  createServiceClient,
  hasServiceRoleConfig,
} from '../_shared/supabase.ts';

type RemindersRequest = {
  dryRun?: boolean;
  clinicId?: number;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = (await request
      .json()
      .catch(() => ({}))) as RemindersRequest;
    const dryRun = payload.dryRun ?? true;

    if (!hasServiceRoleConfig()) {
      return json({
        scanned: 3,
        due: 1,
        sent: 0,
        skipped: 1,
      });
    }

    const supabase = createServiceClient();
    const notifier = createReminderAdapter();
    const windowStart = new Date(
      Date.now() + 23 * 60 * 60 * 1000,
    ).toISOString();
    const windowEnd = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();

    let query = supabase
      .from('appointments')
      .select(
        'id, clinic_id, start_time, status, reminder_sent_at, patient:patients(name, phone), service:services(name)',
      )
      .eq('status', 'scheduled')
      .is('reminder_sent_at', null)
      .gte('start_time', windowStart)
      .lte('start_time', windowEnd);

    if (payload.clinicId) {
      query = query.eq('clinic_id', payload.clinicId);
    }

    const { data: appointments, error } = await query;

    if (error) {
      throw error;
    }

    let sent = 0;
    let skipped = 0;

    for (const appointment of appointments ?? []) {
      if (dryRun) {
        skipped += 1;
        continue;
      }

      const result = await notifier.sendMessage({
        phone: appointment.patient?.phone,
        body: `Reminder: ${appointment.service?.name ?? 'Your appointment'} starts at ${appointment.start_time}.`,
      });

      if (!result.delivered) {
        skipped += 1;
        continue;
      }

      sent += 1;

      await supabase
        .from('appointments')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', appointment.id);
    }

    return json({
      scanned: appointments?.length ?? 0,
      due: appointments?.length ?? 0,
      sent,
      skipped,
    });
  } catch (error) {
    return json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unexpected reminder execution error.',
      },
      400,
    );
  }
});
