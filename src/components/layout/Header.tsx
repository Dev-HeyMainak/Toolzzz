
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TOOLS, TOOL_CATEGORIES, type Tool } from '@/config/tools';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const normalizeForSearch = (text: string): string => {
      return text.toLowerCase().replace(/[^a-z0-9]/gi, '');
    };

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }

    const normalizedQuery = normalizeForSearch(searchQuery);

    const filtered = TOOLS.filter((tool) => {
      const normalizedToolName = normalizeForSearch(tool.name);
      const normalizedToolDescription = normalizeForSearch(tool.description);
      
      return normalizedToolName.includes(normalizedQuery) || normalizedToolDescription.includes(normalizedQuery);
    });

    setSearchResults(filtered);
    setIsResultsVisible(filtered.length > 0);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);
  
  const closeSearch = () => {
    setSearchQuery('');
    setIsResultsVisible(false);
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
        pathname === href ? "text-primary bg-muted/50" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Right Section: Navigation & Search */}
        <div className="flex items-center gap-x-2 md:gap-x-4">
          <nav className="hidden items-center gap-x-1 md:flex lg:gap-x-2">
            <NavLink href="/" label="Home" />
            <NavLink href="/contact" label="Contact" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary text-muted-foreground",
                    (pathname.startsWith('/tools/') || TOOL_CATEGORIES.some(cat => pathname === `/#${cat.id}`)) && "text-primary bg-muted/50"
                  )}
                >
                  Tools <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {TOOL_CATEGORIES.map((category) => (
                  <Link key={category.id} href={`/#${category.id}`} passHref legacyBehavior>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <a><category.icon className="mr-2 h-4 w-4 text-muted-foreground" />{category.name}</a>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink href="/office-suite" label="Office Suite+" />
            <NavLink href="/pricing" label="Pricing" />
            <NavLink href="/about" label="About" />
          </nav>
          
          <div ref={searchRef} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsResultsVisible(searchQuery.length > 0 && searchResults.length > 0)}
                className="h-9 w-full rounded-md pl-8 pr-2 text-sm sm:w-32 md:w-40 lg:w-48 bg-background border-input focus:border-primary"
                aria-label="Search tools"
              />
            </div>
            {isResultsVisible && searchResults.length > 0 && (
              <div className="absolute top-full mt-1.5 w-full min-w-[240px] sm:min-w-[280px] md:min-w-[300px] max-w-md rounded-md border bg-popover text-popover-foreground shadow-lg z-[51] right-0 md:left-auto md:right-0">
                <ScrollArea className="h-auto max-h-[300px] rounded-md p-1">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent"
                      onClick={closeSearch}
                    >
                      <tool.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
