
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Footer } from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Office Toolkit - Your Free Online Office Tools',
  description: 'A collection of free tools for everyday office tasks: text utilities, QR generator, password manager, email validator, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
        <SidebarProvider defaultOpen={false}> {/* Panel is closed by default */}
          <Sidebar side="left"> {/* This is the Sheet wrapper */}
            <AppSidebar /> {/* This is the content of the Sheet */}
          </Sidebar>
          <div className="flex flex-col min-h-screen w-full overflow-hidden"> {/* Main content area */}
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
