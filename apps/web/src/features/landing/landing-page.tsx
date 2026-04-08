import { Link } from 'react-router-dom';
import { Bot, Calendar, ArrowRight, ShieldCheck, ActivitySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Background Decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-screen z-0">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-tertiary/10 rounded-full blur-[150px]" />
      </div>

      {/* Navbar Superior */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://res.cloudinary.com/dkoqe8las/image/upload/v1775572969/logo_h_vitalagent_e5dfft.png" 
              alt="vitalAgent" 
              className="h-10 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Características</a>
            <a href="#how-it-works" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Cómo Funciona</a>
            <Link to="/terms" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Términos</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="hidden sm:inline-flex text-primary font-bold hover:bg-primary/5">
              <Link to="/login">Acceso Clínicas</Link>
            </Button>
            <Button asChild className="bg-linear-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
              <Link to="/login">Empezar Ahora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full z-10 pt-20">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-32 md:pt-32 md:pb-40 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">El futuro de la gestión médica</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.1]">
              <span className="block">La agenda de tu clínica,</span>
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary to-tertiary">
                operada por IA.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              vitalAgent es el primer sistema inteligente que agenda pacientes, reduce el ausentismo y optimiza el tiempo de tus especialistas médicos automáticamente.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button asChild size="lg" className="h-14 px-8 w-full sm:w-auto bg-linear-to-br from-primary to-primary-container text-white font-bold rounded-2xl shadow-[0_20px_50px_rgba(5,150,105,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all text-base">
                <Link to="/login" className="flex items-center gap-2">
                  Acceder al Panel
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 w-full sm:w-auto rounded-2xl font-bold border-outline-variant/30 text-on-surface hover:bg-surface-container-low transition-all text-base">
                <a href="#features">Descubrir Beneficios</a>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:max-w-xl">
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-outline-variant/10 aspect-square sm:aspect-video lg:aspect-square bg-surface-container-lowest flex items-center justify-center group">
              <img 
                src="https://res.cloudinary.com/dkoqe8las/image/upload/v1775573491/banner_vitalagent_sviro4.png" 
                alt="vitalAgent Dashboard Preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay Decorativo */}
              <div className="absolute inset-0 bg-linear-to-t from-surface/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-surface/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Estado del Agente</p>
                      <p className="font-bold text-on-surface">Agendando 4 citas simultáneas</p>
                    </div>
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-surface-container-lowest border-y border-outline-variant/10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">
                Diseñado para clínicas modernas
              </h2>
              <p className="text-on-surface-variant text-lg">
                Combinamos inteligencia artificial de vanguardia con un diseño centrado en la experiencia del paciente y del personal médico.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-surface p-8 rounded-3xl border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Triaje Inteligente</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  El agente clasifica la urgencia de las consultas y asigna automáticamente al paciente con el especialista adecuado.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface p-8 rounded-3xl border border-outline-variant/10 hover:shadow-xl hover:shadow-tertiary/5 transition-all relative overflow-hidden">
                <div className="w-14 h-14 bg-tertiary-container/20 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-tertiary-container" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Agenda Dinámica</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Optimiza los espacios vacíos y reduce el ausentismo mediante recordatorios proactivos y reprogramación automática.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface p-8 rounded-3xl border border-outline-variant/10 hover:shadow-xl hover:shadow-secondary/5 transition-all">
                <div className="w-14 h-14 bg-secondary-container/20 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Seguridad Médica</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Cumplimiento estricto de las normas de privacidad (HIPAA y RGPD) para garantizar que los datos de los pacientes estén protegidos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center bg-linear-to-br from-surface-container-low to-surface-container-highest rounded-[3rem] p-12 md:p-20 border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <ActivitySquare className="w-16 h-16 text-primary mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tighter mb-6">
                Lleva tu clínica al siguiente nivel
              </h2>
              <p className="text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto">
                Únete a la nueva era de la atención médica. Deja que vitalAgent se encargue de la logística mientras tú te enfocas en tus pacientes.
              </p>
              <Button asChild size="lg" className="h-16 px-10 bg-on-surface text-surface hover:bg-on-surface/90 font-bold rounded-2xl text-lg shadow-xl hover:scale-105 transition-all">
                <Link to="/login">Empezar Prueba Gratuita</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <img 
                src="https://res.cloudinary.com/dkoqe8las/image/upload/v1775572969/logo_h_vitalagent_e5dfft.png" 
                alt="vitalAgent Logo" 
                className="h-8 w-auto opacity-70"
              />
          </div>
          <div className="text-sm font-medium text-on-surface-variant flex gap-6">
            <Link to="/terms" className="hover:text-primary transition-colors">Términos de Servicio</Link>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
          </div>
          <div className="text-sm text-on-surface-variant/60">
            © 2024 vitalAgent. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
