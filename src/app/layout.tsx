
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Footer } from '@/components/layout/Footer';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
      <body className={`${poppins.variable} antialiased bg-background`} suppressHydrationWarning>
        <SidebarProvider defaultOpen={false}>
          <Sidebar side="left">
            <AppSidebar />
          </Sidebar>
          <div className="flex flex-col min-h-screen w-full overflow-hidden">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
