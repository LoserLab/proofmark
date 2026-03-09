export const REGISTRY_ABI = [
  {
    inputs: [
      { name: 'versionId', type: 'bytes32' },
      { name: 'contentHash', type: 'bytes32' },
      { name: 'workType', type: 'uint8' },
    ],
    name: 'registerHash',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'contentHash', type: 'bytes32' }],
    name: 'verifyHash',
    outputs: [
      { name: 'exists', type: 'bool' },
      { name: 'versionId', type: 'bytes32' },
      { name: 'timestamp', type: 'uint64' },
      { name: 'workType', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'versionId', type: 'bytes32' }],
    name: 'getRecord',
    outputs: [
      { name: 'contentHash', type: 'bytes32' },
      { name: 'timestamp', type: 'uint64' },
      { name: 'workType', type: 'uint8' },
      { name: 'registeredBy', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalRecords',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'versionId', type: 'bytes32' },
      { indexed: true, name: 'contentHash', type: 'bytes32' },
      { indexed: false, name: 'workType', type: 'uint8' },
      { indexed: false, name: 'timestamp', type: 'uint64' },
      { indexed: false, name: 'registeredBy', type: 'address' },
    ],
    name: 'HashRegistered',
    type: 'event',
  },
] as const;

export const WORK_TYPE_MAP: Record<string, number> = {
  screenplay: 0,
  manuscript: 1,
  treatment: 2,
  'pitch deck': 3,
  pitchdeck: 3,
  research: 4,
  other: 5,
};
