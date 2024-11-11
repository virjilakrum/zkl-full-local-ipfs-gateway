import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: preprocess({
        typescript: true,
        sourceMap: true,
        postcss: true
      }),
      compilerOptions: {
        dev: true
      }
    })
  ],
  css: {
    postcss: './postcss.config.js'
  }
});