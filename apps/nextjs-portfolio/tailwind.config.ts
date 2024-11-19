import type { Config } from 'tailwindcss';

export default {
  presets: [require('@wisihe/tailwind-config')],
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-react/**/*.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: 'var(--font-inter)',
        oswald: 'var(--font-oswald)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
} satisfies Config;
