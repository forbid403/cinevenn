/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#f5f1e8',
          100: '#ebe5d8'
        },
        'warm-black': '#1a1614',
        'warm-gray': {
          200: '#d4cfc8',
          400: '#8a847e'
        },
        gold: {
          600: '#d4a574',
          700: '#c69563'
        },
        'deep-red': '#8b2635',
        sepia: '#5a5450',
        champagne: '#e4c59e',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        baskerville: ['"Libre Baskerville"', 'serif'],
        lora: ['Lora', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        imperial: ['Imperial Script', 'cursive'],
        specialElite: ['"Special Elite"', 'cursive'],
      },
      animation: {
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-5%, -5%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}