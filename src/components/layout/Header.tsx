import { Logo } from '@/components/Logo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Placeholder for User Profile Dropdown if needed later */}
        </div>
      </div>
    </header>
  );
}
