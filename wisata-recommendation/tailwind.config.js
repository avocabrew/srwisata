/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2BA79D",
        secondary: "#231E1B",
        background: "#ECE7E3",
      },
    },
  },
  plugins: [],
};
