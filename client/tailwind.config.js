/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 4%), 0 8px 24px rgb(15 23 42 / 6%)',
        'card-hover': '0 1px 2px rgb(15 23 42 / 5%), 0 12px 32px rgb(15 23 42 / 8%)',
      },
    },
  },
  plugins: [],
}