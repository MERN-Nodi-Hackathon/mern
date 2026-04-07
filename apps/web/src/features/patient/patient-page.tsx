import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  UserPlus, 
  Filter, 
  Mail, 
  PhoneCall, 
  Edit, 
  Eye, 
  Archive, 
  ChevronLeft, 
  ChevronRight, 
  History 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PATIENTS_DATA = [
  {
    id: '#VA-2024-001',
    name: 'Elena Rodriguez',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtZVJE7DU6xEzrMTBSXN2gf1uBe6xKIWoq8tIvJT9BMzEJnolAIAsixesD8ZLhZ2hbAMPf8DTi7-z4KrJseBdNs9D2yra6cFHXGDrSAT4oMVAwDFmZsSiijfeBzhpXO8Y613u7F77qATNqRkkPcOKP860PCYSmoXz-z3vBlN0aOrlrXlMPaq4FY6gkT9WTo5Tay6RsLhT0fd5NFNb8bfHGKo-NvfWr1y--_eGgUY7oAX2hD1hojN-RmnVWMMZiQuQaJvPXMsJOVdcQ',
    age: '42 años',
    lastVisitDate: '12 Oct, 2023',
    lastVisitReason: 'Chequeo General',
    nextVisitDate: '24 Mar, 09:00',
    nextVisitStatus: 'Confirmada',
    statusColor: 'emerald'
  },
  {
    id: '#VA-2024-042',
    name: 'Carlos Méndez',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoiIqCSMELTCYZCC5x9pvd2BuIfdJtHtOlW-BS96E2Qn6fCqxMYpRBnfqvxGh_MilPOYliDyA1AF48wj89ABVQQyxNfADQHroWquZdQs9bIOaBrwspEFiRJMnQXxMS8Tz6Qurb4g2VFFL7FpABaqdIXGFHNHpHM6pexevqN3ROA_fiLIMkA2doUFL9R0ECtV1MW6FEo_tnYcY4uNPrnum9G6-Qkpo1B5B5FEl1NMwj_GNAL6WNNfjdDbVVHL8OGrNN2vDnsCAmB4ta',
    age: '68 años',
    lastVisitDate: '05 Feb, 2024',
    lastVisitReason: 'Post-operatorio',
    nextVisitDate: '28 Mar, 11:30',
    nextVisitStatus: 'Pendiente',
    statusColor: 'amber'
  },
  {
    id: '#VA-2024-089',
    name: 'Sofía Morales',
    photoUrl: '',
    age: '29 años',
    lastVisitDate: 'Sin visitas previas',
    lastVisitReason: '',
    nextVisitDate: 'Hoy, 16:45',
    nextVisitStatus: 'Nuevo ingreso',
    statusColor: 'primary'
  },
  {
    id: '#VA-2023-956',
    name: 'Javier Ortiz',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgiuLH_kqMnMAm-hjr_-rOtNxW5iEOVyhtUgJ6Pmspl3LybqLQnUnEsGHcXGZZ48AGTxU_FJ0_AQKlnEKOXM6eQAQKvmZCni4Hploa62g27RZ1NCEztbe5Bm63K6fspsOdRPDSUDA7VLViCl0Ig203pyixulI-SIWPVt_CuToCS_fNWxfDRwjq1F4BciVMOlq68eUqSGYInJlaSWgV_Q3s0zhCM439sXPTbjOcqeiHe_pskPFVETtl9HwMkBxehl_B-hhonY2_i8Zs',
    age: '35 años',
    lastVisitDate: '20 Feb, 2024',
    lastVisitReason: 'Revisión RM',
    nextVisitDate: 'No programada',
    nextVisitStatus: '',
    statusColor: 'none'
  }
];

