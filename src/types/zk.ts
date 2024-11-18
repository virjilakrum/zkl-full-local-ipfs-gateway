// src/types/zk.ts
export interface EncryptionKeys {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
  }
  
  export interface EncryptedData {
    data: Uint8Array;
    nonce: Uint8Array;
  }
  
  export interface ProofInput {
    address: string;
    recipientPubKey: string;
    salt: string;
  }
  
  export interface ProofOutput {
    proof: Uint8Array;
    publicSignals: string[];
    encryptedAddress: string;
  }