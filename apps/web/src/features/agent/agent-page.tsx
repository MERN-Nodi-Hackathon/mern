export function AgentPage() {
  // TODO: Add endpoint integration for AI Agent / VitalAgent here
  
  return (
    <div className="flex justify-center h-full gap-6">
      <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-8rem)]">
        <header className="mb-6">
          <h1 className="headline-display text-3xl font-semibold text-(--foreground)">
            AI Agent
          </h1>
          <p className="text-(--muted-foreground) mt-1">
            Asistente clínico inteligente.
          </p>
        </header>

        <div className="editorial-card flex-1 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex-1 overflow-auto">
            {/* TODO: AI Chat Message History UI here */}
            <p className="text-(--muted-foreground) text-sm">Interacción con agente en construcción...</p>
          </div>
          
          <div className="mt-4 border-t border-(--border) pt-4">
             {/* TODO: Implement Shadcn Input / Action Buttons for Chat here */}
          </div>
        </div>
      </div>
    </div>
  );
}
