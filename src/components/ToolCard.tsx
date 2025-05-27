
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
        "group flex flex-col h-full bg-card border border-border/60 hover:border-primary/50 hover:shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden transform hover:-translate-y-1",
        animationDelay && "opacity-0 animate-fade-in-up"
      )}
      style={animationDelay ? { animationDelay } : {}}
    >
      <CardHeader className="flex flex-row items-center gap-4 p-5">
        <div className={cn(
            "p-3 rounded-lg bg-primary/10 text-primary transition-colors duration-300 flex-shrink-0", // Removed group-hover:bg-primary group-hover:text-primary-foreground
            "group-hover:[&_svg]:animate-subtle-spin-hover"
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow pb-4">
        <CardDescription className="text-sm text-muted-foreground mb-0 min-h-[40px] leading-relaxed">{description}</CardDescription>
      </CardContent>
      <div className="p-5 pt-0 mt-auto">
        <Button
          asChild
          variant="outline"
          className="w-full group/button bg-transparent border-input hover:border-primary text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 ease-in-out active:scale-95"
        >
          <Link href={href}>
            Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
