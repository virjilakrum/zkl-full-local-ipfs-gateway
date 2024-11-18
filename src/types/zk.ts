// src/types/zk.ts
export interface EncryptionKeys {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
  }
  
  export interface EncryptedData {
    data: string;
    // data: Uint8Array;
    nonce: string;
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