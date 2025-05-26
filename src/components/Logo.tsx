import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
      <Briefcase className={cn("h-6 w-6 text-primary", className)} {...props} />
      <span className="text-foreground">Office Toolkit</span>
    </Link>
  );
}

// Helper cn function if not globally available, or import from "@/lib/utils"
// For components, it's better to import `cn`
import { cn } from "@/lib/utils";
