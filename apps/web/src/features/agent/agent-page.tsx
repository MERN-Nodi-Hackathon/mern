import { useState, useEffect } from 'react';
import {
  BadgeCheck,
  Zap,
  Save,
  RefreshCw,
  Bot,
  User,
  Send,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { getAgentIdentity, getAgentMetrics, getPreviewConversation } from '@/services/agent.service';
import { ChatMessage, AgentIdentity, AgentMetrics } from '@/types/models';

// ─── Tipos Locales ────────────────────────────────────────────────────────────

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function BotMessage({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex gap-3 max-w-[88%]">
      {/* Avatar del agente */}
      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm shadow-primary/30">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-outline-variant/10">
          <p className="text-sm leading-relaxed text-on-surface">{msg.text}</p>
        </div>
        {msg.options && (
          <div className="grid grid-cols-1 gap-2">
            {msg.options.map((opt) => (
              <Button
                key={opt.id}
                variant="outline"
                className="w-full justify-between px-4 py-3 bg-white border-outline-variant/20 rounded-xl text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-none h-auto"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-on-surface-variant/40" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex gap-3 max-w-[88%] ml-auto flex-row-reverse">
      {/* Avatar del usuario */}
      <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-on-surface-variant" />
      </div>
      <div className="bg-primary px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm shadow-primary/20 text-white">
        <p className="text-sm leading-relaxed">{msg.text}</p>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function AgentPage() {
  const [identity, setIdentity] = useState<AgentIdentity | null>(null);
  const [metrics, setMetrics]   = useState<AgentMetrics | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved]       = useState(false);

  // Estados locales editables del formulario
  const [greeting, setGreeting] = useState('');
  const [timezone, setTimezone] = useState('');
  const [tone, setTone]         = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [idData, metricsData, convData] = await Promise.all([
        getAgentIdentity(),
        getAgentMetrics(),
        getPreviewConversation()
      ]);
      
      setIdentity(idData);
      setMetrics(metricsData);
      setMessages(convData);

      // Inicializar form
      setGreeting(idData.greetingMessage);
      setTimezone(idData.timezone);
      setTone(idData.tone);
      setLanguage(idData.language);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  function handleSave() {
    // TODO: POST /api/agent/config con { greeting, timezone, tone, language }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-10 min-h-screen">
      <PageHeader
        title="Inteligencia del Agente IA"
        description="Configure la identidad, el tono y el comportamiento del asistente médico de su clínica."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ── Columna izquierda: Configuración ────────────────────────────────── */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Identidad del Agente */}
          <Card className="bg-surface-container-lowest shadow-sm border-0">
            <CardContent className="p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary-fixed p-2 rounded-lg text-primary">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-on-surface">
                  Identidad del Agente
                </h3>
              </div>

              <div className="flex flex-col gap-5">
                {/* Mensaje de saludo */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="greeting"
                    className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70"
                  >
                    Mensaje de Saludo
                  </Label>
                  <Textarea
                    id="greeting"
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    rows={4}
                    className="bg-surface-container-highest/50 border-0 rounded-xl p-4 text-sm focus-visible:ring-primary/20 resize-none text-on-surface placeholder:text-on-surface-variant/50"
                    placeholder="¡Hola! Soy su VitalAgent..."
                  />
                </div>

                {/* Zona horaria e Idioma */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="timezone"
                      className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70"
                    >
                      Zona Horaria
                    </Label>
                    <Select
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="bg-surface-container-highest/50 border-0 rounded-xl p-3 h-auto focus-visible:ring-primary/20"
                    >
                      <option value="America/Mexico_City">Mexico City (CST)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="Europe/Madrid">Madrid (CET)</option>
                      <option value="UTC">UTC</option>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="language"
                      className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70"
                    >
                      Idioma
                    </Label>
                    <Select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-surface-container-highest/50 border-0 rounded-xl p-3 h-auto focus-visible:ring-primary/20"
                    >
                      <option value="es">Español (ES)</option>
                      <option value="en">English (US)</option>
                      <option value="pt">Português (BR)</option>
                    </Select>
                  </div>
                </div>

                {/* Tono de voz */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="tone"
                    className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70"
                  >
                    Tono de Voz
                  </Label>
                  <Select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="bg-surface-container-highest/50 border-0 rounded-xl p-3 h-auto focus-visible:ring-primary/20"
                  >
                    <option value="professional">Profesional y Empático</option>
                    <option value="concise">Directo y Conciso</option>
                    <option value="friendly">Cercano y Amigable</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón guardar */}
          <Button
            onClick={handleSave}
            className="w-full py-6 bg-linear-to-br from-primary to-primary-container text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saved ? '¡Configuración guardada!' : 'Guardar Configuración'}
          </Button>
        </section>

        {/* ── Columna derecha: Vista previa del chat ───────────────────────── */}
        <section className="lg:col-span-7 flex flex-col h-[680px] lg:sticky top-24">
          {/* Marco del chat-preview */}
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden h-full flex flex-col border border-outline-variant/10 shadow-[0_24px_60px_rgba(5,150,105,0.08)]">

            {/* Barra superior */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-bold text-on-surface tracking-wide">
                  Vista Previa en Vivo
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Indicador de modelo */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mr-3">
                  {metrics?.modelVersion || 'Cargando...'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-on-surface-variant hover:bg-surface-container-low rounded-lg"
                  title="Reiniciar conversación"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-5 bg-surface-container-low/30">
              {/* Separador de hora */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-outline-variant/20" />
                <span className="text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-wider">
                  Hoy, 10:42 AM
                </span>
                <div className="flex-1 h-px bg-outline-variant/20" />
              </div>

              {/* Mensajes del JSON */}
              {messages.map((msg) =>
                msg.role === 'bot' ? (
                  <BotMessage key={msg.id} msg={msg} />
                ) : (
                  <UserMessage key={msg.id} msg={msg} />
                ),
              )}
            </div>

            {/* Barra de input */}
            <div className="px-5 py-4 border-t border-outline-variant/10 bg-surface-container-lowest">
              <div className="flex items-center gap-3 bg-surface-container-low rounded-2xl px-4 py-3">
                <input
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-on-surface-variant/50 cursor-not-allowed placeholder:text-on-surface-variant/40"
                  placeholder="Simular respuesta del paciente..."
                  readOnly
                  disabled
                  type="text"
                />
                <Button
                  disabled
                  size="icon"
                  className="w-8 h-8 rounded-xl bg-primary opacity-40 text-white shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-center text-[10px] text-on-surface-variant/40 mt-2.5 font-medium">
                Vista de demostración
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
