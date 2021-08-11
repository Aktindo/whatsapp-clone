const { primary } = require("daisyui/colors/colorNames");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        chatscreen: "#ECE5DD",
        "chatbubble-primary": "#DCF8C6",
        ...require("daisyui/colors"),
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      comfortaa: ["Comfortaa"],
      inter: ["Inter", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#25D366",
          "primary-focus": "#26bf5f",
          "primary-content": "#ffffff",
          secondary: "#128C7E",
          "secondary-focus": "#128C7E",
          "secondary-content": "#ffffff",
          accent: "#37cdbe",
          "accent-focus": "#2aa79b",
          "accent-content": "#ffffff",
          neutral: "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#e74c3c",
        },
        dark: {
          primary: "#25D366",
          "primary-focus": "#26bf5f",
          "primary-content": "#ffffff",
          secondary: "#128C7E",
          "secondary-focus": "#128C7E",
          "secondary-content": "#ffffff",
          accent: "#37cdbe",
          "accent-focus": "#2aa79b",
          "accent-content": "#ffffff",
          neutral: "#2A2E37",
          "neutral-focus": "#16181D",
          "neutral-content": "#ffffff",
          "base-100": "#3D4451",
          "base-200": "#2A2E37",
          "base-300": "#16181D",
          "base-content": "#EBECF0",
          info: "#66C7FF",
          success: "#87D039",
          warning: "#E2D562",
          error: "#e74c3c",
        },
      },
    ],
  },
};
