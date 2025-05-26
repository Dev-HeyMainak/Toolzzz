import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  dataAiHint?: string;
}

export function ToolCard({ name, description, href, icon: Icon, dataAiHint }: ToolCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/30">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm mb-4 min-h-[40px]">{description}</CardDescription>
         {dataAiHint && (
          <div className="aspect-[3/2] w-full relative rounded-md overflow-hidden mb-4">
            <Image
              src={`https://placehold.co/600x400.png`}
              alt={name}
              fill
              className="object-cover"
              data-ai-hint={dataAiHint}
            />
          </div>
        )}
      </CardContent>
      <div className="p-4 pt-0 mt-auto">
        <Button asChild variant="outline" className="w-full group">
          <Link href={href}>
            Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
