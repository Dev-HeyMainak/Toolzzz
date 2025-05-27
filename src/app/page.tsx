
import { ToolLinkPill } from '@/components/ToolLinkPill';
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header
        className="mb-12 text-center opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        <h1 className="text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
          Tool<span className="text-primary font-bold">zzz</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
          Smart tools for smoother days.
        </p>
      </header>
      <p
        className="mb-16 text-center text-base text-muted-foreground sm:text-lg max-w-3xl mx-auto opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        Welcome to Toolzzz, your go-to hub for smart, free online utilities! We&apos;ve assembled a powerful suite of easy-to-use tools, all designed to simplify your digital tasks. From text wizardry and productivity boosters to essential digital converters, Toolzzz is built to make your workflow smoother and your day a little easier. Explore our categories and discover how we can help you get things done, effortlessly.
      </p>

      {TOOL_CATEGORIES.map((category, index) => (
        <section
          key={category.id}
          className="mb-20 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${0.5 + index * 0.15}s` }}
        >
          <div className="flex items-center mb-10">
            <category.icon className="h-8 w-8 text-primary mr-4 md:h-10 md:w-10" />
            <h2 className="text-3xl font-bold text-foreground tracking-tight md:text-4xl">{category.name}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {TOOLS.filter(tool => tool.categoryKey === category.id).map((tool, toolIndex) => (
              <div
                key={tool.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.55 + index * 0.15 + (toolIndex + 1) * 0.04}s` }}
              >
                <ToolLinkPill
                  name={tool.name}
                  href={tool.href}
                  icon={tool.icon}
                />
              </div>
            ))}
          </div>
          {index < TOOL_CATEGORIES.length -1 && <Separator className="my-16 border-border/50" />}
        </section>
      ))}

      {/* Removed Curated by Toolzzz section */}
    </div>
  );
}
