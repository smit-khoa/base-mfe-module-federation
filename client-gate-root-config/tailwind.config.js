/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,vue}", "./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#0069FE",
        secondary: "#000A2C",
        sidebar: {
          bg: "#FFFFFF",
          text: "#000A2C",
          subtitle: "#002071",
          icon: "#7D91A6",
          active: "#CBE9FE",
          hover: "#F9F8FC",
          border: "#E8EDF2",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "inter-tight": ["Inter Tight", "sans-serif"],
      },
    },
  },
  plugins: [],
};
