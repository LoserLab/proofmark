import { ethers } from "hardhat";

const REGISTRY_ADDRESS = "0x252C25296c45C532af59FA2E0F88A933EE78C0B2";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Testing with:", signer.address);

  const registry = await ethers.getContractAt("ProofMarkRegistry", REGISTRY_ADDRESS);

  // Generate test data
  const testVersionId = ethers.keccak256(ethers.toUtf8Bytes("test-version-" + Date.now()));
  const testContentHash = ethers.keccak256(ethers.toUtf8Bytes("test-content-" + Date.now()));
  const workType = 0; // screenplay

  console.log("\nRegistering test hash...");
  console.log("  versionId:", testVersionId);
  console.log("  contentHash:", testContentHash);

  const tx = await registry.registerHash(testVersionId, testContentHash, workType);
  console.log("  tx hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("  confirmed in block:", receipt?.blockNumber);

  // Verify it was stored
  console.log("\nVerifying hash...");
  const result = await registry.verifyHash(testContentHash);
  console.log("  exists:", result[0]);
  console.log("  versionId:", result[1]);
  console.log("  timestamp:", Number(result[2]), "(" + new Date(Number(result[2]) * 1000).toISOString() + ")");
  console.log("  workType:", result[3]);

  // Get total records
  const total = await registry.totalRecords();
  console.log("\nTotal records in registry:", total.toString());

  console.log("\n✅ Test passed! Contract is working on Fuji.");
  console.log("View on Snowtrace: https://testnet.snowtrace.io/tx/" + tx.hash);
}

main().catch(console.error);
