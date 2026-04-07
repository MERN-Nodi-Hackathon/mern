interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * Encabezado estándar de página con título, descripción y una acción opcional.
 * Reutilizable en todas las páginas principales de la aplicación.
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-end border-b border-outline-variant/10 pb-6 mb-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">{title}</h2>
        {description && (
          <p className="text-on-surface-variant mt-1 text-lg">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
