<!--src/components/IconBar.svelte-->
<script lang="ts">
    const icons = [
      { 
        name: "Solana", 
        symbol: "≡"
      },
      { 
        name: "Arweave", 
        symbol: "@"
      },
      { 
        name: "Ethereum", 
        symbol: "◊"
      },
      { 
        name: "Waku", 
        symbol: "◎"
      }
    ];
  </script>
  
  <div class="mt-8 border-2 border-dashed border-black p-6 rounded-lg relative">
    <div class="absolute right-0 top-0 bottom-0 w-8 bg-black opacity-10"></div>
    
    <div class="flex justify-around items-center">
      {#each icons as icon}
        <div class="w-16 h-16 flex items-center justify-center">
          <span class="text-4xl">{icon.symbol}</span>
        </div>
      {/each}
    </div>
  </div>