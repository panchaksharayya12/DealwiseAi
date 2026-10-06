/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#050505',
        surface: '#0d0d0f',
        'surface-subtle': '#141417',
      },
      letterSpacing: {
        tighter: '-0.04em',
      },
    },
  },
  plugins: [],
}
