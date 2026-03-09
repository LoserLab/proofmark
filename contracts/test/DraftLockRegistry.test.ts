import { expect } from "chai";
import { ethers } from "hardhat";
import { DraftLockRegistry } from "../typechain-types";

describe("DraftLockRegistry", function () {
  let registry: DraftLockRegistry;
  let owner: any;
  let other: any;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("DraftLockRegistry");
    registry = await Registry.deploy();
  });

  const sampleHash = ethers.encodeBytes32String("test").slice(0, 66).padEnd(66, "0") as `0x${string}`;
  const sampleVersion = ethers.encodeBytes32String("v1").slice(0, 66).padEnd(66, "0") as `0x${string}`;

  describe("registerHash", function () {
    it("should register a hash successfully", async function () {
      await expect(registry.registerHash(sampleVersion, sampleHash, 0))
        .to.emit(registry, "HashRegistered")
        .withArgs(sampleVersion, sampleHash, 0, (v: any) => v > 0, owner.address);

      expect(await registry.totalRecords()).to.equal(1);
    });

    it("should reject duplicate registration", async function () {
      await registry.registerHash(sampleVersion, sampleHash, 0);
      await expect(registry.registerHash(sampleVersion, sampleHash, 0))
        .to.be.revertedWith("Already registered");
    });

    it("should reject empty hash", async function () {
      await expect(registry.registerHash(sampleVersion, ethers.ZeroHash, 0))
        .to.be.revertedWith("Empty hash");
    });

    it("should reject invalid work type", async function () {
      await expect(registry.registerHash(sampleVersion, sampleHash, 6))
        .to.be.revertedWith("Invalid work type");
    });

    it("should reject non-owner", async function () {
      await expect(registry.connect(other).registerHash(sampleVersion, sampleHash, 0))
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  describe("verifyHash", function () {
    it("should return exists=false for unregistered hash", async function () {
      const [exists] = await registry.verifyHash(sampleHash);
      expect(exists).to.be.false;
    });

    it("should return correct data for registered hash", async function () {
      await registry.registerHash(sampleVersion, sampleHash, 2);
      const [exists, versionId, timestamp, workType] = await registry.verifyHash(sampleHash);
      expect(exists).to.be.true;
      expect(versionId).to.equal(sampleVersion);
      expect(timestamp).to.be.greaterThan(0);
      expect(workType).to.equal(2);
    });
  });

  describe("getRecord", function () {
    it("should return record by versionId", async function () {
      await registry.registerHash(sampleVersion, sampleHash, 1);
      const [contentHash, timestamp, workType, registeredBy] = await registry.getRecord(sampleVersion);
      expect(contentHash).to.equal(sampleHash);
      expect(timestamp).to.be.greaterThan(0);
      expect(workType).to.equal(1);
      expect(registeredBy).to.equal(owner.address);
    });
  });
});
