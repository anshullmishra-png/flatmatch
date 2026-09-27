import type { Metadata } from 'next';
import { Archivo_Black, Space_Mono, Inter } from 'next/font/google';
import './globals.css';

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FlatMatch',
  description: 'Fill in your must-haves before you fall in love with a flat.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${spaceMono.variable} ${inter.variable}`}>
      <body className="font-body bg-paper text-ink">{children}</body>
    </html>
  );
}
