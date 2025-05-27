
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
        "flex items-center gap-3 rounded-lg border border-input bg-card p-4 text-card-foreground shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary hover:bg-muted/60 active:scale-[0.97]",
        className
      )}
    >
      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
      <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{name}</span>
    </Link>
  );
}
