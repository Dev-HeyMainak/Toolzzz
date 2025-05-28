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
        <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
          Tool<span className="text-primary font-bold">zzz</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Seamless solutions for your digital day.
        </p>
      </header>
      <p
        className="mb-16 text-center text-sm text-muted-foreground sm:text-base max-w-5xl mx-auto opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        Welcome to Toolzzz, your go-to hub for smart, free online utilities! We've assembled a powerful suite of easy-to-use tools, all designed to simplify your digital tasks. From text wizardry and productivity boosters to essential digital converters, Toolzzz is built to make your workflow smoother and your day a little easier. Explore our categories and discover how we can help you get things done, effortlessly.
      </p>

      {TOOL_CATEGORIES.map((category, index) => {
        const isFirst = index === 0;
        return (
          <section
            key={category.id}
            id={category.id} // Added ID for anchor linking
            className="mb-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${0.5 + index * 0.15}s` }}
          >
            <div className="flex items-center mb-10">
              <category.icon className="h-8 w-8 text-primary mr-4 md:h-10 md:w-10" />
              <h2 className="text-3xl font-bold text-foreground tracking-tight md:text-4xl">{category.name}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {TOOLS.filter(tool => tool.categoryKey === category.id).map((tool, toolIndex) => (
                <ToolCard
                  key={tool.id}
                  name={tool.name}
                  description={tool.description}
                  href={tool.href}
                  icon={tool.icon}
                  animationDelay={`${0.55 + index * 0.15 + (toolIndex + 1) * 0.05}s`}
                />
              ))}
            </div>
            {index < TOOL_CATEGORIES.length - 1 && <Separator className="my-16 border-border/50" />}
          </section>
        );
      })}
    </div>
  );
}
