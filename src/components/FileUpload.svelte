<!--src/components/FileUpload.svelte-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FileUploadResult } from '../types';
  import { uploadToLocalIPFS } from '../lib/ipfs-local';
  import type { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
  
  export let walletConnected: boolean = false;
  export let wallet: PhantomWalletAdapter | null = null;

  const dispatch = createEventDispatcher<{
    upload: FileUploadResult
  }>();

  let uploading = false;
  let uploadError: string | null = null;
  let uploadProgress: number = 0;
  let fileInput: HTMLInputElement;

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

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

      console.log('Starting upload process...');
      const result = await uploadToLocalIPFS(
        file,
        wallet,
        (progress) => {
          uploadProgress = progress;
          console.log(`Upload progress: ${progress}%`);
        }
      );

      console.log('Upload completed:', result);
      dispatch('upload', result);

    } catch (error) {
      console.error('Detailed upload error:', error);
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

<div class="border-2 border-dashed border-black p-6 rounded-lg relative">
  <div class="absolute right-0 top-0 bottom-0 w-8 bg-black opacity-10"></div>

  {#if !walletConnected || !wallet}
    <div class="text-center text-lg opacity-50">
      Connect your wallet to upload files
    </div>
  {:else if uploading}
    <div class="text-center">
      <div class="text-6xl mb-4 animate-spin">⟳</div>
      <p class="text-lg">Uploading to IPFS...</p>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mt-4 mb-2">
        <div 
          class="bg-black h-2.5 rounded-full transition-all duration-300" 
          style="width: {uploadProgress}%"
        ></div>
      </div>
      <p class="text-sm">{uploadProgress.toFixed(1)}%</p>
    </div>
  {:else}
    <input
      type="file"
      on:change={handleFileSelect}
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      bind:this={fileInput}
    />
    <div class="text-center">
      <div class="text-6xl mb-4">↑</div>
      <p class="text-lg">
        drag and drop a file<br/>
        or <span class="underline">browse</span> to upload
      </p>
      <p class="text-sm mt-2 opacity-70">
        Maximum size: {formatFileSize(MAX_FILE_SIZE)}
      </p>
    </div>
  {/if}

  {#if uploadError}
    <div class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
      <p class="font-medium">Upload Error</p>
      <p class="text-sm mt-1">{uploadError}</p>
      <button 
        class="mt-2 text-sm underline hover:opacity-70"
        on:click={() => {
          uploadError = null;
          if (fileInput) fileInput.value = '';
        }}
      >
        Try again
      </button>
    </div>
  {/if}
</div>
