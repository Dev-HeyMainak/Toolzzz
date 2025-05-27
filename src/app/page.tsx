
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
        <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
          Tool<span className="text-primary font-bold">zzz</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
          Add a little <span className='text-primary font-bold'>structure</span> to your files
        </p>
      </header>
      <p
        className="mb-16 text-center text-base text-muted-foreground sm:text-lg max-w-3xl mx-auto opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        Welcome! Dive into our curated collection of robust and easy-to-use tools, thoughtfully organized by category. Whether you&apos;re looking to manipulate text, manage tasks, or utilize digital utilities, Toolzzz is here to streamline your workflow.
      </p>

      {TOOL_CATEGORIES.map((category, index) => (
        <section
          key={category.id}
          className="mb-16 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${0.5 + index * 0.15}s` }}
        >
          <div className="flex items-center mb-8">
            <category.icon className="h-7 w-7 text-primary mr-3" />
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">{category.name}</h2>
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

      <section
        className="my-20 opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${0.6 + TOOL_CATEGORIES.length * 0.15}s` }}
      >
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Curated by Toolzzz</h2>
          <p className="text-muted-foreground mt-1">Explore these handpicked resources.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative flex flex-col rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-8 text-primary-foreground shadow-2xl transition-all hover:scale-[1.02] hover:shadow-purple-500/30">
            <div className="absolute -right-4 -top-4 h-32 w-32 opacity-20 group-hover:opacity-30 transition-opacity">
               <Image src="https://placehold.co/200x200.png" alt="Abstract graphic 1" layout="fill" objectFit="contain" data-ai-hint="abstract shapes" className="rounded-lg"/>
            </div>
            <p className="text-sm font-medium uppercase tracking-wider opacity-80">15+ Tools</p>
            <h3 className="mt-2 text-3xl font-bold">Collaborate & Innovate</h3>
            <p className="mt-3 text-base opacity-90 flex-grow">
              Boost team productivity with tools designed for seamless collaboration and creative brainstorming.
            </p>
            <Button variant="ghost" className="mt-6 self-start bg-white/20 hover:bg-white/30 text-white">
              Explore Collaboration Tools <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="group relative flex flex-col rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 p-8 text-primary-foreground shadow-2xl transition-all hover:scale-[1.02] hover:shadow-pink-500/30">
             <div className="absolute -left-4 -bottom-4 h-32 w-32 opacity-20 group-hover:opacity-30 transition-opacity">
               <Image src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx0ZWNofGVufDB8fHx8MTc0ODIxMTY2NXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Abstract graphic 2" layout="fill" objectFit="contain" data-ai-hint="geometric pattern" className="rounded-lg"/>
            </div>
            <p className="text-sm font-medium uppercase tracking-wider opacity-80">20+ Utilities</p>
            <h3 className="mt-2 text-3xl font-bold">Discover New Utilities</h3>
            <p className="mt-3 text-base opacity-90 flex-grow">
              Streamline your workflow with a fresh batch of plugins and smart widgets.
            </p>
             <Button variant="ghost" className="mt-6 self-start bg-white/20 hover:bg-white/30 text-white">
              View New Widgets <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
