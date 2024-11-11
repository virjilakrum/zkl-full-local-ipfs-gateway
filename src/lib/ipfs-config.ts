// src/lib/ipfs-config.ts
export const IPFS_CONFIG = {
    NODE_URL: 'http://127.0.0.1:5001',
    GATEWAY_URL: 'http://127.0.0.1:8080',
    API_PORT: 5001,
    GATEWAY_PORT: 8080
  };
  
  export function checkIPFSNode(): Promise<boolean> {
    return fetch(`${IPFS_CONFIG.NODE_URL}/api/v0/version`)
      .then(res => res.ok)
      .catch(() => false);
  }