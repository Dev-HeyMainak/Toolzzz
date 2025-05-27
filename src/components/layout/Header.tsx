
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TOOLS, type Tool } from '@/config/tools';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';


export function Header() {
  const pathname = usePathname();
  // const { toggleSidebarPanel } = useSidebar(); // No longer used here as logo toggles sidebar

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pro', label: 'Pro' },
    { href: '/contact', label: 'Contact' },
    { href: '/feedback', label: 'Feedback' },
  ];

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* LEFT SIDE: Logo (acts as sidebar toggle) */}
        <div className="flex items-center gap-x-2 shrink-0">
          {/* Sidebar toggle functionality is now on the Logo in AppSidebar via SheetTrigger or directly on Logo */}
          <Logo />
        </div>

        {/* RIGHT SIDE: Main Menu, Search Bar & Theme Toggle */}
        <div className="flex items-center gap-x-3 sm:gap-x-4">
            <nav className="hidden md:flex items-center gap-x-4 lg:gap-x-6">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
                >
                {link.label}
                </Link>
            ))}
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
                className="h-9 w-32 rounded-md pl-8 pr-2 text-sm sm:w-40 md:w-48 lg:w-56 bg-background border-input focus:border-primary"
                aria-label="Search tools"
              />
            </div>
            {isResultsVisible && searchResults.length > 0 && (
              <div className="absolute top-full mt-1.5 w-full min-w-[240px] sm:min-w-[280px] md:min-w-[300px] max-w-md rounded-md border bg-popover text-popover-foreground shadow-lg z-[51] right-0 md:left-auto md:right-0"> {/* Adjusted to right-align dropdown */}
                <ScrollArea className="h-auto max-h-[300px] rounded-md p-1">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent"
                      onClick={() => {
                        setSearchQuery(''); 
                        setIsResultsVisible(false); 
                      }}
                    >
                      <tool.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
          {/* ThemeToggle was removed previously as per user request */}
        </div>
      </div>
    </header>
  );
}
