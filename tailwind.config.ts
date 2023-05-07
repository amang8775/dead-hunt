import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      deadFont: ["deadFont", "sans-serif"],
      codeFont: ["codeFont", "consolas", "sans-serif"],
    },
    screens: {
      xs: "0px",
      mb: "400px",
      sm: "600px",
      md: "960px",
      lg: "1280px",
      xl: "1920px",
    },
    extend: {
      colors: {
        "dead-green": "#15BB44",
        "dead-green-l": "#72d68e",
        "dead-yellow": "#FFFF00",
        "dead-black": "#0e0c0a",
        "dead-white": "#aeaeae",
        "dead-white-more": "#fcfbfc",
        "dead-error": "#ff0000",
      },
    },
  },
  plugins: [],
} satisfies Config;
