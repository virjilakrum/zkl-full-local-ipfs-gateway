<!--src/components/MultiWalletConnect.svelte-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
    import { Connection, clusterApiUrl } from '@solana/web3.js';
    import type { Account } from '../types/account';
    
    const dispatch = createEventDispatcher();
    
    export let accounts: Map<string, Account>;
    export const activeAccount: string | undefined = undefined; 
    
    let primaryWallet = new PhantomWalletAdapter();
    let secondaryWallet = new PhantomWalletAdapter();
    let connecting = false;
    let error: string | null = null;
  
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  
    async function connectPrimaryWallet() {
      try {
        connecting = true;
        error = null;
        await primaryWallet.connect();
  
        // İmza iste
        const message = new TextEncoder().encode(
          `Sign to connect as primary wallet: ${Date.now()}`
        );
        await primaryWallet.signMessage(message);
  
        dispatch('primaryConnected', { 
          status: true, 
          wallet: primaryWallet 
        });
      } catch (err) {
        console.error('Primary wallet connection failed:', err);
        error = err instanceof Error ? err.message : 'Connection failed';
      } finally {
        connecting = false;
      }
    }
  
    async function connectSecondaryWallet() {
      try {
        connecting = true;
        error = null;
        await secondaryWallet.connect();
  
        // İmza iste
        const message = new TextEncoder().encode(
          `Sign to connect as secondary wallet: ${Date.now()}`
        );
        await secondaryWallet.signMessage(message);
  
        dispatch('secondaryConnected', {
          status: true,
          wallet: secondaryWallet
        });
      } catch (err) {
        console.error('Secondary wallet connection failed:', err);
        error = err instanceof Error ? err.message : 'Connection failed';
      } finally {
        connecting = false;
      }
    }
  
    function disconnectWallet(wallet: PhantomWalletAdapter) {
      wallet.disconnect();
    }
  </script>
  
  <div class="space-y-4">
    <!-- İlk cüzdan bağlantısı -->
    {#if !accounts.size}
      <button
        class="w-full p-3 bg-black text-white rounded-lg hover:bg-black/90 
        disabled:opacity-50 transition-colors"
        on:click={connectPrimaryWallet}
        disabled={connecting}
      >
        {connecting ? 'Connecting...' : 'Connect Primary Wallet'}
      </button>
    
    <!-- İkinci cüzdan bağlantısı -->
    {:else if accounts.size === 1}
      <button
        class="w-full p-3 bg-black text-white rounded-lg hover:bg-black/90 
        disabled:opacity-50 transition-colors"
        on:click={connectSecondaryWallet}
        disabled={connecting}
      >
        {connecting ? 'Connecting...' : 'Connect Secondary Wallet'}
      </button>
    {/if}
  
    {#if error}
      <div class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {error}
      </div>
    {/if}
  </div>
  