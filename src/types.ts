// src/types.ts
import type { PublicKey } from '@solana/web3.js';
import type { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

export interface FileEntry {
  id: string;
  message: string;
  sender: string;
  size: number;
  hash: string;
  arweaveAddress: string;
  encryptedAddress: string;
  receivedAt: Date;
}

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

export interface Account {
  publicKey: PublicKey;
  displayName: string;
  files: FileEntry[];
  isActive: boolean;
  createdAt: Date;
  wallet: PhantomWalletAdapter | null;
}

export interface WalletConnectionEvent {
  status: boolean;
  wallet: PhantomWalletAdapter | null;
}