<!--src/App.svelte-->
<script lang="ts">
  import { v4 as uuidv4 } from 'uuid'; // UUID oluşturmak için ekleme
  import Header from './components/Header.svelte';
  import WelcomeCard from './components/WelcomeCard.svelte';
  import FileUpload from './components/FileUpload.svelte';
  import FileList from './components/FileList.svelte';
  import IconBar from './components/IconBar.svelte';
  import MultiWalletConnect from './components/MultiWalletConnect.svelte';
  import type { FileEntry, FileUploadResult, Account, WalletConnectionEvent } from './types';
  import type { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

  // State yönetimi
  let accounts = new Map<string, Account>();
  let walletConnected = false;
  let currentWallet: PhantomWalletAdapter | null = null;
  let files: FileEntry[] = [];
  let currentHash = '';
  let activeAccount: string | undefined;

  // Dosya yükleme işleyicisi
  function handleUpload(event: CustomEvent<FileUploadResult>) {
    const { hash, fileName, size, publicUrl, backupUrl } = event.detail;
    currentHash = hash;

    const newFile: FileEntry = {
      id: uuidv4(), 
      message: fileName,
      sender: activeAccount || 'unknown',
      size: Number(size),
      hash,
      arweaveAddress: publicUrl,
      encryptedAddress: backupUrl,
      receivedAt: new Date()
    };

    if (activeAccount && accounts.has(activeAccount)) {
      const account = accounts.get(activeAccount)!;
      account.files = [...account.files, newFile];
      accounts.set(activeAccount, { ...account });
      files = account.files;
    } else {
      files = [...files, newFile];
    }
  }

  // Cüzdan bağlantı işleyicisi
  function handleWalletConnection(event: CustomEvent<WalletConnectionEvent>) {
    const { status, wallet } = event.detail;
    walletConnected = status;
    currentWallet = wallet;

    if (wallet?.publicKey) {
      const publicKeyStr = wallet.publicKey.toString();
      if (!accounts.has(publicKeyStr)) {
        accounts.set(publicKeyStr, {
          publicKey: wallet.publicKey,
          displayName: `Account ${accounts.size + 1}`,
          files: [],
          isActive: true,
          createdAt: new Date(),
          wallet: wallet
        });
      }
      activeAccount = publicKeyStr;
    }
  }

  // Hesap değiştirme işleyicisi
  function handleAccountSwitch(accountId: string) {
    if (accounts.has(accountId)) {
      activeAccount = accountId;
      const account = accounts.get(accountId)!;
      files = account.files;
      currentWallet = account.wallet;
    }
  }

  // Reaktif dosya listesi
  $: currentFiles = activeAccount && accounts.has(activeAccount) 
    ? accounts.get(activeAccount)!.files 
    : files;
</script>

<main class="min-h-screen bg-[#FEFFAF]">
  <Header />
  
  <div class="container mx-auto p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <WelcomeCard />
      <div class="space-y-8">
        <MultiWalletConnect
          {accounts}
          {activeAccount}
          on:connected={handleWalletConnection}
        />
        {#if walletConnected && currentWallet}
          <FileUpload 
            on:upload={handleUpload} 
            {walletConnected}
            wallet={currentWallet}
          />
        {/if}
      </div>
    </div>
    
    <FileList 
      files={currentFiles} 
      arweaveHash={currentHash} 
      {walletConnected} 
    />
    <IconBar />
  </div>
</main>

<style>
  :global(body) {
    font-family: 'League Spartan', sans-serif;
  }
</style>
