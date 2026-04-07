export type AvailabilitySlot = {
  start: string;
  end: string;
  providerId?: number;
};

export type CalendarEventInput = {
  clinicId: number;
  providerId?: number;
  calendarId?: string | null;
  serviceName: string;
  patientName: string;
  start: string;
  end: string;
  notes?: string | null;
  externalEventId?: string | null;
};

export type ReminderMessageInput = {
  phone?: string | null;
  body: string;
};

export interface CalendarAdapter {
  listAvailability(input: {
    clinicId: number;
    providerId?: number;
    start?: string;
    end?: string;
  }): Promise<AvailabilitySlot[]>;
  createEvent(
    input: CalendarEventInput,
  ): Promise<{ externalEventId: string | null }>;
  updateEvent(
    input: CalendarEventInput,
  ): Promise<{ externalEventId: string | null }>;
  deleteEvent(input: {
    calendarId?: string | null;
    externalEventId?: string | null;
  }): Promise<void>;
}

export interface ReminderAdapter {
  sendMessage(input: ReminderMessageInput): Promise<{
    delivered: boolean;
    provider: 'twilio' | 'mock';
  }>;
}

function buildMockSlots(
  start?: string,
  providerId?: number,
): AvailabilitySlot[] {
  const anchor = start ? new Date(start) : new Date();
  anchor.setMinutes(0, 0, 0);

  return [0, 1, 2].map((offset) => {
    const slotStart = new Date(anchor);
    slotStart.setHours(anchor.getHours() + offset + 1);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    return {
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      providerId,
    };
  });
}

class MockCalendarAdapter implements CalendarAdapter {
  async listAvailability(input: {
    clinicId: number;
    providerId?: number;
    start?: string;
  }) {
    return buildMockSlots(input.start, input.providerId);
  }

  async createEvent(_input: CalendarEventInput) {
    return { externalEventId: `mock_evt_${crypto.randomUUID()}` };
  }

  async updateEvent(input: CalendarEventInput) {
    return {
      externalEventId:
        input.externalEventId ?? `mock_evt_${crypto.randomUUID()}`,
    };
  }

  async deleteEvent(_input: {
    calendarId?: string | null;
    externalEventId?: string | null;
  }) {
    return;
  }
}

class GoogleCalendarAdapter implements CalendarAdapter {
  private readonly accessToken = Deno.env.get('GOOGLE_CALENDAR_ACCESS_TOKEN')!;

  private async request(path: string, init?: RequestInit) {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3${path}`,
      {
        ...init,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Google Calendar request failed: ${response.status} ${await response.text()}`,
      );
    }

    return response.json();
  }

  async listAvailability(input: {
    clinicId: number;
    providerId?: number;
    start?: string;
    end?: string;
  }) {
    if (!input.start || !input.end) {
      return buildMockSlots(input.start, input.providerId);
    }

    const calendarId = Deno.env.get('GOOGLE_CALENDAR_DEFAULT_ID');

    if (!calendarId) {
      return buildMockSlots(input.start, input.providerId);
    }

    const payload = await this.request('/freeBusy', {
      method: 'POST',
      body: JSON.stringify({
        timeMin: input.start,
        timeMax: input.end,
        items: [{ id: calendarId }],
      }),
    });

    const busy = payload.calendars?.[calendarId]?.busy ?? [];

    if (busy.length > 0) {
      return [];
    }

    return buildMockSlots(input.start, input.providerId);
  }

  async createEvent(input: CalendarEventInput) {
    if (!input.calendarId) {
      return { externalEventId: `mock_evt_${crypto.randomUUID()}` };
    }

    const payload = await this.request(
      `/calendars/${encodeURIComponent(input.calendarId)}/events`,
      {
        method: 'POST',
        body: JSON.stringify({
          summary: `${input.serviceName} · ${input.patientName}`,
          description: input.notes ?? undefined,
          start: { dateTime: input.start },
          end: { dateTime: input.end },
        }),
      },
    );

    return {
      externalEventId: payload.id ?? null,
    };
  }

  async updateEvent(input: CalendarEventInput) {
    if (!input.calendarId || !input.externalEventId) {
      return {
        externalEventId:
          input.externalEventId ?? `mock_evt_${crypto.randomUUID()}`,
      };
    }

    const payload = await this.request(
      `/calendars/${encodeURIComponent(input.calendarId)}/events/${encodeURIComponent(input.externalEventId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          summary: `${input.serviceName} · ${input.patientName}`,
          description: input.notes ?? undefined,
          start: { dateTime: input.start },
          end: { dateTime: input.end },
        }),
      },
    );

    return {
      externalEventId: payload.id ?? input.externalEventId,
    };
  }

  async deleteEvent(input: {
    calendarId?: string | null;
    externalEventId?: string | null;
  }) {
    if (!input.calendarId || !input.externalEventId) {
      return;
    }

    await this.request(
      `/calendars/${encodeURIComponent(input.calendarId)}/events/${encodeURIComponent(input.externalEventId)}`,
      { method: 'DELETE' },
    );
  }
}

class MockReminderAdapter implements ReminderAdapter {
  async sendMessage(_input: ReminderMessageInput) {
    return {
      delivered: false,
      provider: 'mock' as const,
    };
  }
}

class TwilioReminderAdapter implements ReminderAdapter {
  private readonly sid = Deno.env.get('TWILIO_ACCOUNT_SID')!;
  private readonly token = Deno.env.get('TWILIO_AUTH_TOKEN')!;
  private readonly from =
    Deno.env.get('TWILIO_WHATSAPP_NUMBER') ??
    Deno.env.get('TWILIO_SMS_NUMBER')!;

  async sendMessage(input: ReminderMessageInput) {
    if (!input.phone) {
      return {
        delivered: false,
        provider: 'twilio' as const,
      };
    }

    const auth = btoa(`${this.sid}:${this.token}`);
    const payload = new URLSearchParams({
  To: this.from.startsWith('whatsapp:') && !input.phone.startsWith('whatsapp:')
    ? `whatsapp:${input.phone}`
    : input.phone,
  From: this.from,
  Body: input.body,
});

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Twilio request failed: ${response.status} ${await response.text()}`,
      );
    }

    return {
      delivered: true,
      provider: 'twilio' as const,
    };
  }
}

export function createCalendarAdapter(): CalendarAdapter {
  return Deno.env.get('GOOGLE_CALENDAR_ACCESS_TOKEN')
    ? new GoogleCalendarAdapter()
    : new MockCalendarAdapter();
}

export function createReminderAdapter(): ReminderAdapter {
  return Deno.env.get('TWILIO_ACCOUNT_SID') &&
    Deno.env.get('TWILIO_AUTH_TOKEN') &&
    (Deno.env.get('TWILIO_WHATSAPP_NUMBER') ||
      Deno.env.get('TWILIO_SMS_NUMBER'))
    ? new TwilioReminderAdapter()
    : new MockReminderAdapter();
}
