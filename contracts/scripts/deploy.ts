import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "AVAX");

  const Registry = await ethers.getContractFactory("ProofMarkRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("ProofMarkRegistry deployed to:", address);
  console.log("Set PROOFMARK_REGISTRY_ADDRESS=" + address + " in .env.local");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
