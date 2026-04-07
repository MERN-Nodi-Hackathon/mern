export function PatientPage() {
  // TODO: Add endpoint integration for Patient management here
  
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="headline-display text-3xl font-semibold text-(--foreground)">
          Pacientes
        </h1>
        <p className="text-(--muted-foreground) mt-1">
          Base de datos y perfiles de pacientes.
        </p>
      </header>
      
      <div className="editorial-card rounded-3xl p-6">
        {/* TODO: Implement Shadcn Tables/Lists of patients here */}
        <p className="text-(--muted-foreground) text-sm">Lista de pacientes en construcción...</p>
      </div>
    </div>
  );
}
