<!--src/App.svelte-->
<script lang="ts">
  import Header from './components/Header.svelte';
  import WelcomeCard from './components/WelcomeCard.svelte';
  import FileUpload from './components/FileUpload.svelte';
  import FileList from './components/FileList.svelte';
  import IconBar from './components/IconBar.svelte';
  import WalletConnect from './components/WalletConnect.svelte';
  import type { FileEntry, FileUploadResult } from './types';
  import type { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

  let walletConnected = false;
  let currentWallet: PhantomWalletAdapter | null = null;
  let files: FileEntry[] = [];
  let currentHash = '';

  function handleUpload(event: CustomEvent<FileUploadResult>) {
    const { hash, fileName, size, publicUrl } = event.detail;
    currentHash = hash;
    files = [...files, {
      message: fileName,
      sender: 'you',
      size,
      hash,
      arweaveAddress: publicUrl // On FileEntry already using arweaveAddress 
    }];
  }

  function handleWalletConnection(event: CustomEvent<{ status: boolean, wallet: PhantomWalletAdapter | null }>) {
    walletConnected = event.detail.status;
    currentWallet = event.detail.wallet;
  }
</script>

<main class="min-h-screen bg-[#FEFFAF]">
  <Header />
  
  <div class="container mx-auto p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <WelcomeCard />
      <div class="space-y-8">
        <WalletConnect on:connected={handleWalletConnection} />
        <FileUpload 
          on:upload={handleUpload} 
          {walletConnected}
          wallet={currentWallet}
        />
      </div>
    </div>
    
    <FileList files={files} arweaveHash={currentHash} {walletConnected} />
    <IconBar />
  </div>
</main>

<style>
  :global(body) {
    font-family: 'League Spartan', sans-serif;
  }
</style>