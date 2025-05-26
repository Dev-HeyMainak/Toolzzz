import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Office Toolkit. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/contact" className="text-sm hover:underline underline-offset-4 text-muted-foreground">
              Contact
            </Link>
            <Link href="/privacy-policy" className="text-sm hover:underline underline-offset-4 text-muted-foreground">
              Privacy Policy
            </Link>
            <Link href="/feedback" className="text-sm hover:underline underline-offset-4 text-muted-foreground">
              Feedback
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
