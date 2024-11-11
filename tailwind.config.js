/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#FEFFAF'
      },
      fontFamily: {
        'league-spartan': ['"League Spartan"', 'sans-serif']
      }
    }
  },
  plugins: [],
}