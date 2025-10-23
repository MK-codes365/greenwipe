import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GoogleTranslateWidget } from '@/components/google-translate-widget';
// ...existing code...

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })


export const metadata: Metadata = {
  title: 'Green Wipe',
  description: 'Secure & Eco-Friendly Data Erasure.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} font-body antialiased bg-background text-foreground animated-gradient`}>
        {children}
        <Toaster />
        <GoogleTranslateWidget />
      </body>
    </html>
  );
}

    