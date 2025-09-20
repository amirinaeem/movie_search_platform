/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      container: { center: true, padding: "1rem" },
      boxShadow: {
        glow: "0 10px 30px -10px rgba(79,70,229,.4)"
      }
    },
  },
  plugins: [],
};
