<!--src/components/IPFSStatus.svelte-->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { checkIPFSNode } from '../lib/ipfs-config';
  
    let isNodeRunning = false;
    let checkInterval: NodeJS.Timeout;
  
    async function checkStatus() {
      isNodeRunning = await checkIPFSNode();
    }
  
    onMount(() => {
      checkStatus();
      checkInterval = setInterval(checkStatus, 5000); // Her 5 saniyede bir kontrol et
    });
  
    onDestroy(() => {
      if (checkInterval) clearInterval(checkInterval);
    });
  </script>
  
  <div class="text-sm">
    {#if isNodeRunning}
      <div class="flex items-center space-x-2 text-green-600">
        <div class="w-2 h-2 bg-green-600 rounded-full"></div>
        <span>IPFS Node Active</span>
      </div>
    {:else}
      <div class="flex items-center space-x-2 text-red-600">
        <div class="w-2 h-2 bg-red-600 rounded-full"></div>
        <span>IPFS Node Inactive</span>
      </div>
      <div class="mt-2 text-xs text-gray-600">
        Please start IPFS daemon:
        <pre class="mt-1 bg-gray-100 p-2 rounded">
          1. Open new terminal
          2. Run: ipfs daemon
        </pre>
      </div>
    {/if}
  </div>