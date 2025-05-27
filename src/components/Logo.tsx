import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import type { SVGProps } from 'react';
import { cn } from "@/lib/utils";

export function Logo({ className, hideText = false, ...props }: SVGProps<SVGSVGElement> & { className?: string; hideText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-xl font-bold group">
      {/* Icon removed as per user request */}
      {!hideText && (
        <span className="text-foreground group-hover:text-primary transition-colors">Toolzzz</span>
      )}
    </Link>
  );
}
