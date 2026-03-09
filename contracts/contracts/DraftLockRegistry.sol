// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DraftLockRegistry is Ownable {
    struct Record {
        bytes32 contentHash;
        uint64  timestamp;
        uint8   workType;
        address registeredBy;
    }

    mapping(bytes32 => Record) public records;
    mapping(bytes32 => bytes32) public hashToVersion;
    uint256 public totalRecords;

    event HashRegistered(
        bytes32 indexed versionId,
        bytes32 indexed contentHash,
        uint8   workType,
        uint64  timestamp,
        address registeredBy
    );

    constructor() Ownable(msg.sender) {}

    function registerHash(
        bytes32 versionId,
        bytes32 contentHash,
        uint8   workType
    ) external onlyOwner {
        require(records[versionId].timestamp == 0, "Already registered");
        require(contentHash != bytes32(0), "Empty hash");
        require(workType <= 5, "Invalid work type");

        uint64 ts = uint64(block.timestamp);

        records[versionId] = Record({
            contentHash: contentHash,
            timestamp: ts,
            workType: workType,
            registeredBy: msg.sender
        });

        hashToVersion[contentHash] = versionId;
        totalRecords++;

        emit HashRegistered(versionId, contentHash, workType, ts, msg.sender);
    }

    function verifyHash(bytes32 contentHash) external view returns (
        bool exists,
        bytes32 versionId,
        uint64 timestamp,
        uint8 workType
    ) {
        bytes32 vid = hashToVersion[contentHash];
        if (vid == bytes32(0)) {
            return (false, bytes32(0), 0, 0);
        }
        Record memory r = records[vid];
        return (true, vid, r.timestamp, r.workType);
    }

    function getRecord(bytes32 versionId) external view returns (
        bytes32 contentHash,
        uint64 timestamp,
        uint8 workType,
        address registeredBy
    ) {
        Record memory r = records[versionId];
        return (r.contentHash, r.timestamp, r.workType, r.registeredBy);
    }
}
