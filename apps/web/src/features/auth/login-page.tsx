import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ChevronRight, ActivitySquare } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hardcoded authentication. Later integrate with Supabase or backend.
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-surface">
      {/* Subtle background texture element */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-4 shadow-[0_20px_50px_rgba(5,150,105,0.05)]">
            <ActivitySquare className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-on-surface headline-display">VitalAgent</h1>
          <p className="text-on-surface-variant text-sm font-medium tracking-wide mt-1">Automatización Médica</p>
        </div>

        {/* Login Card */}
        <div className="editorial-card rounded-3xl p-10 border border-outline-variant/10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">Bienvenido de nuevo</h2>
            <p className="text-on-surface-variant text-sm mt-1">Por favor, ingrese sus credenciales clínicas</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant px-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-outline" />
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="p.perfil@hospital.org" 
                  required 
                  className="w-full h-12 pl-11 pr-4 bg-surface-container-highest border-none rounded-xl text-on-surface text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all outline-none" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                  Contraseña
                </label>
                <Link to="#" className="text-xs font-semibold text-primary hover:text-primary-container transition-colors">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-outline" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="w-full h-12 pl-11 pr-12 bg-surface-container-highest border-none rounded-xl text-on-surface text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all outline-none" 
                />
              </div>
            </div>

            {/* Primary CTA */}
            <button 
              type="submit"
              className="w-full h-12 bg-linear-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <span>Acceder al Panel</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1.5 grayscale opacity-60">
              <ShieldCheck className="w-4 h-4 text-on-surface-variant" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Cumplimiento HIPAA</span>
            </div>
            <div className="h-1 w-1 bg-outline-variant rounded-full"></div>
            <div className="flex items-center space-x-1.5 grayscale opacity-60">
              <Lock className="w-4 h-4 text-on-surface-variant" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Encriptación 256-Bit</span>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-6">
            <Link to="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Política de Privacidad</Link>
            <Link to="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Términos de Servicio</Link>
            <Link to="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Soporte</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-medium text-on-surface-variant">Alojado en regiones seguras de EE. UU. Este</span>
          </div>
        </div>
      </div>


    </main>
  );
}
