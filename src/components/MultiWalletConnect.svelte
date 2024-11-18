<!--src/components/MultiWalletConnect.svelte-->
<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
    import { Connection, clusterApiUrl } from '@solana/web3.js';
    import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
    import type { Account } from '../types';
    import { zkEncryption } from '../lib/zk/encryption';
  
    export let accounts: Map<string, Account>;
    const dispatch = createEventDispatcher();
    
    const network = WalletAdapterNetwork.Devnet;
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
  
    // İki cüzdan instance'ı
    let primaryWallet = new SolflareWalletAdapter({ network });
    let secondaryWallet = new SolflareWalletAdapter({ network });
    
    let connecting = false;
    let error: string | null = null;
  
    // Her cüzdan için bağlantı durumu
    let isPrimaryConnected = false;
    let isSecondaryConnected = false;
  
    async function connectPrimaryWallet() {
      try {
        connecting = true;
        error = null;
        await primaryWallet.connect();
        isPrimaryConnected = true;
  
        if (primaryWallet.publicKey) {
          const keys = zkEncryption.generateKeys();
          const account: Account = {
            publicKey: primaryWallet.publicKey,
            displayName: "Primary Account",
            files: [],
            isActive: true,
            createdAt: new Date(),
            wallet: primaryWallet,
            encryptionKeys: keys,
            accountType: 'sender'
          };
          
          accounts.set(primaryWallet.publicKey.toString(), account);
          dispatch('walletConnected', { wallet: primaryWallet, account });
        }
      } catch (err) {
        console.error('Primary wallet connection error:', err);
        error = err instanceof Error ? err.message : 'Failed to connect primary wallet';
      } finally {
        connecting = false;
      }
    }
  
    async function connectSecondaryWallet() {
      try {
        connecting = true;
        error = null;
        await secondaryWallet.connect();
        isSecondaryConnected = true;
  
        if (secondaryWallet.publicKey) {
          const keys = zkEncryption.generateKeys();
          const account: Account = {
            publicKey: secondaryWallet.publicKey,
            displayName: "Secondary Account",
            files: [],
            isActive: true,
            createdAt: new Date(),
            wallet: secondaryWallet,
            encryptionKeys: keys,
            accountType: 'receiver'
          };
          
          accounts.set(secondaryWallet.publicKey.toString(), account);
          dispatch('walletConnected', { wallet: secondaryWallet, account });
        }
      } catch (err) {
        console.error('Secondary wallet connection error:', err);
        error = err instanceof Error ? err.message : 'Failed to connect secondary wallet';
      } finally {
        connecting = false;
      }
    }
  
    function disconnectWallet(isPrimary: boolean) {
      if (isPrimary) {
        primaryWallet.disconnect();
        isPrimaryConnected = false;
        if (primaryWallet.publicKey) {
          accounts.delete(primaryWallet.publicKey.toString());
        }
      } else {
        secondaryWallet.disconnect();
        isSecondaryConnected = false;
        if (secondaryWallet.publicKey) {
          accounts.delete(secondaryWallet.publicKey.toString());
        }
      }
      dispatch('walletDisconnected', { isPrimary });
    }
  
    onMount(() => {
      return () => {
        primaryWallet.disconnect();
        secondaryWallet.disconnect();
      };
    });
  </script>
  
  <div class="space-y-6">
    <!-- Primary Wallet -->
    <div class="border-2 border-black rounded-lg p-4">
      <h2 class="text-lg font-bold mb-4">Sender Account</h2>
      {#if !isPrimaryConnected}
        <button
          class="w-full p-3 bg-black text-white rounded-lg hover:bg-black/90 
            disabled:opacity-50 transition-colors"
          on:click={connectPrimaryWallet}
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Sender Wallet'}
        </button>
      {:else}
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">Sender Wallet</p>
            <p class="text-sm opacity-70">{primaryWallet.publicKey?.toString()}</p>
          </div>
          <button
            class="text-sm underline hover:opacity-70"
            on:click={() => disconnectWallet(true)}
          >
            Disconnect
          </button>
        </div>
      {/if}
    </div>
  
    <!-- Secondary Wallet -->
    <div class="border-2 border-black rounded-lg p-4">
      <h2 class="text-lg font-bold mb-4">Receiver Account</h2>
      {#if !isSecondaryConnected}
        <button
          class="w-full p-3 bg-black text-white rounded-lg hover:bg-black/90 
            disabled:opacity-50 transition-colors"
          on:click={connectSecondaryWallet}
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Receiver Wallet'}
        </button>
      {:else}
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">Receiver Wallet</p>
            <p class="text-sm opacity-70">{secondaryWallet.publicKey?.toString()}</p>
          </div>
          <button
            class="text-sm underline hover:opacity-70"
            on:click={() => disconnectWallet(false)}
          >
            Disconnect
          </button>
        </div>
      {/if}
    </div>
  
    {#if error}
      <div class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {error}
      </div>
    {/if}
  </div>