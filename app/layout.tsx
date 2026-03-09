import './globals.css'
import { Playfair_Display, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ProofMark — Prove You Made It First',
    template: '%s | ProofMark',
  },
  description: 'Permanent, verifiable proof that your creative work existed before you share it. Lock your screenplay, manuscript, or idea in under 60 seconds.',
  keywords: ['prove creation', 'protect creative work', 'timestamp', 'proof of authorship', 'creation receipt'],
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://proofmark.xyz'),
  openGraph: {
    title: 'ProofMark — Prove You Made It First',
    description: 'Permanent, verifiable proof that your creative work existed before you share it.',
    siteName: 'ProofMark',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProofMark — Prove You Made It First',
    description: 'Permanent, verifiable proof that your creative work existed before you share it.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] antialiased">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
