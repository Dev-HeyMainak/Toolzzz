import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import type { SVGProps } from 'react';
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-xl font-bold group">
      <Briefcase className={cn("h-7 w-7 text-primary group-hover:animate-pulse", className)} {...props} />
      <span className="text-foreground group-hover:text-primary transition-colors">Office Toolkit</span>
    </Link>
  );
}
