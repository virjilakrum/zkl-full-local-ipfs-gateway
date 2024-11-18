// src/types/account.ts
import type { PublicKey } from '@solana/web3.js';

export interface Account {
  publicKey: PublicKey;
  displayName: string;
  files: ReceivedFile[];
  isActive: boolean;
  createdAt: Date;
}

export interface ReceivedFile {
  id: string;
  encryptedAddress: string;
  sender: string;
  receivedAt: Date;
  decryptedAddress?: string;
  proof?: ZKProof;
}

export interface ZKProof {
  proof: Uint8Array;
  publicSignals: string[];
}

export interface AccountState {
  accounts: Map<string, Account>;
  activeAccount?: string;
  connectedWallets: string[];
}