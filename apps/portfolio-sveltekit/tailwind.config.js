/** @type {import('tailwindcss').Config} */
export default {
  presets: [require('@wisihe/tailwind-config')],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        inter: 'var(--font-inter)',
        oswald: 'var(--font-oswald)',
        lemonMilk: ['LemonMilk']
      }
    }
  }
}
