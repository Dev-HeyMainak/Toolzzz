
import { ToolCard } from '@/components/ToolCard';
import { TOOLS, TOOL_CATEGORIES } from '@/config/tools';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header
        className="mb-12 text-center opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        <h1 className="text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
          Office <span className="text-primary">Toolkit</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
          Your free suite of essential tools for everyday office productivity. Modernized.
        </p>
      </header>

      <p
        className="mb-16 text-center text-base text-muted-foreground sm:text-lg max-w-3xl mx-auto opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        Welcome! Dive into our curated collection of robust and easy-to-use tools, thoughtfully organized by category. Whether you're looking to manipulate text, manage tasks, or utilize digital utilities, Office Toolkit is here to streamline your workflow.
      </p>

      {TOOL_CATEGORIES.map((category, index) => (
        <section
          key={category.id}
          className="mb-20 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${0.5 + index * 0.3}s` }} // Adjusted base delay and stagger
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
                // Stagger cards within each category section
                style={{ animationDelay: `${0.5 + index * 0.3 + (toolIndex + 1) * 0.1}s` }}
              >
                <ToolCard
                  name={tool.name}
                  description={tool.description}
                  href={tool.href}
                  icon={tool.icon}
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
