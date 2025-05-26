import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function ToolCard({ name, description, href, icon: Icon }: ToolCardProps) {
  return (
    <Card className="group flex flex-col h-full bg-card hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ease-in-out hover:border-primary/50 rounded-xl overflow-hidden transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-4 p-5">
        <div className="p-3.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow pb-5"> {/* Ensure some bottom padding in content */}
        <CardDescription className="text-sm text-muted-foreground mb-0 min-h-[40px] leading-relaxed">{description}</CardDescription>
      </CardContent>
      <div className="p-5 pt-0 mt-auto">
        <Button
          asChild
          variant="outline"
          className="w-full group/button bg-transparent border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 ease-in-out hover:shadow-md hover:shadow-primary/20 active:scale-95"
        >
          <Link href={href}>
            Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
