import { 
  RotateCw, 
  Stethoscope, 
  Clock, 
  Calendar, 
  Zap, 
  Bot, 
  TrendingUp, 
  UserPlus, 
  X,
  Filter,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function PersonalPage() {
  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto min-h-screen">
      
      <div className="flex-1 grid grid-cols-12 gap-8">
        {/* Team Grid Section */}
        <section className="col-span-12 lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end border-b border-outline-variant/10 pb-6">
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Equipo Clínico</h3>
              <p className="text-on-surface-variant mt-1 text-lg">Supervisión en tiempo real de la disponibilidad del equipo.</p>
            </div>
            <div className="flex space-x-2 bg-surface-container-low p-1.5 rounded-2xl">
              <Button variant="ghost" className="bg-surface-container-lowest text-on-surface font-medium hover:bg-surface-container-lowest hover:text-primary transition-colors rounded-xl px-4">
                <Filter className="w-4 h-4 mr-2 text-on-surface-variant" />
                Filtrar
              </Button>
              <Button className="bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all rounded-xl px-5">
                <Plus className="w-4 h-4 mr-2" />
                Añadir Médico
              </Button>
            </div>
          </div>

          {/* Doctor Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Doctor 1 */}
            <Card className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.03)] border-0 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(5,150,105,0.08)] group">
              <div className="flex justify-between items-start mb-5">
                <Avatar className="w-14 h-14 rounded-xl ring-2 ring-emerald-50 ring-offset-2 ring-offset-surface-container-lowest">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOAHczTELyQlqkKFKyhm2O_qEcfFLjpKfFX4zFmkxPUKOZ5qhXEh56v-rXeC1KkLhfbHBuy4Np05RJwjVTodpKWRnXmyaM7ayvU0ORQpg9knDJvsLQYA8jptfFlTyiXBw6RmvrbCFxIs4O6p1RDUor7vIb1r_68P6yFzUP9mcP8fNS-sHR9OVetT8mp4nO6DXNUfJ7dZ5l4Wf88XHHmegZd7AgKYPQtEy-QQSdtNSV8P9hUgZKk5V6G6FQbu4ykteHjamB6VWxe9KY" className="object-cover" />
                  <AvatarFallback className="rounded-xl">EV</AvatarFallback>
                </Avatar>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                  Disponible
                </div>
              </div>
              <h4 className="text-[1.125rem] font-bold text-on-surface leading-tight">Dra. Elena Valdés</h4>
              <p className="text-sm text-on-surface-variant/80 mb-5 font-medium">Cardiología Clínica</p>
              <div className="space-y-3 pt-4 border-t border-outline-variant/10">
                <div className="flex items-center text-xs text-on-surface-variant font-medium">
                  <RotateCw className="w-[14px] h-[14px] mr-2.5 text-on-surface-variant/60" />
                  Próximo Turno: Mañana, 08:00 AM
                </div>
                <div className="flex items-center text-xs text-on-surface-variant font-medium">
                  <Stethoscope className="w-[14px] h-[14px] mr-2.5 text-on-surface-variant/60" />
                  Consultorio: 402-B
                </div>
              </div>
            </Card>

            {/* Doctor 2 */}
            <Card className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.03)] border-0 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(5,150,105,0.08)] group">
              <div className="flex justify-between items-start mb-5">
                <Avatar className="w-14 h-14 rounded-xl ring-2 ring-primary/5 ring-offset-2 ring-offset-surface-container-lowest">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW12Z4K4LDik03qqB7e-bk95HZ7sWQUalcYUQkp4Ye4v89OnU1kYAp5TvXWKe60qT8jghYrnBLMjpQXAGlqJ_b0G-RcXT0y5YpGYPM5q3OWk1FPU40fH-AiHc8PRWYiCHYwjcSZs7vA37tfxUrcCD12786JXnc0jgPoN9iL8nP9vIw_eQfc3ZJhqEQWR1lr0x-6Ggh33sLMwTQFCwXee0qwmpALXUBmGy1KZLfMeYQ9NHOM8Uq5Ww6_EczPCHvd4ne--_NJNfAIy-C" className="object-cover" />
                  <AvatarFallback className="rounded-xl">JS</AvatarFallback>
                </Avatar>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  En Consulta
                </div>
              </div>
              <h4 className="text-[1.125rem] font-bold text-on-surface leading-tight">Dr. Julián Sotto</h4>
              <p className="text-sm text-on-surface-variant/80 mb-5 font-medium">Neurología Avanzada</p>
              <div className="space-y-3 pt-4 border-t border-outline-variant/10">
                <div className="flex items-center text-xs text-on-surface-variant font-medium">
                  <Clock className="w-[14px] h-[14px] mr-2.5 text-on-surface-variant/60" />
                  Finaliza en: 15 min
                </div>
                <div className="flex items-center text-xs text-on-surface-variant font-medium">
                  <Stethoscope className="w-[14px] h-[14px] mr-2.5 text-on-surface-variant/60" />
                  Consultorio: 115
                </div>
              </div>
            </Card>

            {/* Doctor 3 */}
            <Card className="bg-transparent p-6 rounded-3xl border-dashed border-2 border-outline-variant/20 transition-all duration-300 group shadow-none">
              <div className="flex justify-between items-start mb-5 opacity-60">
                <Avatar className="w-14 h-14 rounded-xl grayscale opacity-80">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjihYP4wretI_tB-39LFx81fi4s6gDkN1tGRG_fH_nad-icwP8VuKIbbnPTjih504HGmgWBLRh1o2vB0nure-LrRgzZDCI15Ibbm8KLS6g0CaO9MdzH0nAMeGlBlodVrve0NzZg1WgKXjWn8r0KRuoPlT-j824XmDXMIs_QXW8Y_8JrdwzDg4fRoEWgrm315-owub9kXNz2s52AR9iqUZRGPNkSpaNbme_cHF-HTRWpMYBsgowib8-J0ap-2StqK4XmWzUJVoVfQ5b" className="object-cover" />
                  <AvatarFallback className="rounded-xl">SM</AvatarFallback>
                </Avatar>
                <div className="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                  Fuera de Turno
                </div>
              </div>
              <h4 className="text-[1.125rem] font-bold text-on-surface leading-tight opacity-60">Dra. Sara Méndez</h4>
              <p className="text-sm text-on-surface-variant/80 mb-5 font-medium opacity-60">Pediatría General</p>
              <div className="space-y-3 pt-4 border-t border-outline-variant/10">
                <div className="flex items-center text-xs text-on-surface-variant font-medium opacity-60">
                  <Calendar className="w-[14px] h-[14px] mr-2.5" />
                  Regresa: Lunes, 09:00 AM
                </div>
                <div className="flex items-center text-xs text-emerald-600 font-bold opacity-80">
                  <Zap className="w-[14px] h-[14px] mr-2.5" />
                  Disponible para Urgencias
                </div>
              </div>
            </Card>
          </div>

          {/* Turnos de la Semana List */}
          <div className="bg-surface-container-low/40 rounded-4xl p-8 border border-outline-variant/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-on-surface">Turnos de la Semana</h3>
              <Button variant="link" className="text-primary font-bold hover:text-primary/80 px-0 h-auto">Ver Calendario Completo</Button>
            </div>
            
            <div className="space-y-3">
              {/* Shift Item */}
              <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-colors group shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-0">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-[13px] tracking-wider">LU</div>
                  <div>
                    <p className="text-[15px] font-bold text-on-surface group-hover:text-primary transition-colors">Turno de Mañana - Guardia Externa</p>
                    <p className="text-[13px] text-on-surface-variant/70 mt-1 font-medium">3 Médicos Asignados • 08:00 - 14:00</p>
                  </div>
                </div>
                <div className="flex -space-x-3">
                  <Avatar className="w-10 h-10 border-2 border-surface-container-lowest hover:z-20 transition-transform hover:scale-110">
                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAispoU1b_aWECXLTGuVovm7MZ8VrqQCER7QWEYkiOlYMuqD9Cb8vrJv-6ANgQFLsm5ZAV_zmkCdqXVXO2wJXJM0Gdouul4IDpiyPEXx3Rn-dmssJhx9GXVO0b1VqBwEnWbgMTeMrAj2eqJuQ-ZwAAqaBZdSi-NzCqWfApdiTjrJaYMbRiD5bwIyl1tGgS9YqIOpGL2XwrJwnE0_7LJ5SqRT7-6JNP62jJQOQ_L8GMP-egyDWnPa_3EebFUvx97Y8oOQlcZWW8OQDUN" className="object-cover" />
                  </Avatar>
                  <Avatar className="w-10 h-10 border-2 border-surface-container-lowest hover:z-20 transition-transform hover:scale-110">
                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXVTECwwGWL_V2fDNmx9ONqnmqwkwnn_TbFw7pSgiw3UrA1OdnV2Wz6Wk5i52OVgFa6zycb3zx4_ne9jKsGfbTU71MlhHfHP4ZKyIruoQ_ELutYa2ZxnWx_WM7Ngbp2nB8gk0gTY_s2iNYU3YWhWtYmMYp3WqKrjZ2BlMNZb1By_QAtopnTDUttPD_-WJj3xRjM-BweFb2w2Rzu_If-PiMZPqO2cH6_o03waFbdTDZjXEbk7tzIw-DP639LNgKs1-6ycyk_vnb_raK" className="object-cover" />
                  </Avatar>
                  <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[11px] font-bold text-on-surface-variant z-10 
                  hover:bg-surface-container-highest cursor-pointer transition-colors">+1</div>
                </div>
              </div>

              {/* Shift Item */}
              <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-colors group shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-0">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-[13px] tracking-wider">MA</div>
                  <div>
                    <p className="text-[15px] font-bold text-on-surface group-hover:text-amber-600 transition-colors">Cirugías Programadas - Quirófano A</p>
                    <p className="text-[13px] text-on-surface-variant/70 mt-1 font-medium">2 Médicos Asignados • 07:00 - 15:00</p>
                  </div>
                </div>
                <div className="flex -space-x-3">
                  <Avatar className="w-10 h-10 border-2 border-surface-container-lowest hover:z-20 transition-transform hover:scale-110">
                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXJrFRCPTHGYoiqgIqlL647t1xNqQAy9YjJnwWjNGlb41RJfZ2SsD1LjRI2YxcYtFQQggkmEGSq1WkopMnkAHUwVI6ic6-XwaNYX906YrTrWpbK9ZROH8j6e9lJ7rNi7Kq7GpddqIaFAJsGGcFQc2q1_yuGN72COkZSDWiRtlNY0Yv7fjCcebQjmb5hjBXDsCLLw4EkqTslGwDQQBDzohjPtCG4kvJCqkQdKVwVlQ16Xk4QWqBGgdo-vwp7og_FEzU1Yf-iKaEj21m" className="object-cover" />
                  </Avatar>
                  <Avatar className="w-10 h-10 border-2 border-surface-container-lowest hover:z-20 transition-transform hover:scale-110">
                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYZy1snYC3VZ9j652U4hLWHoKgGxG0lecpmp69TtKlYhojgE5Dfsjv4NqYLRxIbfkXD66zy8w07w2McImyVK4TkR18pIxDm7fsoi_yU9Qy-AlTRWK1ZsRyCgVE-1bRBAk42I9D8OHStRdbX_ppB11zChBdAsM4f5RHq69iBrrKm4mxD1x6Z11SwEgJUkOj02YmJ5r7RQesuC-rf2bp4xy8GptOydimxDRBHlFQEhuvnEKfdnkPLt0EDaY70Gi555mIo2lyAUkKbti0" className="object-cover" />
                  </Avatar>
                </div>
              </div>

              {/* Shift Item */}
              <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-colors group shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-0">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[13px] tracking-wider">MI</div>
                  <div>
                    <p className="text-[15px] font-bold text-on-surface group-hover:text-blue-600 transition-colors">Consultas de Especialidad - Planta 2</p>
                    <p className="text-[13px] text-on-surface-variant/70 mt-1 font-medium">5 Médicos Asignados • 09:00 - 18:00</p>
                  </div>
                </div>
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[18px] font-bold text-on-surface-variant z-10 leading-none pb-2">...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IA Optimization Panel (Sidebar Right) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="bg-surface-container-lowest/80 backdrop-blur-3xl p-7 rounded-4xl border border-primary/10 shadow-[0_30px_60px_rgba(5,150,105,0.08)] sticky top-28">
            <div className="flex items-center space-x-4 mb-7">
              <div className="w-13 h-13 rounded-2xl bg-linear-to-br from-primary to-tertiary-container flex items-center justify-center shadow-lg shadow-primary/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[1.125rem] text-on-surface leading-tight">Optimización IA</h4>
                <p className="text-[10px] uppercase font-black text-primary tracking-widest mt-1">Motor Sanctuary v2.4</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-5 mb-7 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <p className="text-[14px] text-on-surface/90 leading-[1.6] font-medium pl-2">
                "He detectado una saturación proyectada en Cardiología para este Jueves. Sugiero reasignar el turno de la Dra. Valdés para optimizar la espera."
              </p>
            </div>

            <h5 className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/60 mb-5 px-1">Sugerencias del Agente</h5>
            
            <div className="space-y-4">
              {/* Suggestion Card */}
              <div className="p-5 rounded-[1.25rem] bg-surface-container-lowest border border-outline-variant/15 shadow-sm hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(5,150,105,0.06)] transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[12px] font-bold text-primary flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Cambio de Turno
                  </span>
                </div>
                <p className="text-[13px] text-on-surface leading-relaxed mb-5 font-medium">
                  Mover <strong className="font-black">Dr. Julián Sotto</strong> a urgencias nocturnas para cubrir baja por congreso.
                </p>
                <div className="flex space-x-2">
                  <Button className="flex-1 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors h-9">
                    Aplicar
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl border-outline-variant/20 text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/20 transition-colors h-9 w-9">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Suggestion Card */}
              <div className="p-5 rounded-[1.25rem] bg-surface-container-lowest border border-outline-variant/15 shadow-sm hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(5,150,105,0.06)] transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[12px] font-bold text-primary flex items-center gap-2">
                    <UserPlus className="w-3.5 h-3.5" />
                    Refuerzo Requerido
                  </span>
                </div>
                <p className="text-[13px] text-on-surface leading-relaxed mb-5 font-medium">
                  Se requiere 1 pediatra adicional el viernes tarde debido a picos estacionales.
                </p>
                <div className="flex space-x-2">
                  <Button className="flex-1 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors h-9">
                    Asignar
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl border-outline-variant/20 text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/20 transition-colors h-9 w-9">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[13px] font-bold text-on-surface">Eficiencia del Equipo</span>
                <span className="text-[1.25rem] font-black text-primary tracking-tight">94%</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[94%] rounded-full shadow-[0_0_10px_rgba(5,150,105,0.4)]"></div>
              </div>
              <p className="text-[11px] font-bold text-on-surface-variant/60 mt-4 text-center">
                Incremento del 12% vs. mes anterior
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
