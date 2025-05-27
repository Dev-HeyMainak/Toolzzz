
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Floating Action Button Component
function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const quickTools = [
    { name: 'Case Converter', href: '/tools/case-converter' },
    { name: 'Password Generator', href: '/tools/password-generator' },
    { name: 'Word Counter', href: '/tools/word-counter' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-50">
      <div className={cn("flex flex-col items-end space-y-2 transition-all duration-300 ease-in-out", isOpen ? "mb-16" : "mb-0")}>
        {isOpen && quickTools.map((tool) => (
          <Button
            key={tool.href}
            asChild
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg hover:scale-105 w-auto px-4 py-2"
          >
            <Link href={tool.href}>{tool.name}</Link>
          </Button>
        ))}
      </div>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="rounded-full w-14 h-14 shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label="Quick Actions"
      >
        <Plus className={cn("h-7 w-7 transition-transform duration-300", isOpen && "rotate-45")} />
      </Button>
    </div>
  );
}

export function MainLayoutClientBoundary({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="search"][placeholder="Search tools..."]') as HTMLInputElement | null;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

  }, []);

  return (
    <>
      <main className="flex-1">
        {children}
      </main>
      {isClient && <FloatingActionButton />}
    </>
  );
}
