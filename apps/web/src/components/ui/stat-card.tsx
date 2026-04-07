import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './card';

interface StatCardProps {
  icon: LucideIcon;
  /** Clases de color para el icono y su fondo (ej. "bg-primary/10 text-primary") */
  iconColorClass: string;
  label: string;
  value: string | number;
  badge?: React.ReactNode;
}

/**
 * Tarjeta de métrica de un solo valor.
 * Usada en dashboard y directorio de pacientes.
 */
export function StatCard({ icon: Icon, iconColorClass, label, value, badge }: StatCardProps) {
  return (
    <Card className="bg-surface-container-lowest border-0 shadow-[0_20px_50px_rgba(5,150,105,0.05)] group hover:bg-surface-container-low transition-all">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-xl ${iconColorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          {badge && <div>{badge}</div>}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wider text-on-surface-variant font-bold">{label}</p>
          <h3 className="text-4xl font-extrabold text-on-surface mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
