module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class", // or 'media'
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        "iot-light": {
          primary: "#f9d8a7",
          secondary: "#f9e6bb",
          accent: "#ef777f",
          neutral: "#282d39",
          "base-100": "#e9ebf2",
          info: "#21c8f2",
          success: "#64d89c",
          warning: "#fbb709",
          error: "#f05678",
        },
      },
      {
        "iot-dark": {
          primary: "#f9d8a7",
          secondary: "#f9e6bb",
          accent: "#ef777f",
          neutral: "#282d39",
          "base-100": "#263040",
          info: "#21c8f2",
          success: "#64d89c",
          warning: "#fbb709",
          error: "#f05678",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
