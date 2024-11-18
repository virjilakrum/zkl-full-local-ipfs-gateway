<!--src/components/FileUpload.svelte-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FileUploadResult } from '../types';
  import { uploadToIPFS } from '../lib/ipfs';
  import type { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
  
  export const walletConnected: boolean = false;  
  export let wallet: SolflareWalletAdapter | null = null;

  const dispatch = createEventDispatcher<{
    upload: FileUploadResult
  }>();

  let uploading = false;
  let uploadError: string | null = null;
  let uploadProgress: number = 0;
  let fileInput: HTMLInputElement;

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;
    
    const file = target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      uploadError = `File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`;
      return;
    }

    try {
      uploading = true;
      uploadError = null;
      uploadProgress = 0;

      const result = await uploadToIPFS(
        file,
        wallet,
        (progress) => {
          uploadProgress = progress;
        }
      );

      dispatch('upload', result);

    } catch (error) {
      console.error('Upload error:', error);
      uploadError = error instanceof Error ? error.message : 'Upload failed';
    } finally {
      uploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  function formatFileSize(bytes: number): string {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(2)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
</script>
