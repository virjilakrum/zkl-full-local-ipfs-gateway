// src/lib/ipfs-local.ts
import { create } from 'ipfs-http-client';
import type { FileUploadResult } from '../types';
import type { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// IPFS client
const ipfs = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http'
});

async function testConnection(): Promise<boolean> {
  try {
    await ipfs.version();
    return true;
  } catch (error) {
    console.error('IPFS connection test failed:', error);
    return false;
  }
}

export async function uploadToLocalIPFS(
  file: File,
  wallet: PhantomWalletAdapter | null,
  onProgress?: (progress: number) => void
): Promise<FileUploadResult> {
  if (!wallet?.publicKey) {
    throw new Error("Wallet not connected");
  }

  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error("Cannot connect to IPFS. Please check if IPFS daemon is running.");
  }

  try {
    if (onProgress) onProgress(10);

    // Read the file
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    if (onProgress) onProgress(30);

    // Upload to IPFS
    console.log('Starting file upload...');
    const result = await ipfs.add(data);
    
    if (onProgress) onProgress(90);
    
    // Create local and public URLs
    const localUrl = `http://localhost:8080/ipfs/${result.path}`;
    const publicUrl = `https://ipfs.io/ipfs/${result.path}`;

    // Upload metadata
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      owner: wallet.publicKey.toString(),
      timestamp: new Date().toISOString()
    };

    const metadataResult = await ipfs.add(JSON.stringify(metadata));

    if (onProgress) onProgress(100);

    return {
      hash: result.path,
      fileName: file.name,
      size: formatFileSize(file.size),
      publicUrl: localUrl,
      backupUrl: publicUrl,
      fileType: file.type,
      uploadTime: new Date().toISOString(),
      metadataCid: metadataResult.path
    };

  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to upload file to IPFS'
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KiB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}