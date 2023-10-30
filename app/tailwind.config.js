/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{jsx,tsx}", "./components/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jam: {
          pink: "#C71FAC",
          "light-purple": "#E9CAFF",
          purple: "#62258E",
          "dark-purple": "#190B23",
          "dark-grey": "#1E1E1E",
          "light-grey": "#E3E3E3",
          "light-transparent": "#2C2035",
        },
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(at left top , #4D1D70 0%, #1E102D 100%)",
      },
      lineHeight: {
        11: "3rem",
        12: "3.5rem",
      },
    },
  },
  plugins: [],
};
