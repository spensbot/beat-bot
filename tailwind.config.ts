import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // or 'class' if you want manual toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config