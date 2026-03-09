import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
  padHex,
} from 'viem';
import { avalanche, avalancheFuji } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { REGISTRY_ABI, WORK_TYPE_MAP } from './constants';

function getConfig() {
  return {
    rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: parseInt(process.env.AVALANCHE_CHAIN_ID || '43113'),
    relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY || '',
    registryAddress: process.env.PROOFMARK_REGISTRY_ADDRESS || '',
    enabled: !!(process.env.RELAYER_PRIVATE_KEY && process.env.PROOFMARK_REGISTRY_ADDRESS),
    explorerBaseUrl: process.env.AVALANCHE_CHAIN_ID === '43114'
      ? 'https://snowtrace.io'
      : 'https://testnet.snowtrace.io',
  };
}

function getChain(chainId: number) {
  return chainId === 43114 ? avalanche : avalancheFuji;
}

let _publicClient: ReturnType<typeof createPublicClient> | null = null;
let _walletClient: ReturnType<typeof createWalletClient> | null = null;
let _account: ReturnType<typeof privateKeyToAccount> | null = null;

function getPublicClient() {
  if (!_publicClient) {
    const cfg = getConfig();
    _publicClient = createPublicClient({
      chain: getChain(cfg.chainId),
      transport: http(cfg.rpcUrl),
    });
  }
  return _publicClient;
}

function getAccount() {
  if (!_account) {
    const cfg = getConfig();
    _account = privateKeyToAccount(cfg.relayerPrivateKey as Hex);
  }
  return _account;
}

function getWalletClient() {
  if (!_walletClient) {
    const cfg = getConfig();
    _walletClient = createWalletClient({
      account: getAccount(),
      chain: getChain(cfg.chainId),
      transport: http(cfg.rpcUrl),
    });
  }
  return _walletClient;
}

/** Convert a hex SHA-256 hash string to bytes32 */
export function sha256ToBytes32(sha256Hex: string): Hex {
  const clean = sha256Hex.startsWith('0x') ? sha256Hex : `0x${sha256Hex}`;
  return clean as Hex;
}

/** Convert a UUID string to bytes32 (UUIDs are 16 bytes, right-padded to 32) */
export function uuidToBytes32(uuid: string): Hex {
  const hex = uuid.replace(/-/g, '');
  return padHex(`0x${hex}` as Hex, { size: 32 });
}

/** Resolve work type string to uint8 */
export function resolveWorkType(workType: string): number {
  return WORK_TYPE_MAP[workType.toLowerCase()] ?? 5;
}

/** Register a content hash on-chain. Returns tx hash and block number. */
export async function registerOnChain(
  sha256Hex: string,
  versionId: string,
  workType: string
): Promise<{ txHash: string; blockNumber: number }> {
  const walletClient = getWalletClient();
  const publicClient = getPublicClient();
  const cfg = getConfig();

  const contentHash = sha256ToBytes32(sha256Hex);
  const versionBytes = uuidToBytes32(versionId);
  const workTypeInt = resolveWorkType(workType);

  const chain = getChain(cfg.chainId);

  const account = getAccount();

  const txHash = await walletClient.writeContract({
    account,
    chain,
    address: cfg.registryAddress as Hex,
    abi: REGISTRY_ABI,
    functionName: 'registerHash',
    args: [versionBytes, contentHash, workTypeInt],
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  return {
    txHash: receipt.transactionHash,
    blockNumber: Number(receipt.blockNumber),
  };
}

/** Verify a hash exists on-chain (read-only, no gas cost) */
export async function verifyOnChain(sha256Hex: string): Promise<{
  exists: boolean;
  versionId: string | null;
  timestamp: number;
  workType: number;
}> {
  const publicClient = getPublicClient();
  const cfg = getConfig();
  const contentHash = sha256ToBytes32(sha256Hex);

  const result = await publicClient.readContract({
    address: cfg.registryAddress as Hex,
    abi: REGISTRY_ABI,
    functionName: 'verifyHash',
    args: [contentHash],
  });

  const [exists, versionId, timestamp, workType] = result as [boolean, Hex, bigint, number];
  return {
    exists,
    versionId: exists ? (versionId as string) : null,
    timestamp: Number(timestamp),
    workType,
  };
}

/** Check if blockchain integration is configured and enabled */
export function isBlockchainEnabled(): boolean {
  return getConfig().enabled;
}

/** Get the explorer URL for a transaction */
export function getExplorerTxUrl(txHash: string): string {
  const cfg = getConfig();
  return `${cfg.explorerBaseUrl}/tx/${txHash}`;
}

/** Get the explorer URL for the registry contract */
export function getExplorerContractUrl(): string {
  const cfg = getConfig();
  return `${cfg.explorerBaseUrl}/address/${cfg.registryAddress}`;
}
