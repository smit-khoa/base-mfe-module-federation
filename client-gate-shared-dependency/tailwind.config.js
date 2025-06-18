// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{js,ts,jsx,tsx,vue}", "./src/**/*.html"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./src/**/*.html",

    "./node_modules/reka-ui/**/*.{js,ts,jsx,tsx,vue}", // Thêm dòng này
  ],
  theme: {
    extend: {
      extend: {
        // keyframes: {
        //   "slide-in-from-top": {
        //     "0%": { transform: "translateY(-100%)" },
        //     "100%": { transform: "translateY(0)" },
        //   },
        //   "slide-in-from-bottom": {
        //     "0%": { transform: "translateY(100%)" },
        //     "100%": { transform: "translateY(0)" },
        //   },
        // },
        // animation: {
        //   "slide-in-from-top-2": "slide-in-from-top 0.2s ease-out",
        //   "slide-in-from-bottom-2": "slide-in-from-bottom 0.2s ease-out",
        // },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"), // Thêm plugin này
  ],
};
