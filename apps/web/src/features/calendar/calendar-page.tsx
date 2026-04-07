import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Lock, 
  PlusCircle, 
  Utensils, 
  Download, 
  Bot, 
  History 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CalendarPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto">
      {/* Calendar Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
            Vista General del Horario
          </h1>
          <div className="flex items-center gap-4 text-on-surface-variant mt-4">
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:bg-white">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="px-4 font-semibold text-on-surface text-sm">Oct 14 — 20, 2024</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:bg-white">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <Button variant="ghost" className="font-medium text-primary hover:bg-primary/5 text-sm rounded-xl">
              Hoy
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl">
          <Button variant="ghost" className="px-5 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 rounded-lg">
            Día
          </Button>
          <Button variant="outline" className="px-5 py-1.5 text-sm font-bold bg-white text-primary rounded-lg border-none hover:bg-white hover:text-primary shadow-sm h-9">
            Semana
          </Button>
          <Button variant="ghost" className="px-5 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 rounded-lg">
            Mes
          </Button>
        </div>
      </section>

      {/* Stats/Legend Bento Row */}
      <section className="grid grid-cols-12 gap-6">
        {/* AI Summary Card */}
        <Card className="col-span-12 lg:col-span-8 bg-surface-container-lowest border-0 rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-on-surface">Optimización de IA Activa</h3>
                </div>
                <p className="text-sm text-on-surface-variant max-w-xl">
                  VitalAgent ha reprogramado automáticamente 4 citas para minimizar huecos y predijo 2 cancelaciones potenciales para el jueves por la mañana.
                </p>
              </div>
              <div className="flex -space-x-2">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNh6zQos8TlthLbROaCAnxdg9SEfEcn8Wd874BiYM7gO5RvGEVa23PanwxE3d_pBhJLgevuGHh6KgnKxpCNDhAPsbAltpOCYL_PGXBESWJzoSEIDb_4JanlevRFrAHOFeAYw9yvyYQvF-XwynyPla9d1QrEsrsaYNs2SPQGWnXlCSiPsCLh1HpLk1wabSidBjnt0aW6bUjQTS9cbInmXjIUFS8eiR9coBQ90W-St25ajx90YhkdqeQCkOv_VdeSJ6TI3UZ_lGd-7lO" alt="Dra. Sarah" />
                  <AvatarFallback className="text-[10px]">DS</AvatarFallback>
                </Avatar>
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYpJ7ThrcWG7vyks8cT2PSWdwB1zxMQl56Hvh62_xMdqlrWUt8CVl_hYcbUtEmml2ROemznrr_alDaOFo9lnxONXI8IS871ADM_cfq4JB66bQfzksD_H-V1yqTSx4QMd4gdRmzD5fomLYawiEEQh-_57QbvDQTQMqNqW0jB6mBDRYCtnpHlGS5g8EgygfsywylsU61jBp2ewv9uSfhpFpXkUr005UJjQbuG2dNC1hhcv-pocP7NuXn2Ht-1qvAwLVxvC9vczXr7YS2" alt="Dr. James" />
                  <AvatarFallback className="text-[10px]">DJ</AvatarFallback>
                </Avatar>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary z-10 relative">
                  +8
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend Card */}
        <Card className="col-span-12 lg:col-span-4 bg-surface-container-lowest border-0 rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)]">
          <CardContent className="p-6 flex items-center justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full border border-outline-variant bg-white"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Disponible</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Reservado por IA</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bloqueado</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-primary">84%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Carga Semanal
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Calendar Grid Container */}
      <section className="bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] overflow-x-auto w-full">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-surface-container-low border-b border-outline-variant/10">
            <div className="p-4 border-r border-outline-variant/10"></div>
            <div className="p-4 text-center border-r border-outline-variant/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lun</p>
              <p className="text-xl font-extrabold text-on-surface">14</p>
            </div>
            <div className="p-4 text-center border-r border-outline-variant/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mar</p>
              <p className="text-xl font-extrabold text-on-surface">15</p>
            </div>
            <div className="p-4 text-center border-r border-outline-variant/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mié</p>
              <p className="text-xl font-extrabold text-on-surface">16</p>
            </div>
            <div className="p-4 text-center border-r border-outline-variant/10 bg-primary/5">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Jue</p>
              <p className="text-xl font-extrabold text-primary">17</p>
              <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1"></div>
            </div>
            <div className="p-4 text-center border-r border-outline-variant/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vie</p>
              <p className="text-xl font-extrabold text-on-surface">18</p>
            </div>
            <div className="p-4 text-center border-r border-outline-variant/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sáb</p>
              <p className="text-xl font-extrabold text-slate-400">19</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dom</p>
              <p className="text-xl font-extrabold text-slate-400">20</p>
            </div>
          </div>

          {/* Time Grid Body */}
          <div className="max-h-[600px] overflow-y-auto">
            
            {/* 08:00 Block */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5">
              <div className="p-4 text-right text-[11px] font-bold text-slate-400 uppercase">08:00</div>
              <div className="p-2 border-r border-outline-variant/5 bg-slate-50/50">
                <div className="h-full min-h-[80px] rounded-lg bg-surface-container-high/60 p-2 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Reservado por IA</p>
                  <p className="text-xs font-bold leading-tight">Paciente: Martha S.</p>
                  <p className="text-[10px] mt-1 opacity-90">Vía: IA-Web</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5"></div>
              <div className="p-2 border-r border-outline-variant/5 bg-primary/5">
                <div className="h-full min-h-[80px] rounded-lg border-2 border-dashed border-primary/30 bg-white/50 p-3 flex flex-col justify-center items-center text-primary cursor-pointer hover:bg-white transition-colors">
                  <PlusCircle className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">CITA ABIERTA</span>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3 shadow-sm">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Reservación</p>
                  <p className="text-xs font-bold leading-tight">Paciente: Ana Gómez</p>
                  <p className="text-[10px] mt-1 opacity-90">Lugar: Sala OR-2</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5 bg-slate-50/50"></div>
              <div className="p-2 bg-slate-50/50"></div>
            </div>

            {/* 09:00 Block */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5">
              <div className="p-4 text-right text-[11px] font-bold text-slate-400 uppercase">09:00</div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Reservación</p>
                  <p className="text-xs font-bold leading-tight">Paciente: Carlos M.</p>
                  <p className="text-[10px] mt-1 opacity-90">Vía: Portal Web</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Reservación</p>
                  <p className="text-xs font-bold leading-tight">Paciente: John D.</p>
                  <p className="text-[10px] mt-1 opacity-90">Vía: Recepción</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Reservación</p>
                  <p className="text-xs font-bold leading-tight">Paciente: Elena R.</p>
                  <p className="text-[10px] mt-1 opacity-90">Lugar: Consultorio B</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5 bg-primary/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-fixed text-on-primary-fixed p-3 border-l-4 border-primary">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Evento Interno</p>
                  <p className="text-xs font-bold leading-tight">Tipo: Reunión Staff</p>
                  <p className="text-[10px] mt-1 opacity-90">Lugar: Sala Juntas</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5"></div>
              <div className="p-2 border-r border-outline-variant/5 bg-slate-50/50"></div>
              <div className="p-2 bg-slate-50/50"></div>
            </div>

            {/* 10:00 Block */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5">
              <div className="p-4 text-right text-[11px] font-bold text-slate-400 uppercase">10:00</div>
              <div className="p-2 border-r border-outline-variant/5"></div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-surface-container-high/60 p-2 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg border-2 border-dashed border-outline-variant/30 bg-white/50 p-3 flex flex-col justify-center items-center text-slate-400">
                  <span className="text-[10px] font-bold">DISPONIBLE</span>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5 bg-primary/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Proceso IA</p>
                  <p className="text-xs font-bold leading-tight">Tipo: Automatización</p>
                  <p className="text-[10px] mt-1 opacity-90">Vía: Sistema</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5"></div>
              <div className="p-2 border-r border-outline-variant/5 bg-slate-50/50"></div>
              <div className="p-2 bg-slate-50/50"></div>
            </div>

            {/* 11:00 Block */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5">
              <div className="p-4 text-right text-[11px] font-bold text-slate-400 uppercase">11:00</div>
              <div className="col-span-7 bg-surface-container-lowest p-4 flex items-center justify-center min-h-[60px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  Sin actividades programadas para esta hora
                </span>
              </div>
            </div>

            {/* 12:00 Block */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5 bg-primary/5">
              <div className="p-4 text-right text-[11px] font-bold text-primary uppercase">12:00</div>
              <div className="col-span-7 p-4 flex items-center gap-4 min-h-[60px]">
                <Utensils className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Periodo de Descanso y Mantenimiento del Sistema
                </span>
              </div>
            </div>

            {/* 13:00 Block */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-outline-variant/5">
              <div className="p-4 text-right text-[11px] font-bold text-slate-400 uppercase">13:00</div>
              <div className="p-2 border-r border-outline-variant/5"></div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Reservación</p>
                  <p className="text-xs font-bold leading-tight">Paciente: Alex T.</p>
                  <p className="text-[10px] mt-1 opacity-90">Vía: App Móvil</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5"></div>
              <div className="p-2 border-r border-outline-variant/5 bg-primary/5"></div>
              <div className="p-2 border-r border-outline-variant/5">
                <div className="h-full min-h-[80px] rounded-lg bg-primary-container text-white p-3">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Reservación</p>
                  <p className="text-xs font-bold leading-tight">Paciente: Laura S.</p>
                  <p className="text-[10px] mt-1 opacity-90">Lugar: Consultorio A</p>
                </div>
              </div>
              <div className="p-2 border-r border-outline-variant/5 bg-slate-50/50"></div>
              <div className="p-2 bg-slate-50/50"></div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Quick Actions Footer Bento */}
      <section className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-surface-container-lowest border-0 rounded-xl hover:shadow-[0_20px_50px_rgba(5,150,105,0.06)] transition-all cursor-pointer">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">Exportar Registro</h4>
              <p className="text-[11px] text-on-surface-variant">Generar PDF para facturación de seguros</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-0 rounded-xl hover:shadow-[0_20px_50px_rgba(5,150,105,0.06)] transition-all cursor-pointer">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">Ejecutar Optimización</h4>
              <p className="text-[11px] text-on-surface-variant">Reasignación por IA de espacios pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-0 rounded-xl hover:shadow-[0_20px_50px_rgba(5,150,105,0.06)] transition-all cursor-pointer">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">Historial Paciente</h4>
              <p className="text-[11px] text-on-surface-variant">Vista rápida de interacciones de hoy</p>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Floating Action for Mobile / Quick Context */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button size="icon" className="w-14 h-14 bg-primary text-white rounded-full shadow-[0_20px_50px_rgba(5,150,105,0.3)] hover:scale-110 transition-transform active:scale-95">
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>

    </div>
  );
}
