import { 
  BadgeCheck, 
  Zap, 
  Save, 
  RefreshCw, 
  ExternalLink,
  Bot,
  User,
  Send,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AgentPage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen">
      {/* Page Header */}
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
          Inteligencia del Agente IA
        </h2>
        <p className="text-on-surface-variant max-w-2xl text-lg">
          Configure la identidad visual, el tono lingüístico y el comportamiento funcional del asistente médico digital de su clínica.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Agent Identity Form */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <Card className="bg-surface-container-lowest shadow-sm border-0">
            <CardContent className="p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary-fixed p-2 rounded-lg text-primary">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-on-surface">Identidad del Agente</h3>
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                    Mensaje de Saludo
                  </label>
                  <textarea 
                    className="w-full bg-surface-container-highest/50 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 resize-none text-on-surface placeholder:text-on-surface-variant/50" 
                    placeholder="¡Hola! Soy su VitalAgent. ¿Cómo puedo ayudarle con su salud hoy?" 
                    rows={4}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                      Zona Horaria
                    </label>
                    <select className="w-full bg-surface-container-highest/50 border-0 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface">
                      <option>PST (UTC-8)</option>
                      <option>EST (UTC-5)</option>
                      <option>GMT (UTC+0)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                    Tono de Voz
                  </label>
                  <select className="w-full bg-surface-container-highest/50 border-0 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface">
                    <option>Empático y Clínico (Recomendado)</option>
                    <option>Directo y Conciso</option>
                    <option>Cálido y Amigable</option>
                    <option>Formal y Profesional</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-surface-container-low border-0 shadow-none">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mb-2">FUENTE DE DATOS</p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <BadgeCheck className="w-5 h-5 fill-primary text-surface-container-low" />
                  <span className="text-sm">HCE Conectado</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface-container-low border-0 shadow-none">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mb-2">LATENCIA</p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm">240ms prom</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button className="w-full py-6 bg-linear-to-br from-primary to-primary-container text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Desplegar Configuración
          </Button>
        </section>

        {/* Right Column: Live Preview */}
        <section className="lg:col-span-7 flex flex-col h-[700px] lg:sticky top-24">
          <div className="bg-surface-dim rounded-2xl p-1 shadow-2xl relative overflow-hidden h-full flex flex-col border border-outline-variant/10">
            {/* Mock Chat Header */}
            <div className="bg-surface-container-lowest/90 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm font-bold uppercase tracking-widest text-on-surface">Vista Previa en Vivo</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-on-surface-variant hover:bg-surface-container-low">
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-on-surface-variant hover:bg-surface-container-low">
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[radial-gradient(circle_at_top_right,#ffffff,transparent)] z-10">
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-outline-variant/20"></div>
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter">Hoy, 10:42 AM</span>
                <div className="flex-1 h-px bg-outline-variant/20"></div>
              </div>

              {/* Bot Message */}
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="w-8 h-8 rounded-lg shrink-0">
                  <AvatarFallback className="bg-primary text-white rounded-lg">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10">
                  <p className="text-sm leading-relaxed text-on-surface">
                    ¡Hola! Soy su VitalAgent. ¿Cómo puedo ayudarle con su salud hoy?
                  </p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                <Avatar className="w-8 h-8 rounded-lg shrink-0">
                  <AvatarFallback className="bg-surface-container-high text-on-surface-variant rounded-lg">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-primary p-4 rounded-2xl rounded-tr-none shadow-sm text-white">
                  <p className="text-sm leading-relaxed">
                    Me gustaría programar una cita de seguimiento con el Dr. Sánchez para mi recuperación de cirugía de rodilla.
                  </p>
                </div>
              </div>

              {/* Loading Indicator */}
              <div className="flex items-center gap-2 px-11">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-on-surface-variant/70 font-medium italic">El agente está consultando disponibilidad...</span>
              </div>

              {/* Bot Message Final */}
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="w-8 h-8 rounded-lg shrink-0">
                  <AvatarFallback className="bg-primary text-white rounded-lg">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3 flex-1">
                  <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10">
                    <p className="text-sm leading-relaxed text-on-surface">
                      Veo que el Dr. Sánchez tiene disponibilidad para un chequeo postoperatorio la próxima semana. ¿Cuál de estos horarios le conviene más?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" className="w-full justify-between p-6 bg-surface-container-lowest border-outline-variant/20 rounded-xl text-sm font-medium hover:border-primary hover:text-primary transition-all shadow-none">
                      <span>Martes, 24 Oct @ 9:00 AM</span>
                      <ArrowRight className="w-4 h-4 text-outline-variant/50 group-hover:text-primary" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between p-6 bg-surface-container-lowest border-outline-variant/20 rounded-xl text-sm font-medium hover:border-primary hover:text-primary transition-all shadow-none">
                      <span>Miércoles, 25 Oct @ 2:30 PM</span>
                      <ArrowRight className="w-4 h-4 text-outline-variant/50 group-hover:text-primary" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-surface-container-lowest/95 backdrop-blur-sm border-t border-outline-variant/10 z-10">
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-low border-0 outline-none rounded-full py-4 pl-6 pr-14 text-sm text-on-surface-variant cursor-not-allowed" 
                  placeholder="Simular respuesta del paciente..." 
                  readOnly 
                  type="text"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-50 p-0 text-white">
                  <Send className="w-4 h-4 -ml-0.5" />
                </Button>
              </div>
            </div>

            {/* Background Blooms */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-tertiary-container/5 rounded-full blur-3xl pointer-events-none z-0"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
