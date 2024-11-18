// src/types.ts
import type { PublicKey } from '@solana/web3.js';
import type { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

export interface FileUploadResult {
  hash: string;         // IPFS Content ID (CID)
  fileName: string;     // Original file name
  size: string;         // Formatted file size
  publicUrl: string;    // Local IPFS gateway URL
  backupUrl: string;    // Public IPFS gateway URL
  fileType: string;     // File MIME type
  uploadTime: string;   // ISO timestamp
  metadataCid?: string; // IPFS CID for metadata (optional)
}

export interface WalletConnectionEvent {
  status: boolean;
  wallet: SolflareWalletAdapter | null;
}

export interface EncryptionKeys {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export interface FileEntry {
  message: string;
  sender: string;
  size: string;
  hash: string;
  nonce: string;
  arweaveAddress?: string;
  encryptedAddress?: string;
  decryptedAddress?: string;
}

export interface Account {
  publicKey: PublicKey;
  displayName: string;
  files: FileEntry[];
  isActive: boolean;
  createdAt: Date;
  wallet: SolflareWalletAdapter;
  encryptionKeys: EncryptionKeys;
  accountType: 'sender' | 'receiver';
}

