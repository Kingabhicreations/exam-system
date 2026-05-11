/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff', 100: '#dae6ff', 500: '#4f7cff', 600: '#3a63e0', 700: '#2c4cb8',
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
