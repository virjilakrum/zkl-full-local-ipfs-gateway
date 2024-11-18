<!--src/components/AccountManager.svelte-->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { Account } from '../types/account';
    import { zkEncryption } from '../lib/zk/encryption';
    import { getZKProofGenerator } from '../lib/zk/proof';
  
    export let accounts: Map<string, Account>;
    export let activeAccount: string | undefined;
  
    let displayAccounts: Account[] = [];
    let proofGenerator: Awaited<ReturnType<typeof getZKProofGenerator>>;
  
    onMount(async () => {
      proofGenerator = await getZKProofGenerator();
      updateDisplayAccounts();
    });
  
    function updateDisplayAccounts() {
      displayAccounts = Array.from(accounts.values());
    }
  
    $: {
      accounts && updateDisplayAccounts();
    }
  
    async function handleAccountSelect(publicKey: string) {
      activeAccount = publicKey;
    }
  
    function handleKeyPress(event: KeyboardEvent, publicKey: string) {
      if (event.key === 'Enter' || event.key === ' ') {
        handleAccountSelect(publicKey);
      }
    }
  </script>
  
  <div class="space-y-4">
    <h2 class="text-xl font-bold" role="heading" aria-level="2">Connected Accounts</h2>
    
    <div class="grid gap-4" role="list">
      {#each displayAccounts as account}
        <button 
          type="button"
          class="p-4 border-2 rounded-lg w-full text-left hover:bg-black/5 transition-colors
          {account.publicKey.toString() === activeAccount ? 'border-black' : 'border-black/20'}"
          on:click={() => handleAccountSelect(account.publicKey.toString())}
          on:keydown={(e) => handleKeyPress(e, account.publicKey.toString())}
          role="listitem"
          aria-selected={account.publicKey.toString() === activeAccount}
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium">{account.displayName}</p>
              <p class="text-sm opacity-70">{account.publicKey.toString()}</p>
            </div>
            {#if account.publicKey.toString() === activeAccount}
              <div class="text-sm bg-black text-white px-2 py-1 rounded" aria-label="Active account">Active</div>
            {/if}
          </div>
  
          {#if account.files.length > 0}
            <div class="mt-2 text-sm">
              <p>{account.files.length} file(s) received</p>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>