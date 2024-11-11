// // src/lib/storage/utils.ts
// export function formatFileSize(bytes: number): string {
//     const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
//     let size = bytes;
//     let unitIndex = 0;
    
//     while (size >= 1024 && unitIndex < units.length - 1) {
//       size /= 1024;
//       unitIndex++;
//     }
    
//     return `${size.toFixed(2)} ${units[unitIndex]}`;
//   }
  
//   export async function checkNodeHealth(url: string): Promise<boolean> {
//     try {
//       const response = await fetch(`${url}/api/v0/id`);
//       return response.ok;
//     } catch {
//       return false;
//     }
//   }
  
//   export function generateGatewayUrl(nodeUrl: string, ipfsHash: string): string {
//     return `${nodeUrl}/ipfs/${ipfsHash}`;
//   }
  
//   export function getFileType(file: File): string {
//     return file.type || 'application/octet-stream';
//   }