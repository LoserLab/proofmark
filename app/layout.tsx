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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ProofMark",
              "applicationCategory": "SecurityApplication",
              "operatingSystem": "Web",
              "description": "Blockchain proof-of-origin for creative work. Upload your file, get a permanent, verifiable proof of creation on Avalanche.",
              "url": "https://proofmark.xyz",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier available"
              },
              "author": {
                "@type": "Organization",
                "name": "Heathen",
                "url": "https://proofmark.xyz"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ProofMark",
              "url": "https://proofmark.xyz",
              "logo": "https://proofmark.xyz/favicon.svg",
              "description": "Blockchain proof-of-origin for creative work, powered by Avalanche."
            }),
          }}
        />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
