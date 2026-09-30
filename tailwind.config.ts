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
        // Deep black OLED theme
        'ink': {
          '900': '#060608', // Base background (true black)
          '800': '#121216', // Card/Surface background
          '700': '#27272a', // Borders/Dividers
          '600': '#3f3f46', // Secondary dividers
          '500': '#52525b', // Muted text
          '400': '#a1a1aa', // Secondary text
          '300': '#d4d4d8', // Primary text
          '200': '#e4e4e7', // Light text
          '100': '#fafafa', // Almost white
        },
        // Accent colors
        'accent': {
          'indigo': '#6366f1',
          'violet': '#8b5cf6',
        },
      },
      fontFamily: {
        // Sans-serif options
        'sans': ['var(--font-inter)', 'var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        'jakarta': ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        // Serif (traditional book feel)
        'serif': ['var(--font-lora)', 'var(--font-merriweather)', 'Georgia', 'serif'],
        'lora': ['var(--font-lora)', 'Georgia', 'serif'],
        'merriweather': ['var(--font-merriweather)', 'Georgia', 'serif'],
        'playfair': ['var(--font-playfair)', 'Georgia', 'serif'],
        // Monospace
        'mono': ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backdropBlur: {
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
export default config
