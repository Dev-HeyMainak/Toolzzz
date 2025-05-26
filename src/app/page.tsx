import { ToolCard } from '@/components/ToolCard';
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-16 text-center opacity-0 animate-fade-in-up">
        <h1 className="text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
          <span className="block">Office</span>
          <span className="block text-primary">Toolkit</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
          Your free suite of essential tools for everyday office productivity. Modernized.
        </p>
      </header>

      {TOOL_CATEGORIES.map((category, index) => (
        <section 
          key={category.id} 
          className="mb-20 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${(index + 1) * 0.2}s` }}
        >
          <div className="flex items-center mb-10">
            <category.icon className="h-10 w-10 text-primary mr-4" />
            <h2 className="text-4xl font-bold text-foreground tracking-tight">{category.name}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TOOLS.filter(tool => tool.categoryKey === category.id).map((tool, toolIndex) => (
              <div 
                key={tool.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.2 + (toolIndex + 1) * 0.1}s` }}
              >
                <ToolCard
                  name={tool.name}
                  description={tool.description}
                  href={tool.href}
                  icon={tool.icon}
                  dataAiHint={tool.dataAiHint}
                />
              </div>
            ))}
          </div>
          {TOOL_CATEGORIES.indexOf(category) < TOOL_CATEGORIES.length -1 && <Separator className="my-16 border-border/50" />}
        </section>
      ))}
    </div>
  );
}
