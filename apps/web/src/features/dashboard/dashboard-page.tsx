export function DashboardPage() {
  // TODO: Add data fetching endpoints for Dashboard metrics here
  
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="headline-display text-3xl font-semibold text-(--foreground)">
          Dashboard
        </h1>
        <p className="text-(--muted-foreground) mt-1">
          Vista general y métricas clínicas.
        </p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* TODO: Implement Shadcn Metric Cards UI directly from design specs here */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="editorial-card rounded-3xl p-6 min-h-[120px]">
            <p className="text-(--muted-foreground) text-sm">Métrica Placeholder</p>
          </div>
        ))}
      </div>
    </div>
  );
}
