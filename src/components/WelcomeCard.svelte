
<!--bu dosyanın dizini: project2/src/components/WelcomeCard.svelte-->


<div class="border-2 border-dashed border-black p-6 rounded-lg">
  <h1 class="text-4xl font-bold mb-4">welcome back,<br/>username.</h1>
  <p class="text-lg">
    We would like to show you analytics about how much data you've transferred so far; but we can't.
    Because with zk-Lokomotive, even us, the owners can't collect any data or metadata generated from
    your private data.
  </p>
  <p class="mt-4">This is the zkλ way.</p>
</div>

<div class="border-2 border-dashed border-black p-6 rounded-lg mt-8">
  <h2 class="text-2xl font-bold mb-4">Upload Your Files</h2>
  <p class="text-lg mb-4">
    Easily upload your files securely using zk-Lokomotive. Your files will be encrypted and safely transferred.
  </p>
  <input 
    type="file"
    id="file-upload"
    multiple
    class="w-full py-2 px-3 border-2 border-black rounded-lg cursor-pointer text-lg focus:outline-none focus:ring-2 focus:ring-black"
  >
  <!-- <button 
    id="upload-button"
    class="mt-4 w-full bg-black text-white py-2 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-150"
    on:click={handleFileUpload}
  >
    Upload Files
  </button> -->
</div>

<!-- <script>
  function handleFileUpload() {
    const input = document.getElementById('file-upload');
    const files = input.files;

    if (input && input.files.length > 0) {
      console.log('Files to be uploaded:', files);
      // 🏗️ TODO: Implement actual file upload logic
    } else {
      alert('Please select files to upload.');
    }
  }
</script> -->


<!-- <div class="flex justify-around items-center mt-8 border-t-2 border-black pt-4">
  <button class="text-2xl hover:underline">☰</button>
  <button class="text-2xl hover:underline">@</button>
  <button class="text-2xl hover:underline">◆</button>
  <button class="text-2xl hover:underline">☉</button>
</div> -->
