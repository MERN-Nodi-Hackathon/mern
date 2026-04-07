import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Bot, Users, UserCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendario', icon: Calendar },
  { to: '/agent', label: 'IA Agent', icon: Bot },
  { to: '/patient', label: 'Pacientes', icon: Users },
  { to: '/personal', label: 'Personal', icon: UserCircle },
  { to: '/settings', label: 'Configuración', icon: Settings },
];

export function AppShell() {
  return (
    <div className="app-shell-frame flex min-h-screen bg-(--background) text-(--foreground)">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col gap-4 border-r border-(--border) bg-(--surface-container-low) p-6">
        <div className="flex items-center gap-2 px-2 py-4">
          <h1 className="headline-display text-2xl font-bold tracking-tight">VitalAgent</h1>
        </div>
        <nav className="flex flex-col gap-1 mt-4">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-(--primary) text-(--on-primary) shadow-sm'
                    : 'text-(--muted-foreground) hover:bg-(--surface-container-high) hover:text-(--foreground)'
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Placeholder Header */}
        <header className="h-16 flex items-center justify-between border-b border-(--border) px-8 bg-(--background)">
          <div className="text-sm text-(--muted-foreground)">Visión General</div>
          <div className="text-sm font-medium">Perfil Clínico</div>
        </header>

        {/* Dynamic Route Rendering */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