export function PatientPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto min-h-screen">
      {/* Page Header & Main CTA */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Directorio de Pacientes</h2>
          <p className="text-on-surface-variant mt-1 text-lg">Gestione el historial clínico y la agenda de sus pacientes.</p>
        </div>
        <Button className="bg-linear-to-br from-primary to-primary-container text-white px-6 py-6 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all text-base hover:opacity-90">
          <UserPlus className="w-5 h-5" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Bento Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-0 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-surface-container rounded-lg text-on-surface-variant">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Total</span>
          </div>
          <div>
            <p className="text-4xl font-black text-on-surface">1,284</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">Pacientes registrados</p>
          </div>
        </Card>

        <Card className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-0 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Confirmados</span>
          </div>
          <div>
            <p className="text-4xl font-black text-emerald-600">842</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">Para esta semana</p>
          </div>
        </Card>

        <Card className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-0 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Pendientes</span>
          </div>
          <div>
            <p className="text-4xl font-black text-amber-600">56</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">Requieren atención</p>
          </div>
        </Card>

        <Card className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-0 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-50 rounded-lg text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Nuevos</span>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">12</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">Este mes</p>
          </div>
        </Card>
      </div>

      {/* Patient Directory Table Section */}
      <Card className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.05)] border-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg text-on-surface">Listado Maestro</h3>
            <div className="flex gap-2">
              <Badge variant="secondary" className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-semibold hover:bg-surface-container-low border-0">Todos</Badge>
              <Badge variant="outline" className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-low rounded-full text-xs font-semibold transition-colors cursor-pointer border-0">Crónicos</Badge>
              <Badge variant="outline" className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-low rounded-full text-xs font-semibold transition-colors cursor-pointer border-0">Urgentes</Badge>
            </div>
          </div>
          <Button variant="ghost" className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary hover:bg-primary/5">
            <Filter className="w-5 h-5" />
            Filtros Avanzados
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Paciente</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Edad</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Última Cita</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Próxima Cita</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Contacto</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {PATIENTS_DATA.map((patient, index) => (
                <tr key={index} className="hover:bg-surface-container-lowest/60 bg-surface-container-lowest transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border border-outline-variant/10">
                        {patient.photoUrl ? (
                          <AvatarImage src={patient.photoUrl} alt={patient.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                            {patient.name.substring(0, 2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{patient.name}</p>
                        <p className="text-xs text-on-surface-variant/60 font-mono">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-on-surface-variant">{patient.age}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex flex-col ${patient.lastVisitReason ? '' : 'text-on-surface-variant/50'}`}>
                      <p className={`text-sm font-medium ${patient.lastVisitReason ? 'text-on-surface' : 'italic'}`}>
                        {patient.lastVisitDate}
                      </p>
                      {patient.lastVisitReason && (
                        <p className="text-[10px] text-on-surface-variant/70">{patient.lastVisitReason}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {patient.nextVisitStatus ? (
                      <div className={`px-3 py-1 rounded-lg inline-flex flex-col ${
                        patient.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        patient.statusColor === 'amber' ? 'bg-amber-50 text-amber-600' :
                        'bg-primary/5 text-primary'
                      }`}>
                        <p className="text-xs font-bold">{patient.nextVisitDate}</p>
                        <p className="text-[9px] uppercase tracking-tighter">{patient.nextVisitStatus}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant/50 italic">{patient.nextVisitDate}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-surface-container-low text-on-surface-variant hover:text-primary rounded-lg transition-all">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-surface-container-low text-on-surface-variant hover:text-primary rounded-lg transition-all">
                        <PhoneCall className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-primary" title="Editar historial">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-emerald-600" title="Ver perfil completo">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant/60 hover:text-error" title="Archivar">
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant/70">Mostrando 1 a 10 de 1,284 pacientes</p>
          <div className="flex gap-1 items-center">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant/60 hover:bg-surface-container-lowest">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg bg-primary text-white border-0 hover:bg-primary shadow-sm font-bold text-xs">
              1
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-lowest text-xs">
              2
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-lowest text-xs">
              3
            </Button>
            <span className="px-2 self-center text-on-surface-variant/50 text-xs">...</span>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-outline-variant/20 text-on-surface-variant/60 hover:bg-surface-container-lowest">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Asymmetric Quick Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-surface-container-low/40 rounded-3xl p-8 border border-outline-variant/5">
          <h4 className="font-bold text-on-surface mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Actividad Reciente del Directorio
          </h4>
          <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
            <div className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-6 h-6 bg-surface-container-lowest border-2 border-emerald-500 rounded-full flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <p className="text-sm font-bold text-on-surface">Nuevo paciente registrado</p>
              <p className="text-xs text-on-surface-variant">Elena Rodriguez ha completado su registro digital vía VitalAgent AI.</p>
              <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase font-semibold">Hace 12 minutos</p>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-6 h-6 bg-surface-container-lowest border-2 border-primary rounded-full flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <p className="text-sm font-bold text-on-surface">Historial actualizado</p>
              <p className="text-xs text-on-surface-variant">Se han adjuntado nuevos resultados de laboratorio al perfil de Carlos Méndez.</p>
              <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase font-semibold">Hace 1 hora</p>
            </div>
          </div>
        </div>

        {/* Stats/Distribution (Editorial Feel) */}
        <div className="bg-linear-to-br from-[#191c1e] to-on-primary-fixed rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-primary-fixed-dim border-b border-white/10 pb-2 mb-2">Distribución Mensual</h4>
            <p className="text-lg font-bold leading-tight">Crecimiento constante de pacientes este trimestre.</p>
          </div>
          
          {/* Simple CSS Chart */}
          <div className="flex items-end gap-2 mt-8 h-32">
            <div className="flex-1 bg-white/10 rounded-t-lg h-[40%] transition-all hover:bg-white/20"></div>
            <div className="flex-1 bg-white/10 rounded-t-lg h-[60%] transition-all hover:bg-white/20"></div>
            <div className="flex-1 bg-white/20 rounded-t-lg h-[55%] transition-all hover:bg-white/30"></div>
            <div className="flex-1 bg-primary rounded-t-lg h-[85%] transition-all hover:bg-primary-fixed-dim shadow-[0_0_15px_rgba(5,150,105,0.4)]"></div>
            <div className="flex-1 bg-white/30 rounded-t-lg h-[70%] transition-all hover:bg-white/40"></div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs font-bold border-t border-white/10 pt-4">
              <span>Eficiencia de IA</span>
              <span className="text-primary-fixed-dim bg-primary/20 px-2 py-1 rounded">+24%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
