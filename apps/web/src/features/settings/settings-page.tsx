import { 
  Building2, 
  Bell, 
  ShieldCheck, 
  Wallet, 
  MapPin, 
  Plus, 
  Minus,
  Save
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsPage() {
  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto min-h-screen pb-10">
      
      {/* Section Header & Action */}
      <div className="flex justify-between items-end mb-8 border-b border-outline-variant/10 pb-6">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Panel de Control</h3>
          <p className="text-on-surface-variant mt-1 text-lg">Gestione la identidad, seguridad y operativa de su clínica.</p>
        </div>
        <Button className="bg-linear-to-br from-tertiary to-tertiary-container text-white px-8 py-6 rounded-xl font-bold shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-95 transition-all text-base">
          <Save className="w-5 h-5 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Clinical Information Card (Wide) */}
        <Card className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.03)] border-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-on-surface">Información de la Clínica</h4>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Nombre de la Clínica</Label>
              <Input className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface text-base" defaultValue="Sanctuary Clinical Center" />
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Especialidad Principal</Label>
              <div className="relative">
                <select className="w-full px-4 py-3.5 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface appearance-none text-base outline-none">
                  <option>Medicina Interna</option>
                  <option>Cardiología</option>
                  <option>Pediatría</option>
                  <option>Neurología</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Correo Electrónico</Label>
              <Input type="email" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface text-base" defaultValue="contacto@sanctuaryclinical.com" />
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Teléfono de Contacto</Label>
              <Input type="tel" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface text-base" defaultValue="+34 912 345 678" />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Dirección Física</Label>
              <Input className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface text-base" defaultValue="Paseo de la Castellana 120, 28046 Madrid, España" />
            </div>
          </div>
        </Card>

        {/* Notifications Toggle Card (Narrow) */}
        <Card className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.03)] border-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-on-surface">Notificaciones</h4>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between group">
              <div>
                <p className="text-base font-bold text-on-surface">Alertas Médicas</p>
                <p className="text-[12px] font-medium text-on-surface-variant mt-0.5">Notificar cambios en signos vitales</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="text-base font-bold text-on-surface">Citas Nuevas</p>
                <p className="text-[12px] font-medium text-on-surface-variant mt-0.5">Confirmación de agenda IA</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="text-base font-bold text-on-surface">Seguridad</p>
                <p className="text-[12px] font-medium text-on-surface-variant mt-0.5">Inicios de sesión sospechosos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security Card */}
        <Card className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.03)] border-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-on-surface">Seguridad</h4>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Contraseña Actual</Label>
              <Input type="password" placeholder="••••••••••••" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface text-base" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Nueva Contraseña</Label>
                <Input type="password" placeholder="Nueva contraseña" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Confirmar</Label>
                <Input type="password" placeholder="Confirmar contraseña" className="w-full px-4 py-6 rounded-xl bg-surface-container-highest/50 border-0 focus:ring-2 focus:ring-primary/40 transition-all font-medium text-on-surface text-base" />
              </div>
            </div>
          </div>
        </Card>

        {/* Billing Card */}
        <Card className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.03)] border-0 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                <Wallet className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-on-surface">Facturación</h4>
            </div>
            <div className="px-3 py-1 bg-tertiary-container/10 text-tertiary font-bold text-[10px] uppercase tracking-wider rounded-full">
              Plan Premium AI
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="flex items-center p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/5">
              <div className="w-14 h-9 bg-surface-container-high rounded-md mr-5 flex items-center justify-center font-black text-slate-500 text-[11px] tracking-widest shadow-sm">
                VISA
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-on-surface">Termina en **** 4492</p>
                <p className="text-[13px] text-on-surface-variant font-medium mt-0.5">Expira 12/26</p>
              </div>
              <Button variant="link" className="text-primary font-bold text-sm tracking-wide">Cambiar</Button>
            </div>
            
            <div className="flex items-center justify-between text-[15px] px-2">
              <span className="text-on-surface-variant font-medium">Próximo cargo: 15 de Oct, 2023</span>
              <span className="font-black text-on-surface text-lg">149,00 € <span className="text-sm font-medium text-on-surface-variant">/ mes</span></span>
            </div>
          </div>
        </Card>

        {/* Location Map */}
        <div className="col-span-12 space-y-4">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-2">Ubicación Registrada</Label>
          
          <div className="relative w-full h-[350px] rounded-4xl overflow-hidden shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-4 border-surface-container-lowest">
            <div className="absolute inset-0 bg-surface-container-high flex flex-col items-center justify-center overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoKbWcJ7p1FjKRMP1oWgCHlZho2HYGd6u_gcZiQSreIWXO_Lzm-UL1jNYEB_IDeXqDtK0RW7_J9gROxy5lXxiykmukezQ4Hs-fmpExQ3wyLsVt3zpOqB7PgSAal_fCgLV5P9dUJrFaba0IddKN9URgVy2rjq6GwpRjdN1CawKnhFur6BvVI2VNVAUFvlfVe0BmD6gW33oz2uD_sp_D-82n2cZBLkZ0zKJCl5gDJlenWVNewXsauA_ZKAvK3l48gZEOKtL0D29pWFYx" 
                alt="Map"
                className="w-full h-full object-cover grayscale opacity-60 contrast-125 hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center animate-bounce">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/20 mb-3">
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="bg-surface-container-lowest/90 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-xl border border-surface-container-lowest">
                  <p className="text-[13px] font-bold text-on-surface">Sede Principal Sanctuary</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <Button size="icon" variant="secondary" className="w-12 h-12 bg-surface-container-lowest/90 backdrop-blur rounded-xl shadow-lg text-on-surface hover:bg-surface-container-lowest">
                <Plus className="w-6 h-6" />
              </Button>
              <Button size="icon" variant="secondary" className="w-12 h-12 bg-surface-container-lowest/90 backdrop-blur rounded-xl shadow-lg text-on-surface hover:bg-surface-container-lowest">
                <Minus className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
