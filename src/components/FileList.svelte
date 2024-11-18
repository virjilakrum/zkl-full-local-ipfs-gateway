<!--src/components/FileList.svelte-->
<script lang="ts">
  import type { FileEntry, Account } from '../types';
  import { zkEncryption } from '../lib/zk/encryption';
  
  export let files: FileEntry[] = [];
  export let currentAccount: Account;
  export let otherAccount: Account | null = null;

  async function handleDecrypt(file: FileEntry) {
    if (!otherAccount || !file.encryptedAddress) return;

    try {
    
      const decryptedAddress = await zkEncryption.decrypt(
        {
          data: new TextEncoder().encode(file.encryptedAddress as string) as unknown as string,
        nonce: file.nonce 
      }, 

      otherAccount.encryptionKeys.publicKey,
        currentAccount.encryptionKeys.privateKey
      );

      // Update file with decrypted address
      const index = files.findIndex(f => f.hash === file.hash);
      if (index !== -1) {
        files[index] = {
          ...file,
          decryptedAddress
        };
        files = [...files];
      }
    } catch (error) {
      console.error('Decryption error:', error);
    }
  }
</script>

<div class="mt-8 space-y-4">
  <h2 class="text-xl font-bold">
    {#if currentAccount.accountType === 'sender'}
      Files to Send
    {:else}
      Received Files
    {/if}
  </h2>

  {#if files.length === 0}
    <p class="text-center opacity-70">No files yet</p>
  {:else}
    {#each files as file}
      <div class="border-2 border-black rounded-lg p-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{file.message}</p>
            <p class="text-sm opacity-70">{file.size}</p>
          </div>
          
          {#if currentAccount.accountType === 'receiver' && file.encryptedAddress && !file.decryptedAddress}
            <button
              class="px-4 py-2 bg-black text-white rounded hover:bg-black/90"
              on:click={() => handleDecrypt(file)}
            >
              Decrypt
            </button>
          {/if}
        </div>

        {#if file.decryptedAddress}
          <div class="mt-2 p-2 bg-green-50 rounded">
            <p class="text-sm">Decrypted IPFS Address:</p>
            <a
              href={file.decryptedAddress}
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm underline"
            >
              {file.decryptedAddress}
            </a>
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>