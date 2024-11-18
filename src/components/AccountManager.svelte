<!--src/components/AccountManager.svelte-->
<script lang="ts">
  import type { Account } from '../types';
  import { createEventDispatcher } from 'svelte';

  export let accounts: Map<string, Account>;
  export let activeAccount: string | undefined;

  const dispatch = createEventDispatcher<{
    select: { accountId: string }
  }>();

  let displayAccounts: Account[] = [];

  $: {
    displayAccounts = Array.from(accounts.values());
  }

  function handleAccountSelect(publicKey: string) {
    dispatch('select', { accountId: publicKey });
  }

  function handleKeyPress(event: KeyboardEvent, publicKey: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleAccountSelect(publicKey);
    }
  }
</script>

<div class="space-y-4">
  <h2 class="text-xl font-bold">Connected Accounts</h2>
  
  <div 
    role="tablist"
    aria-label="Account selection"
    class="grid gap-4"
  >
    {#each displayAccounts as account}
      <button 
        type="button"
        class="p-4 border-2 rounded-lg w-full text-left hover:bg-black/5 transition-colors
        {account.publicKey.toString() === activeAccount ? 'border-black' : 'border-black/20'}"
        on:click={() => handleAccountSelect(account.publicKey.toString())}
        on:keydown={(e) => handleKeyPress(e, account.publicKey.toString())}
        role="tab"
        aria-selected={account.publicKey.toString() === activeAccount}
        aria-controls={`account-panel-${account.publicKey.toString()}`}
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{account.displayName}</p>
            <p class="text-sm opacity-70">{account.publicKey.toString()}</p>
          </div>
          {#if account.publicKey.toString() === activeAccount}
            <span class="text-sm bg-black text-white px-2 py-1 rounded">Active</span>
          {/if}
        </div>

        {#if account.files.length > 0}
          <div class="mt-2 text-sm">
            <p>{account.files.length} file(s)</p>
          </div>
        {/if}
      </button>
    {/each}
  </div>
</div>