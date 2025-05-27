
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Use Poppins
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Footer } from '@/components/layout/Footer';
import { MainLayoutClientBoundary } from '@/components/layout/MainLayoutClientBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';

const poppins = Poppins({ // Configure Poppins
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Added various weights
});

export const metadata: Metadata = {
  title: 'Toolzzz - Your Free Online Utilities',
  description: 'A collection of free utilities for everyday tasks: text tools, productivity aids, digital converters, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${poppins.variable} font-sans antialiased bg-background`} // Use Poppins variable, ensure font-sans is a fallback
        suppressHydrationWarning
      >
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <Sidebar side="left">
              <AppSidebar />
            </Sidebar>
            <div className="flex flex-col min-h-screen w-full overflow-hidden">
              <Header />
              <MainLayoutClientBoundary>
                {children}
              </MainLayoutClientBoundary>
              <Footer />
            </div>
          </SidebarProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
