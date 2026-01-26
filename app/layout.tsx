import './globals.css'
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DevModeNotice from "@/components/DevModeNotice";

export const metadata = {
  title: "DraftLock",
  description: "Protect drafts with proof, timestamps, and guided filing."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg)] text-[var(--text)] antialiased">
        <NavBar />
        {children}
        <Footer />
        <DevModeNotice />
      </body>
    </html>
  )
}
