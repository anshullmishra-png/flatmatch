import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: '#FF4D00',
        ink: '#000000',
        paper: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-archivo-black)', 'Impact', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        spin360: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
        'marquee-reverse': 'marquee-reverse 22s linear infinite',
        spin360: 'spin360 12s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
