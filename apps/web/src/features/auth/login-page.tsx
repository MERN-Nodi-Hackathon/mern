import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/supabase/auth-context';

/** Valida formato básico de correo electrónico */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface FieldError {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const navigate = useNavigate();

  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');

  /** Valida los campos y devuelve true si son correctos */
  function validate(): boolean {
    const next: FieldError = {};

    if (!email.trim()) {
      next.email = 'El correo electrónico es obligatorio.';
    } else if (!isValidEmail(email)) {
      next.email = 'Introduce un correo electrónico válido.';
    }

    if (!password) {
      next.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      next.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setLoginError('');

    if (!validate()) return;

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      setLoginError('No se pudo iniciar sesión. Verifica tus credenciales.');
    }
  }

  /** Re-valida en tiempo real sólo si el usuario ya intentó enviar */
  function handleEmailChange(value: string) {
    setEmail(value);
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        email: !value.trim()
          ? 'El correo electrónico es obligatorio.'
          : !isValidEmail(value)
          ? 'Introduce un correo electrónico válido.'
          : undefined,
      }));
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        password: !value
          ? 'La contraseña es obligatoria.'
          : value.length < 6
          ? 'La contraseña debe tener al menos 6 caracteres.'
          : undefined,
      }));
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-surface">
      {/* Fondo decorativo con gradientes suaves */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-1/5 -left-1/10 w-3/5 h-3/5 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/5 -right-1/10 w-3/5 h-3/5 bg-tertiary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <img 
            src="https://res.cloudinary.com/dkoqe8las/image/upload/v1775572969/logo_h_vitalagent_e5dfft.png" 
            alt="vitalAgent Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Card de Login */}
        <div className="editorial-card rounded-3xl p-10 border border-outline-variant/10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">Bienvenido de nuevo</h2>
            <p className="text-on-surface-variant text-sm mt-1">Por favor, ingrese sus credenciales clínicas</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin} noValidate>
            {/* Campo: Correo Electrónico */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant px-1">
                Correo Electrónico
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-error' : 'text-outline'}`} />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="p.perfil@hospital.org"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`h-12 pl-11 pr-4 bg-surface-container-highest border-none rounded-xl text-on-surface text-sm placeholder:text-outline transition-all outline-none focus-visible:ring-2 ${
                    errors.email
                      ? 'focus-visible:ring-error/40 ring-2 ring-error/40'
                      : 'focus-visible:ring-primary/40'
                  }`}
                />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" className="text-xs text-error font-medium px-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                  Contraseña
                </Label>
                <Link to="#" className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors ${errors.password ? 'text-error' : 'text-outline'}`} />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`h-12 pl-11 pr-12 bg-surface-container-highest border-none rounded-xl text-on-surface text-sm placeholder:text-outline transition-all outline-none focus-visible:ring-2 ${
                    errors.password
                      ? 'focus-visible:ring-error/40 ring-2 ring-error/40'
                      : 'focus-visible:ring-primary/40'
                  }`}
                />
                {/* Toggle visibilidad de contraseña */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center h-full w-auto rounded-r-xl hover:bg-transparent text-outline hover:text-on-surface-variant"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="text-xs text-error font-medium px-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* CTA Principal */}
            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              Acceder al Panel
              <ChevronRight className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/terms"
            className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            Términos de Servicio
          </Link>
        </div>
      </div>
    </main>
  );
}
