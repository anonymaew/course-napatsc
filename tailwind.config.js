module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    color: {
      pri: "#10b981",
      sec: "#cbd5e1",
      ter: "#0f172a",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
