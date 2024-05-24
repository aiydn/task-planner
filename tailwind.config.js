/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'print': {'raw': 'print'},
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "base-content": "#000000",
        },
        dark : {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-100": "#242424", //#242424
          "base-200": "#1f1f1f",
          "base-300": "#1a1a1a",
          "base-content": "#ffffff",
          "neutral": "#1F1F1F"

        },
      },
    ],
  },
}