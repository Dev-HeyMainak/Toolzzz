
"use client";

import { Zap } from 'lucide-react'; 
import { ToolCard } from '@/components/ToolCard';
import { TOOLS } from '@/config/tools';

export default function ProToolsPage() {
  // Filter for tools marked as Pro
  const proTools = TOOLS.filter(tool => tool.isPro);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <header className="mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <Zap className="h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Office Suite+ Tools
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Explore the advanced utilities available exclusively with Toolzzz Pro. These tools are designed to give you an edge and boost your productivity further.
        </p>
      </header>

      {proTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto">
          {proTools.map((tool, toolIndex) => (
            <ToolCard
              key={tool.id}
              name={tool.name}
              description={tool.description}
              href={tool.href}
              icon={tool.icon}
              animationDelay={`${0.3 + toolIndex * 0.05}s`}
            />
          ))}
        </div>
      ) : (
        <section className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">More Pro Tools Coming Soon!</h2>
          <p className="text-muted-foreground mb-4 text-center">
            We are actively developing a suite of exclusive tools designed for our Pro users. These tools will offer enhanced capabilities, deeper insights, and more powerful features to take your workflow to the next level.
          </p>
          <p className="text-muted-foreground mt-6 text-center">
            Stay tuned for updates, and thank you for your interest in Toolzzz Pro! You can see our current Pro offerings on the <Link href="/office-suite" className="text-primary hover:underline">Office Suite+ page</Link>.
          </p>
        </section>
      )}
    </div>
  );
}

