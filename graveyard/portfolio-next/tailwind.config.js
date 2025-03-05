/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@wisihe/tailwind-config')],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './app/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './pages/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: 'var(--font-inter)',
        oswald: 'var(--font-oswald)'
      }
    }
  }
}
