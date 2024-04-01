/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
  theme: {
    extend: {
      aspectRatio: {
        portrait: "12 / 16",
      },
      height: {
        screen: ["100vh /* fallback for Opera, IE and etc. */", "100dvh"],
      },
      minHeight: {
        screen: ["100vh /* fallback for Opera, IE and etc. */", "100dvh"],
      },
      maxWidth: {
        "screen-3xl": "1920px",
      },
      fontFamily: {
        inter: "var(--font-inter)",
        oswald: "var(--font-oswald)",
      },
      colors: {
        primary: "#DE0D92",
        secondary: "#31493C",
        tertiary: "#F2F2F2",
        dark: "#2B061E",
        shadow: "#203647",
        highlight: "#FAE20C",
        bright: "#C2CACD",
      },
    },
  },
}
