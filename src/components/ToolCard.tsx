
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  animationDelay?: string;
}

export function ToolCard({ name, description, href, icon: Icon, animationDelay }: ToolCardProps) {
  return (
    <Card
      className={cn(
        "group flex flex-col h-full",
        "bg-muted/20", 
        "backdrop-blur-md", 
        "border border-border/40", 
        "hover:border-primary hover:shadow-lg hover:shadow-primary/15", 
        "transition-all duration-300 ease-in-out rounded-xl overflow-hidden",
        "transform hover:-translate-y-1",
        animationDelay && "opacity-0 animate-fade-in-up"
      )}
      style={animationDelay ? { animationDelay } : {}}
    >
      <CardHeader className="flex flex-row items-center gap-2 p-3"> {/* Reduced padding and gap */}
        <div className={cn(
            "p-2 rounded-lg bg-primary/10 text-primary transition-colors duration-300 flex-shrink-0", // Kept p-2 for icon wrapper, icon itself smaller
            "group-hover:[&_svg]:animate-subtle-spin-hover" 
          )}
        >
          <Icon className="h-5 w-5" /> {/* Reduced icon size */}
        </div>
        <div>
          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{name}</CardTitle> {/* Reduced font size */}
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow pb-2"> {/* Reduced padding */}
        <CardDescription className="text-xs text-muted-foreground mb-0 min-h-[30px] leading-relaxed">{description}</CardDescription> {/* Reduced font size and min-height */}
      </CardContent>
      <div className="p-3 pt-0 mt-auto"> {/* Reduced padding */}
        <Button
          asChild
          size="sm" // Kept size="sm", icon inside button also adjusted
          variant="outline"
          className="w-full group/button bg-transparent border-input hover:border-primary text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 ease-in-out active:scale-95"
        >
          <Link href={href}>
            Open Tool <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover/button:translate-x-0.5 transition-transform" /> {/* Adjusted icon margin and size */}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
