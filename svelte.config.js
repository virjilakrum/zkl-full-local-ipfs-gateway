import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess({
    typescript: true,
    sourceMap: true,
    postcss: true
  })
};