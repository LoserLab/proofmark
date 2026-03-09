import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify a Record",
  description: "Verify any ProofMark record instantly. Drop a file or paste a SHA-256 hash to confirm blockchain-registered proof of creation.",
  openGraph: {
    title: "Verify a Record on ProofMark",
    description: "Verify any ProofMark record instantly. Drop a file or paste a hash to confirm proof of creation.",
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
