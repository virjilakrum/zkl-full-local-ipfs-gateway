<!--src/components/WalletConnect.svelte-->
<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { Connection, PublicKey } from '@solana/web3.js';
    import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
  
    const dispatch = createEventDispatcher<{
      connected: { status: boolean, wallet: PhantomWalletAdapter | null }
    }>();
  
    let walletAddress: string = '';
    let walletConnected: boolean = false;
    let phantomWallet = new PhantomWalletAdapter();
  
    onMount(async () => {
      try {
        await phantomWallet.connect();
        walletAddress = phantomWallet.publicKey?.toString() || '';
        walletConnected = true;
        dispatch('connected', { status: true, wallet: phantomWallet });
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    });
  
    async function connectWallet() {
      try {
        await phantomWallet.connect();
        walletAddress = phantomWallet.publicKey?.toString() || '';
        walletConnected = true;
        dispatch('connected', { status: true, wallet: phantomWallet });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  
    async function disconnectWallet() {
      try {
        await phantomWallet.disconnect();
        walletAddress = '';
        walletConnected = false;
        dispatch('connected', { status: false, wallet: null });
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
      }
    }
  </script>
  
  <div class="border-2 border-dashed border-black p-6 rounded-lg relative">
    <div class="absolute right-0 top-0 bottom-0 w-8 bg-black opacity-10"></div>
    
    {#if !walletConnected}
      <button 
        on:click={connectWallet}
        class="w-full py-2 text-lg hover:underline flex items-center justify-center gap-2"
      >
        <span>Connect Wallet</span>
      </button>
    {:else}
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-sm opacity-70">Connected Wallet:</span>
          <button 
            on:click={disconnectWallet}
            class="text-sm hover:underline"
          >
            disconnect
          </button>
        </div>
        <div class="break-all text-sm">
          {walletAddress}
        </div>
      </div>
    {/if}
  </div>