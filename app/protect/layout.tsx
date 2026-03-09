import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Record",
  description: "Upload your creative work and create a permanent, blockchain-verified proof of creation on Avalanche in under 60 seconds.",
  openGraph: {
    title: "Create a Record on ProofMark",
    description: "Upload your creative work and create a permanent, blockchain-verified proof of creation in under 60 seconds.",
  },
};

export default function ProtectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
