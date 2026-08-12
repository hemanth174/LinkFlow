/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./landing/**/*.html'],
  theme: {
    extend: {
      colors: {
        ink: '#171816',
        lime: '#c8f36a',
        paper: '#f4f3ee'
      },
      fontFamily: {
        sans: ['Manrope', 'Arial', 'sans-serif'],
        mono: ['DM Mono', 'monospace']
      }
    }
  },
  plugins: []
};
