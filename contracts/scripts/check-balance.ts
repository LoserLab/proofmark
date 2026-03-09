import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Relayer address:", signer.address);
  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Balance:", ethers.formatEther(balance), "AVAX");

  if (balance === 0n) {
    console.log("\n⚠️  No AVAX balance. Get testnet AVAX from:");
    console.log("   https://faucet.avax.network/");
  }
}

main().catch(console.error);
