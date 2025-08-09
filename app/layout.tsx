import './globals.css';

import Footer from '@/components/footer';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Providers } from '@/app/lib/providers';

// testr

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Ajnails',
  description: 'Book your beauty appointments online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
