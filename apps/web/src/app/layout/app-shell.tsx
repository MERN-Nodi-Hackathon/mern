import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Bot, Users, Settings, Plus, Search, Bell, ActivitySquare, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import data from '@/features/settings/user-company-data.json';

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
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-surface-container-low px-4 py-8 transition-transform duration-300 md:translate-x-0 outline-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-10 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-on-surface">{data.clinic.brandName}</h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {data.clinic.slogan}
            </p>
          </div>
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
                    : 'font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
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
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-primary to-primary-container px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(5,150,105,0.15)] transition-all hover:opacity-90 active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Nueva Cita
          </button>
          
          <div className="mt-6 flex items-center gap-3 px-1">
            <img
              src={data.user.photoUrl}
              alt="Perfil Admin"
              className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-on-surface">{data.user.fullName}</p>
              <p className="text-[10px] text-on-surface-variant">{data.user.role}</p>
            </div>
          </div>
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
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Buscar pacientes, registros o agentes..."
                className="w-full rounded-full border-none bg-surface-container-highest py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all placeholder:text-outline text-on-surface"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error"></span>
            </button>
            <div className="h-8 w-px bg-(--outline-variant)/30"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary">Bienvenido, {data.user.firstName}</span>
              <img
                src={data.user.photoUrl}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Route Rendering */}
        <div className="mt-16 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
