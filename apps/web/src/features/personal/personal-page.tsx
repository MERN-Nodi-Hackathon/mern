export function PersonalPage() {
  // TODO: Add endpoint integration for Personal / Team management here
  
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="headline-display text-3xl font-semibold text-(--foreground)">
          Personal
        </h1>
        <p className="text-(--muted-foreground) mt-1">
          Directorio del equipo clínico y staff.
        </p>
      </header>
      
      <div className="editorial-card rounded-3xl p-6">
        {/* TODO: Implement Team Directory UI here */}
        <p className="text-(--muted-foreground) text-sm">Directorio de personal en construcción...</p>
      </div>
    </div>
  );
}
