import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="app-shell-frame min-h-screen p-4 text-[var(--foreground)] md:p-6">
      <main className="editorial-card min-h-[calc(100vh-2rem)] rounded-[2rem]">
        <Outlet />
      </main>
    </div>
  );
}
