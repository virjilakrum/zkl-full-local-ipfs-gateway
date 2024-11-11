// // src/lib/storage/gateway.ts
// import { create } from 'ipfs-http-client';
// import type { 
//   FileUploadResult, 
//   GatewayNode, 
//   UploadOptions,
//   GatewayStatus 
// } from './types';
// import { 
//   formatFileSize, 
//   checkNodeHealth, 
//   generateGatewayUrl, 
//   getFileType 
// } from './utils';

// // Gateway yapılandırması
// const GATEWAY_CONFIG = {
//   nodes: [
//     { url: 'http://localhost:5001', type: 'primary' as const },
//     { url: 'http://backup-node:5001', type: 'backup' as const },
//     { url: 'https://ipfs.io', type: 'public' as const }
//   ],
//   replicationFactor: 3,
//   pinningTimeout: 1000 * 60 * 5
// };

// async function selectNode(): Promise<GatewayNode> {
//   // Aktif node'ları kontrol et
//   const activeNodes = await Promise.all(
//     GATEWAY_CONFIG.nodes.map(async node => ({
//       ...node,
//       status: await checkNodeHealth(node.url) ? 'active' as const : 'inactive' as const
//     }))
//   );

//   const availableNode = activeNodes.find(node => node.status === 'active');
//   if (!availableNode) {
//     throw new Error('No active IPFS nodes available');
//   }

//   return availableNode;
// }

// export async function uploadFile(
//   file: File,
//   options: UploadOptions = { replicate: true, pin: true }
// ): Promise<FileUploadResult> {
//   const selectedNode = await selectNode();
//   const ipfs = create({ url: selectedNode.url });

//   try {
//     // Dosyayı yükle
//     const result = await ipfs.add(file);

//     if (options.replicate) {
//       // Diğer node'lara replikasyon
//       const otherNodes = GATEWAY_CONFIG.nodes
//         .filter(n => n.url !== selectedNode.url)
//         .slice(0, GATEWAY_CONFIG.replicationFactor - 1);

//       await Promise.all(otherNodes.map(async node => {
//         const nodeIpfs = create({ url: node.url });
//         if (options.pin) {
//           await nodeIpfs.pin.add(result.path);
//         }
//       }));
//     }

//     // Gateway URL'lerini oluştur
//     const uploadResult: FileUploadResult = {
//       hash: result.path,
//       fileName: file.name,
//       size: formatFileSize(file.size),
//       urls: {
//         primary: generateGatewayUrl(selectedNode.url, result.path),
//         public: generateGatewayUrl('https://ipfs.io', result.path),
//         backup: generateGatewayUrl(GATEWAY_CONFIG.nodes[1].url, result.path)
//       },
//       uploadTime: new Date().toISOString(),
//       mimeType: getFileType(file),
//       pinned: options.pin
//     };

//     return uploadResult;

//   } catch (error) {
//     console.error('Gateway upload error:', error);
//     throw new Error(error instanceof Error ? error.message : 'Upload failed');
//   }
// }

// export async function checkGatewayStatus(): Promise<GatewayStatus> {
//   const checks = await Promise.all(
//     GATEWAY_CONFIG.nodes.map(checkNodeHealth)
//   );

//   return {
//     healthy: checks.some(ok => ok),
//     activeNodes: checks.filter(ok => ok).length,
//     totalNodes: GATEWAY_CONFIG.nodes.length,
//     timestamp: new Date().toISOString()
//   };
// }

// // Pin yönetimi
// export async function pinFile(hash: string): Promise<void> {
//   const node = await selectNode();
//   const ipfs = create({ url: node.url });
//   await ipfs.pin.add(hash);
// }

// export async function unpinFile(hash: string): Promise<void> {
//   const node = await selectNode();
//   const ipfs = create({ url: node.url });
//   await ipfs.pin.rm(hash);
// }