import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-paper': '#F6F6F3',
        'brand-ink': '#3B4953',
        'brand-structure': '#5A7863',
        'brand-surface': '#90AB8B',
        'brand-highlight': '#EBF4DD',
      },
    },
  },
  plugins: [],
}
export default config
