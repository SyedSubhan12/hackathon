import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider'; // Import the provider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});


export const metadata: Metadata = {
  title: 'LabLex - Understand Your Lab Reports',
  description: 'Upload medical lab reports, get AI-powered explanations, and download summaries.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="custom-scrollbar">
      {/* Removed whitespace here that was causing a hydration error */}
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen bg-background text-foreground`}>
        <ReactQueryProvider> {/* Wrap with QueryProvider */}
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
