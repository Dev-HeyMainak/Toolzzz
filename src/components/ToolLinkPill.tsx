
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ToolLinkPillProps {
  href: string;
  icon: LucideIcon;
  name: string;
  className?: string;
}

export function ToolLinkPill({ href, icon: Icon, name, className }: ToolLinkPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:border-primary/70 hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      <div className="rounded-md bg-primary/10 p-2 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-medium text-sm">{name}</span>
    </Link>
  );
}
