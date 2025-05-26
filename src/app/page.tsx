import { ToolCard } from '@/components/ToolCard';
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Office Toolkit
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          Your free suite of essential tools for everyday office productivity.
        </p>
      </header>

      {TOOL_CATEGORIES.map((category) => (
        <section key={category.id} className="mb-16">
          <div className="flex items-center mb-8">
            <category.icon className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-semibold text-foreground">{category.name}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TOOLS.filter(tool => tool.categoryKey === category.id).map((tool) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
                dataAiHint={tool.dataAiHint}
              />
            ))}
          </div>
          {TOOL_CATEGORIES.indexOf(category) < TOOL_CATEGORIES.length -1 && <Separator className="my-12" />}
        </section>
      ))}
    </div>
  );
}
