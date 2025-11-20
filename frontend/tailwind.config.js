/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00305B', // Navy blue
        secondary: '#FEBC42', // Gold
        'primary-dark': '#001E3C',
        'primary-light': '#004080',
        'secondary-dark': '#E5A732',
        'secondary-light': '#FFD670'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
