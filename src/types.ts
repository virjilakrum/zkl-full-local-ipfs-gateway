// src/types.ts
export interface FileEntry {
  message: string;
  sender: string;
  size: string;
  hash: string;
  arweaveAddress?: string;
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