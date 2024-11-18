<!--src/components/FileList.svelte-->
<script lang="ts">
  import type { FileEntry } from '../types';
  
  export let files: FileEntry[] = [];
  export let arweaveHash: string = '';
  export let walletConnected: boolean = false;
</script>

<div class="mt-8 border-2 border-dashed border-black p-6 rounded-lg relative">
  <div class="absolute right-0 top-0 bottom-0 w-8 bg-black opacity-10"></div>
  
  <h2 class="text-xl font-bold mb-4">↓ my inbox /\/ {arweaveHash}</h2>
  
  {#if walletConnected && files.length > 0}
    <div class="space-y-4">
      {#each files as file}
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-lg">📄</span>
              <span>{file.message}</span>
            </div>
            <div class="flex items-center gap-4">
              <span>{file.sender}</span>
              <span>{file.size}</span>
              <button class="text-xl">↓</button>
            </div>
          </div>
          {#if file.arweaveAddress}
            <div class="text-sm opacity-70">
              IPFS File Address: <a href={file.arweaveAddress} target="_blank" class="underline">{file.arweaveAddress}</a>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else if !walletConnected}
    <div class="text-center text-lg opacity-50">
      Connect your wallet to view files
    </div>
  {:else}
    <div class="text-center text-lg opacity-50">
      No files uploaded yet
    </div>
  {/if}
  
  <div class="text-sm text-center mt-4">... continue sending and receiving securely with ZKL</div>
</div>