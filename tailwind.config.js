/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a12',
          900: '#0b1329',
          800: '#131e3a',
          700: '#1e2d54',
        },
        brand: {
          cyan: '#06b6d4',
          amber: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444',
          emerald: '#10b981',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-spin': 'spin 4s linear infinite',
      }
    },
  },
  plugins: [],
}
