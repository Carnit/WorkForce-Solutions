/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors if needed
      },
    },
  },
  plugins: [],
  // Force light mode - disable dark mode
  darkMode: 'class', // or remove this line entirely
}