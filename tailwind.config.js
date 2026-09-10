/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          650: '#3e4e66',
          750: '#293548',
          850: '#172033',
        },
      },
    },
  },
  plugins: [],
};