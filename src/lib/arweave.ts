// // src/lib/arweave.ts
// import Arweave from 'arweave';
// import type { ArweaveUploadResult } from '../types';
// import type { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// // Arweave public gateway kullanıyoruz
// const arweave = Arweave.init({
//   host: 'arweave.net',
//   port: 443,
//   protocol: 'https',
//   timeout: 60000,
// });

// // Proxy URL for uploads
// const GATEWAY_URL = 'https://arweave-upload.xyz/api';

// async function uploadViaGateway(
//   file: File,
//   wallet: PhantomWalletAdapter,
//   onProgress?: (progress: number) => void
// ): Promise<string> {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('userAddress', wallet.publicKey?.toString() || '');

//   try {
//     const response = await fetch(`${GATEWAY_URL}/upload`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Upload failed with status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result.transactionId;
//   } catch (error) {
//     console.error('Gateway upload error:', error);
//     throw error;
//   }
// }

// export async function uploadToArweave(
//   file: File, 
//   wallet: PhantomWalletAdapter | null,
//   onProgress?: (progress: number) => void
// ): Promise<ArweaveUploadResult> {
//   if (!wallet?.publicKey) {
//     throw new Error("Wallet not connected");
//   }

//   // Dosya tipi kontrolü
//   if (!file.type.startsWith('image/')) {
//     throw new Error("Only image files are supported");
//   }

//   try {
//     if (onProgress) onProgress(10);

//     // Base64'e çevir
//     const reader = new FileReader();
//     const base64Promise = new Promise<string>((resolve, reject) => {
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//     if (onProgress) onProgress(30);

//     const base64Data = await base64Promise;

//     // CORS-proxy üzerinden yükle
//     const data = {
//       fileData: base64Data,
//       fileName: file.name,
//       fileType: file.type,
//       userAddress: wallet.publicKey.toString()
//     };

//     if (onProgress) onProgress(50);

//     const response = await fetch('https://api.nft.storage/upload', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',

/* deleting for security */

//       body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//       throw new Error(`Upload failed: ${response.statusText}`);
//     }

//     const result = await response.json();
//     if (onProgress) onProgress(100);

//     // IPFS URL'ini Arweave URL'ine çevir
//     const arweaveAddress = `https://arweave.net/${result.value.cid}`;

//     return {
//       hash: result.value.cid,
//       fileName: file.name,
//       size: formatFileSize(file.size),
//       arweaveAddress
//     };

//   } catch (error) {
//     console.error('Detailed upload error:', error);
//     if (error instanceof Error) {
//       throw new Error(`Upload failed: ${error.message}`);
//     }
//     throw new Error('Unknown upload error occurred');
//   }
// }

// function formatFileSize(bytes: number): string {
//   if (bytes < 1024 * 1024) {
//     return `${(bytes / 1024).toFixed(2)} KiB`;
//   }
//   return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
// }
