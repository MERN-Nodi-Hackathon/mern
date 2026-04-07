import type { LucideIcon } from 'lucide-react';

interface SectionIconCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  /** Clase adicional para el contenedor raíz (ej. para col-span en grids) */
  className?: string;
  /** Slot adicional para colocar contenido junto al título (ej. un badge) */
  titleAddon?: React.ReactNode;
}

/**
 * Tarjeta de sección con icono verde, título y contenido genérico.
 * Sigue el "No-Line" UI: sin bordes, con sombras atmosphéricas.
 */
export function SectionIconCard({
  icon: Icon,
  title,
  children,
  className = '',
  titleAddon,
}: SectionIconCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest p-8 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.04)] ${className}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
            <Icon className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold text-on-surface">{title}</h4>
        </div>
        {titleAddon && <div>{titleAddon}</div>}
      </div>
      {children}
    </div>
  );
}
