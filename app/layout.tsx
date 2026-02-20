import './globals.css';
import 'lenis/dist/lenis.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SmoothScroll } from '@/components/SmoothScroll';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Jasim's Space | Product Showcase",
  description: 'A digital lab where ideas transform into products. Explore tools, apps, and experiments crafted with passion and precision.',
  keywords: ['products', 'tools', 'apps', 'showcase', 'portfolio', 'web development'],
  authors: [{ name: 'Jasim' }],
  openGraph: {
    title: "Jasim's Space | Product Showcase",
    description: 'A digital lab where ideas transform into products.',
    type: 'website',
    siteName: "Jasim's Space",
    images: [
      {
        url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: "Jasim's Space",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jasim's Space | Product Showcase",
    description: 'A digital lab where ideas transform into products.',
    images: ['https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
