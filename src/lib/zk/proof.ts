// src/lib/zk/proof.ts
import { buildMimc7 } from 'circomlibjs';
import type { ProofInput, ProofOutput } from '../../types/zk';

export class ZKProofGenerator {
  private static instance: ZKProofGenerator;
  private mimc7: any;

  private constructor() {}

  static async getInstance(): Promise<ZKProofGenerator> {
    if (!ZKProofGenerator.instance) {
      ZKProofGenerator.instance = new ZKProofGenerator();
      ZKProofGenerator.instance.mimc7 = await buildMimc7();
    }
    return ZKProofGenerator.instance;
  }

  async generateProof(input: ProofInput): Promise<ProofOutput> {
    // Hash the address with recipient's public key
    const addressHash = await this.mimc7.hash(
      input.address,
      input.recipientPubKey
    );

    // Generate the proof
    const proof = await this.mimc7.generateProof({
      address: input.address,
      recipientPubKey: input.recipientPubKey,
      salt: input.salt
    });

    return {
      proof: new Uint8Array(proof),
      publicSignals: [addressHash.toString()],
      encryptedAddress: addressHash.toString()
    };
  }

  async verifyProof(proof: Uint8Array, publicSignals: string[]): Promise<boolean> {
    try {
      return await this.mimc7.verifyProof(proof, publicSignals);
    } catch (error) {
      console.error('Proof verification failed:', error);
      return false;
    }
  }
}

export const getZKProofGenerator = ZKProofGenerator.getInstance;