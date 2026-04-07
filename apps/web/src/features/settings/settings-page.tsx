import { useState, useEffect } from 'react';
import {
  Building2,
  Bell,
  ShieldCheck,
  Wallet,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { SectionIconCard } from '@/components/ui/section-icon-card';
import { getCompanyInfo, getCurrentUser } from '@/services/auth.service';
import { getPreferences, getBillingInfo } from '../../services/settings.service';
import { Clinic, User, UserPreferences, BillingInfo } from '@/types/models';

interface ToggleRowProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

/** Fila de toggle reutilizable dentro del panel de Notificaciones */
function ToggleRow({ label, description, defaultChecked = false }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-base font-bold text-on-surface">{label}</p>
        <p className="text-xs font-medium text-on-surface-variant mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-12 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner" />
      </label>
    </div>
  );
}

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<Clinic | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [billing, setBilling] = useState<BillingInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [comp, pref, bill] = await Promise.all([
        getCompanyInfo(),
        getPreferences(),
        getBillingInfo()
      ]);
      setCompany(comp);
      setPreferences(pref);
      setBilling(bill);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-[1400px] mx-auto min-h-screen pb-10 gap-8">
        <div className="h-20 animate-pulse bg-surface-container-low rounded-3xl w-full" />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 h-96 animate-pulse bg-surface-container-low rounded-3xl" />
          <div className="col-span-4 h-96 animate-pulse bg-surface-container-low rounded-3xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto min-h-screen pb-10">
      <PageHeader
        title="Panel de Control"
        description="Gestione la identidad, seguridad y operativa de su clínica."
        action={
          <Button className="bg-linear-to-br from-tertiary to-tertiary-container text-white px-8 py-6 rounded-xl font-bold shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-95 transition-all text-base">
            <Save className="w-5 h-5 mr-2" />
            Guardar Cambios
          </Button>
        }
      />

      <div className="grid grid-cols-12 gap-8">

        {/* Información de la Clínica */}
        <SectionIconCard
          icon={Building2}
          title="Información de la Clínica"
          className="col-span-12 lg:col-span-8"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Nombre de la Clínica</Label>
              <Input className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface text-base" defaultValue={company?.name} />
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Especialidad Principal</Label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface appearance-none text-base outline-none cursor-pointer"
                  defaultValue={company?.shortName} // Using shortName as placeholder for specialty if not in CompanyInfo
                >
                  <option value="Medicina Interna">Medicina Interna</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Pediatría">Pediatría</option>
                  <option value="Neurología">Neurología</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Correo Electrónico</Label>
              <Input type="email" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface text-base" defaultValue={company?.address} /> // Placeholder email mapping
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Teléfono de Contacto</Label>
              <Input type="tel" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface text-base" defaultValue="+52 55 1234 5678" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Dirección Física</Label>
              <Input className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface text-base" defaultValue={company?.address} />
            </div>
          </div>
        </SectionIconCard>

        {/* Notificaciones */}
        <SectionIconCard
          icon={Bell}
          title="Notificaciones"
          className="col-span-12 lg:col-span-4"
        >
          <div className="space-y-8">
            {preferences?.notifications.map((t) => (
              <ToggleRow key={t.label} {...t} />
            ))}
          </div>
        </SectionIconCard>

        {/* Seguridad */}
        <SectionIconCard
          icon={ShieldCheck}
          title="Seguridad"
          className="col-span-12 lg:col-span-6"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Contraseña Actual</Label>
              <Input type="password" placeholder="••••••••••••" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface text-base" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Nueva Contraseña</Label>
                <Input type="password" placeholder="Nueva contraseña" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Confirmar</Label>
                <Input type="password" placeholder="Confirmar contraseña" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 font-medium text-on-surface text-base" />
              </div>
            </div>
          </div>
        </SectionIconCard>

        {/* Facturación */}
        <SectionIconCard
          icon={Wallet}
          title="Facturación"
          className="col-span-12 lg:col-span-6 flex flex-col"
          titleAddon={
            <span className="px-3 py-1 bg-tertiary-container/10 text-tertiary font-bold text-[10px] uppercase tracking-wider rounded-full">
              {billing?.plan}
            </span>
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/5">
              <div className="w-14 h-9 bg-surface-container-high rounded-md mr-5 flex items-center justify-center font-black text-on-surface-variant text-[11px] tracking-widest shadow-sm">
                {billing?.cardType}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-on-surface">Termina en {billing?.cardNumberHidden}</p>
                <p className="text-[13px] text-on-surface-variant font-medium mt-0.5">Expira {billing?.cardExpiry}</p>
              </div>
              <Button variant="link" className="text-primary font-bold text-sm tracking-wide">Cambiar</Button>
            </div>
            <div className="flex items-center justify-between text-[15px] px-2">
              <span className="text-on-surface-variant font-medium">Próximo cargo: {billing?.nextChargeDate}</span>
              <span className="font-black text-on-surface text-lg">
                {billing?.priceMonthly} <span className="text-sm font-medium text-on-surface-variant">/ mes</span>
              </span>
            </div>
          </div>
        </SectionIconCard>

      </div>
    </div>
  );
}
