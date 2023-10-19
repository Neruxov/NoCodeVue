/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'text': 'SF Pro Display',
        'code': 'Cascadia Code'
      },
      gridTemplateRows: {
        'mobile-task': '66% 33% 100%'
      },
      colors: {
        'neutral-925': '#202020',
        'neutral-875': '#262626'
      }
    }
  },
  plugins: [],
}