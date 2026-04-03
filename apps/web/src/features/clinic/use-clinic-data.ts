import { useEffect, useState } from 'react';

import {
  type Appointment,
  AppointmentSchema,
  type Clinic,
  type Patient,
  PatientSchema,
  type Provider,
  ProviderSchema,
  type Service,
  ServiceSchema,
} from '@mern/shared';
import { z } from 'zod';

import { demoAppointments, demoClinic, demoPatients, demoProviders, demoServices } from '@/lib/demo-data';
import { useAuth } from '@/lib/supabase/auth-context';

type ClinicDataSnapshot = {
  clinic: Clinic;
  providers: Provider[];
  services: Service[];
  patients: Patient[];
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  usingDemo: boolean;
};

const emptySnapshot: ClinicDataSnapshot = {
  clinic: demoClinic,
  providers: [],
  services: [],
  patients: [],
  appointments: [],
  loading: false,
  error: null,
  usingDemo: false,
};

export function useClinicData(): ClinicDataSnapshot {
  const { client, clinic, isConfigured, user } = useAuth();
  const [snapshot, setSnapshot] = useState<ClinicDataSnapshot>(() =>
    isConfigured
      ? emptySnapshot
      : {
          clinic: demoClinic,
          providers: demoProviders,
          services: demoServices,
          patients: demoPatients,
          appointments: demoAppointments,
          loading: false,
          error: null,
          usingDemo: true,
        },
  );

  useEffect(() => {
    if (!isConfigured) {
      setSnapshot({
        clinic: demoClinic,
        providers: demoProviders,
        services: demoServices,
        patients: demoPatients,
        appointments: demoAppointments,
        loading: false,
        error: null,
        usingDemo: true,
      });
      return;
    }

    if (!client || !clinic || !user) {
      setSnapshot((current) => ({
        ...current,
        clinic: clinic ?? current.clinic,
        loading: false,
      }));
      return;
    }

    let cancelled = false;
    const supabaseClient = client;
    const activeClinic = clinic;

    async function loadClinicData() {
      setSnapshot((current) => ({
        ...current,
        loading: true,
        error: null,
        clinic: activeClinic,
      }));

      try {
        const [providersResponse, servicesResponse, patientsResponse, appointmentsResponse] =
          await Promise.all([
            supabaseClient.from('providers').select('*').eq('clinic_id', activeClinic.id).order('name'),
            supabaseClient.from('services').select('*').eq('clinic_id', activeClinic.id).order('name'),
            supabaseClient.from('patients').select('*').eq('clinic_id', activeClinic.id).order('name'),
            supabaseClient
              .from('appointments')
              .select('*')
              .eq('clinic_id', activeClinic.id)
              .order('start_time', { ascending: true }),
          ]);

        const queryError =
          providersResponse.error ??
          servicesResponse.error ??
          patientsResponse.error ??
          appointmentsResponse.error;

        if (queryError) {
          throw queryError;
        }

        const nextSnapshot: ClinicDataSnapshot = {
          clinic: activeClinic,
          providers: z.array(ProviderSchema).parse(providersResponse.data ?? []),
          services: z.array(ServiceSchema).parse(servicesResponse.data ?? []),
          patients: z.array(PatientSchema).parse(patientsResponse.data ?? []),
          appointments: z.array(AppointmentSchema).parse(appointmentsResponse.data ?? []),
          loading: false,
          error: null,
          usingDemo: false,
        };

        if (!cancelled) {
          setSnapshot(nextSnapshot);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unable to load clinic data.';

        setSnapshot({
          clinic: activeClinic,
          providers: demoProviders,
          services: demoServices,
          patients: demoPatients,
          appointments: demoAppointments,
          loading: false,
          error: message,
          usingDemo: true,
        });
      }
    }

    void loadClinicData();

    return () => {
      cancelled = true;
    };
  }, [clinic, client, isConfigured, user]);

  return snapshot;
}
