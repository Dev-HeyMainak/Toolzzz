
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
        "group flex flex-col h-full bg-card/90 backdrop-blur-lg supports-[backdrop-filter]:bg-card/70 border border-border/40 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl overflow-hidden transform hover:-translate-y-1",
        animationDelay && "opacity-0 animate-fade-in-up"
      )}
      style={animationDelay ? { animationDelay } : {}}
    >
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <div className={cn(
            "p-2 rounded-lg bg-primary/10 text-primary transition-colors duration-300 flex-shrink-0", 
            "group-hover:[&_svg]:animate-subtle-spin-hover"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow pb-3">
        <CardDescription className="text-sm text-muted-foreground mb-0 min-h-[36px] leading-relaxed">{description}</CardDescription>
      </CardContent>
      <div className="p-4 pt-0 mt-auto">
        <Button
          asChild
          size="sm"
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
