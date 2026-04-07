import { client } from '@/lib/supabase/client';
import { UserPreferences, BillingInfo } from '@/types/models';

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

export async function getPreferences(): Promise<UserPreferences> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return {
      notifications: [
        { id: 'email', label: 'Email', description: 'Recibir notificaciones por correo', defaultChecked: true },
        { id: 'push', label: 'Push', description: 'Recibir notificaciones push', defaultChecked: true },
      ],
    };
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return {
      notifications: [
        { id: 'email', label: 'Email', description: 'Recibir notificaciones por correo', defaultChecked: true },
        { id: 'push', label: 'Push', description: 'Recibir notificaciones push', defaultChecked: true },
      ],
    };
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('notifications_email, notifications_push')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error cargando preferencias:', error.message);
    return {
      notifications: [
        { id: 'email', label: 'Email', description: 'Recibir notificaciones por correo', defaultChecked: true },
        { id: 'push', label: 'Push', description: 'Recibir notificaciones push', defaultChecked: true },
      ],
    };
  }

  return {
    notifications: [
      {
        id: 'email',
        label: 'Email',
        description: 'Recibir notificaciones por correo',
        defaultChecked: data?.notifications_email ?? true,
      },
      {
        id: 'push',
        label: 'Push',
        description: 'Recibir notificaciones push',
        defaultChecked: data?.notifications_push ?? true,
      },
    ],
  };
}

export async function getBillingInfo(): Promise<BillingInfo> {
  const supabase = ensureClient();
  if (!supabase) {
    // Fallback to mock data
    return {
      plan: 'Plan de prueba',
      cardType: 'Test Card',
      cardNumberHidden: '1234',
      cardExpiry: '12/26',
      nextChargeDate: '2026-05-15',
      priceMonthly: '$0',
    };
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return {
      plan: 'Plan Estándar',
      cardType: 'Visa',
      cardNumberHidden: '•••• 4242',
      cardExpiry: '12/26',
      nextChargeDate: '2026-05-15',
      priceMonthly: '$129',
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('clinic_id')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('Error cargando perfil para facturación:', profileError.message);
  }

  return {
    plan: 'Plan Estándar',
    cardType: 'Visa',
    cardNumberHidden: '•••• 4242',
    cardExpiry: '12/26',
    nextChargeDate: '2026-05-15',
    priceMonthly: '$129',
  };
}

export async function updatePreferences(prefs: UserPreferences): Promise<void> {
  const userId = await getSessionUserId();
  const supabase = ensureClient();

  if (!userId) {
    console.warn('No hay usuario autenticado para actualizar preferencias.');
    return;
  }

  const [emailPref, pushPref] = prefs.notifications;

  const { error } = await supabase!.from('user_preferences').upsert({
    id: userId,
    notifications_email: emailPref?.defaultChecked ?? true,
    notifications_push: pushPref?.defaultChecked ?? true,
  });

  if (error) {
    console.error('Error actualizando preferencias:', error.message);
  }
}
