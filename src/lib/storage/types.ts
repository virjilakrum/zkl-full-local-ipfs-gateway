// // src/lib/storage/types.ts
// export interface GatewayNode {
//     url: string;
//     type: 'primary' | 'backup' | 'public';
//     status?: 'active' | 'inactive';
//   }
  
//   export interface GatewayUrls {
//     primary: string;
//     public: string;
//     backup: string;
//   }
  
//   export interface FileUploadResult {
//     hash: string;
//     fileName: string;
//     size: string;
//     urls: GatewayUrls;
//     uploadTime: string;
//     mimeType?: string;
//     pinned?: boolean;
//   }
  
//   export interface GatewayStatus {
//     healthy: boolean;
//     activeNodes: number;
//     totalNodes: number;
//     timestamp: string;
//   }
  
//   export interface UploadOptions {
//     replicate?: boolean;
//     pin?: boolean;
//     deleteAfter?: number; // in milliseconds
//   }