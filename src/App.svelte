<!--src/App.svelte-->
<script lang="ts">
  import Header from './components/Header.svelte';
  import WelcomeCard from './components/WelcomeCard.svelte';
  import FileUpload from './components/FileUpload.svelte';
  import FileList from './components/FileList.svelte';
  import IconBar from './components/IconBar.svelte';
  import MultiWalletConnect from './components/MultiWalletConnect.svelte';
  import type { Account, FileUploadResult } from './types';
  import { zkEncryption } from './lib/zk/encryption';
  import { generateNonce } from './lib/nonce';

  let accounts = new Map<string, Account>();
  let currentAccount: Account | null = null;
  let otherAccount: Account | null = null;

  function handleWalletConnected(event: CustomEvent) {
    const { wallet, account } = event.detail;
    accounts.set(wallet.publicKey.toString(), account);
    accounts = accounts; 

    updateAccounts();
  }

  function handleWalletDisconnected(event: CustomEvent) {
    const { isPrimary } = event.detail;
    if (isPrimary && currentAccount) {
      accounts.delete(currentAccount.publicKey.toString());
    } else if (!isPrimary && otherAccount) {
      accounts.delete(otherAccount.publicKey.toString());
    }
    accounts = accounts;
    updateAccounts();
  }

  function updateAccounts() {
    const accountArray = Array.from(accounts.values());
    currentAccount = accountArray.find(a => a.accountType === 'sender') || null;
    otherAccount = accountArray.find(a => a.accountType === 'receiver') || null;
  }

  async function handleUpload(event: CustomEvent<FileUploadResult>) {
    if (!currentAccount || !otherAccount) return;

    const { hash, fileName, size, publicUrl } = event.detail;

    // Encrypt IPFS address with receiver's public key
    const encryptedAddress = await zkEncryption.encrypt(
      publicUrl,
      otherAccount.encryptionKeys.publicKey,
      currentAccount.encryptionKeys.privateKey
    );

    const newFile = {
      message: fileName,
      sender: currentAccount.publicKey.toString(),
      size,
      hash,
      encryptedAddress: encryptedAddress.toString(),
      nonce: generateNonce()
    };

    otherAccount.files = [...otherAccount.files, newFile];
    accounts.set(otherAccount.publicKey.toString(), { ...otherAccount });
    accounts = accounts;
  }
</script>

<main class="min-h-screen bg-[#FEFFAF]">
  <Header />
  
  <div class="container mx-auto p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <WelcomeCard />
      <MultiWalletConnect
        {accounts}
        on:walletConnected={handleWalletConnected}
        on:walletDisconnected={handleWalletDisconnected}
      />
    </div>
    
    {#if currentAccount}
      <div class="mt-8">
        <FileUpload 
          on:upload={handleUpload}
          wallet={currentAccount.wallet}
        />
      </div>

      <div class="mt-8">
        <FileList 
          files={currentAccount.files}
          currentAccount={currentAccount}
          otherAccount={otherAccount}
        />
      </div>
    {/if}
    
    <IconBar />
  </div>
</main>

<style>
  :global(body) {
    font-family: 'League Spartan', sans-serif;
  }
</style>