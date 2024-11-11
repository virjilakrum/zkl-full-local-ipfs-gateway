
<!--bu dosyanın dizini: project2/src/components/Header.svelte-->

<script>
  const links = [
    { href: "#", text: "X/Twitter" },
    { href: "#", text: "GitHub" },
    { href: "#", text: "Discord" },
    { href: "#", text: "Documentation" },
    { href: "#", text: "Team" }
  ];
</script>

<nav class="p-4 flex justify-between items-center">
  <div class="text-2xl font-bold">zkλ</div>
  <div class="flex gap-4">
    {#each links as { href, text }}
      <a {href} class="hover:underline">{text}</a>
    {/each}
  </div>
</nav>