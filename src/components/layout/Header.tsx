
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export function Header() {
  const pathname = usePathname();
  const { toggleSidebarPanel } = useSidebar();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
    { href: '/pro', label: 'Upgrade to Pro' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2"> {/* Left side container */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarPanel}
            className="text-foreground hover:text-primary h-9 w-9"
            aria-label="Toggle Sidebar Panel"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Logo />
        </div>

        {/* Right side container */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
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
          <ThemeToggle />
          {/* Auth UI removed */}
        </div>
      </div>
    </header>
  );
}
