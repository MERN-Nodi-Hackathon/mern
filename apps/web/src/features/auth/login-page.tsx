export function LoginPage() {
  // TODO: Add data fetching authentication endpoint integration here (Supabase Login)
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background) px-6">
      <div className="w-full max-w-md editorial-card rounded-4xl p-8">
        <h1 className="headline-display text-3xl font-semibold text-(--foreground)">
          Iniciar Sesión
        </h1>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          Accede a tu portal utilizando tus credenciales.
        </p>
        
        {/* TODO: UI form con inputs Shadcn irá aquí */}
        <div className="mt-8">
          <p className="text-(--muted-foreground) text-sm">Formulario de acceso en construcción...</p>
        </div>
      </div>
    </div>
  );
}
