/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        slate: {
          50: '#f8fafc',
          200: '#e2e8f0',
          400: '#94a3b8',
          600: '#475569',
          900: '#0f172a',
        },
        // Adicionando cores usadas no HTML original que podem não estar no tema padrão ou precisam de ajuste
        'soft-gradient-start': '#f0f9ff',
        'soft-gradient-end': '#e0f2fe',
      }
    },
  },
  plugins: [],
}
