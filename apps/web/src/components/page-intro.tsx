import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

export function PageIntro({ eyebrow, title, description, actions, className }: PageIntroProps) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="max-w-3xl">
        <p className="eyebrow text-[11px] text-[var(--muted)]">{eyebrow}</p>
        <h1 className="headline-display mt-2 text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
