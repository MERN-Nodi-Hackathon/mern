import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Bot,
  Users,
  Settings,
  Plus,
  Search,
  Bell,
  ActivitySquare,
  Menu,
  X,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  getCurrentUser,
  getCompanyInfo,
  logout,
} from '@/services/auth.service';
import { getNotifications } from '@/services/clinic.service';
import { getPatients } from '@/services/patient.service';
import { getMedicalTeam } from '@/services/staff.service';
import { getEvents, createAppointment } from '@/services/calendar.service';
import { Clinic, User, InboxNotification } from '@/types/models';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const navigation = [
  { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendario', icon: Calendar },
  { to: '/agent', label: 'Config. Agente IA', icon: Bot },
  { to: '/patient', label: 'Pacientes', icon: Users },
  { to: '/personal', label: 'Personal', icon: ActivitySquare },
  { to: '/settings', label: 'Configuración', icon: Settings },
];

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    providerId: '',
    startDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  });
  const [patients, setPatients] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<InboxNotification[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [companyData, userData, notifsData] = await Promise.all([
        getCompanyInfo(),
        getCurrentUser(),
        getNotifications(),
      ]);
      setClinic(companyData);
      setUser(userData);
      setNotifications(notifsData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showNewAppointmentModal) {
      const fetchData = async () => {
        const [patientsData, staffData] = await Promise.all([
          getPatients(),
          getMedicalTeam(),
        ]);
        setPatients(patientsData);
        setProviders(staffData);
      };
      fetchData();
    }
  }, [showNewAppointmentModal]);

  const searchablePages = [
    ...navigation,
    { to: '/terms', label: 'Términos y Condiciones', icon: ShieldCheck },
  ];

  const filteredPages = searchablePages.filter(
    (page) =>
      page.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      searchQuery.length > 0,
  );

  const handleCreateAppointment = async () => {
    if (!formData.patientId || !formData.providerId || !formData.startDate || !formData.startTime) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsCreatingAppointment(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime || '17:00'}`);

      const result = await createAppointment({
        patientId: parseInt(formData.patientId),
        providerId: parseInt(formData.providerId),
        serviceId: 1, // Default service, could be extended
        startTime: startDateTime,
        endTime: endDateTime,
        notes: formData.notes,
      });

      if (result.success) {
        alert('Cita creada exitosamente');
        setShowNewAppointmentModal(false);
        setFormData({
          patientId: '',
          providerId: '',
          startDate: '',
          startTime: '',
          endTime: '',
          notes: '',
        });
        // Optionally refresh events
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Mobile background overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-surface-container-low px-4 py-8 transition-transform duration-300 md:translate-x-0 outline-none',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-10 px-2 flex justify-between items-center">
          <NavLink to="/dashboard" className="block outline-none">
            <img
              src="https://res.cloudinary.com/dkoqe8las/image/upload/v1775572969/logo_h_vitalagent_e5dfft.png"
              alt="vitalAgent Logo"
              className="h-14 w-auto object-contain"
            />
          </NavLink>
          <button
            className="md:hidden text-on-surface-variant"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'font-semibold text-primary bg-primary/10'
                    : 'font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-2">
          <button 
            onClick={() => setShowNewAppointmentModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-primary to-primary-container px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(5,150,105,0.15)] transition-all hover:opacity-90 active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Nueva Cita
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 flex min-h-screen flex-1 flex-col w-full">
        {/* TopNavBar */}
        <header className="fixed right-0 top-0 z-30 flex h-16 w-full md:w-[calc(100%-16rem)] items-center justify-between bg-surface/80 px-4 md:px-8 shadow-[0_20px_50px_rgba(5,150,105,0.05)] backdrop-blur-xl">
          <div className="flex flex-1 items-center gap-4">
            <button
              className="md:hidden text-on-surface hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-on-surface-variant/40" />
                <input
                  type="text"
                  placeholder="Buscar pacientes, configuración, términos o soporte..."
                  value={searchQuery}
                  onFocus={() => setIsSearchActive(true)}
                  onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-0 bg-surface-container-highest py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 transition-all text-on-surface ring-1 ring-outline-variant/10 shadow-sm"
                />
              </div>

              {/* Resultados de búsqueda */}
              {isSearchActive && filteredPages.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_rgba(5,150,105,0.15)] border border-outline-variant/10 overflow-hidden z-50">
                  {filteredPages.map((page) => (
                    <button
                      key={page.to}
                      onClick={() => navigate(page.to)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors text-left"
                    >
                      <page.icon className="w-4 h-4" />
                      {page.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  'relative flex items-center gap-2 p-2 rounded-xl transition-all',
                  isNotificationsOpen
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high',
                )}
              >
                <Bell className="w-5 h-5 shrink-0" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error border-2 border-surface shadow-sm"></span>
              </button>

              {/* Popover de Notificaciones */}
              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-surface-container-lowest rounded-3xl shadow-[0_30px_60px_rgba(5,150,105,0.2)] border border-outline-variant/10 overflow-hidden z-50 p-2">
                  <div className="px-4 py-3 flex justify-between items-center border-b border-outline-variant/5">
                    <span className="font-bold text-xs text-on-surface">
                      Notificaciones
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary">
                      {notifications.filter((n) => !n.isRead).length} Nuevas
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-2xl hover:bg-surface-container-low transition-all group"
                      >
                        <div className="flex gap-3">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                              notif.isRead
                                ? 'bg-surface-container-high'
                                : 'bg-primary/10 text-primary',
                            )}
                          >
                            {notif.isRead ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-[11px] font-medium text-on-surface leading-snug">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-on-surface-variant/60 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-outline-variant/30"></div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 px-2 rounded-xl hover:bg-surface-container-high transition-all"
              >
                <img
                  src={user?.photoUrl || 'https://via.placeholder.com/150'}
                  alt="Avatar"
                  className="h-8 w-8 rounded-lg object-cover ring-2 ring-primary/10"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                    Buenos días, {user?.firstName || '...'}
                    <ChevronDown className="w-3.5 h-3.5 opacity-40" />
                  </p>
                </div>
              </button>

              {/* Menu de Perfil */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-surface-container-lowest rounded-2xl shadow-[0_30px_60px_rgba(5,150,105,0.2)] border border-outline-variant/10 overflow-hidden z-50 p-1.5">
                  <div className="px-3 py-2 border-b border-outline-variant/5 mb-1">
                    <p className="text-[11px] font-bold text-on-surface">
                      {user?.fullName || 'Cargando...'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant truncate">
                      {user?.role || '...'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-error hover:bg-error/5 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Route Rendering */}
        <div className="mt-16 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Modal de Nueva Cita */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl">
            <div className="sticky top-0 bg-surface-container-low border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface">Nueva Cita</h2>
              <button 
                onClick={() => setShowNewAppointmentModal(false)}
                className="text-on-surface-variant hover:bg-surface-container-highest p-2 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-on-surface">Paciente *</Label>
                <select 
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-surface-container-highest border-0 text-on-surface text-sm"
                >
                  <option value="">Seleccionar paciente...</option>
                  {patients.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-on-surface">Médico/Provider *</Label>
                <select 
                  value={formData.providerId}
                  onChange={(e) => setFormData({...formData, providerId: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-surface-container-highest border-0 text-on-surface text-sm"
                >
                  <option value="">Seleccionar médico...</option>
                  {providers.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-on-surface">Fecha *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-surface-container-highest border-0 text-on-surface text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-on-surface">Inicio *</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-surface-container-highest border-0 text-on-surface text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-on-surface">Fin</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-surface-container-highest border-0 text-on-surface text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-on-surface">Notas</Label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-surface-container-highest border-0 text-on-surface text-sm"
                  rows={3}
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            <div className="bg-surface-container-low border-t border-outline-variant/10 px-6 py-4 flex gap-3 justify-end">
              <Button 
                variant="outline"
                onClick={() => setShowNewAppointmentModal(false)}
                className="px-6 py-2 text-sm font-bold"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateAppointment}
                disabled={isCreatingAppointment}
                className="px-6 py-2 text-sm font-bold bg-primary text-white hover:bg-primary/90"
              >
                {isCreatingAppointment ? 'Creando...' : 'Crear Cita'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
