import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bold: ['AppleSDGothicNeoB'],
      },
      colors: {
        green: {
          10: '#edecdf',
          20: '#95b391',
          30: '#355d39',
          40: '#1E4A19',
          50: '#1D392B',
        },
        darkPrimary: '#181818',
      },
    },
  },
  plugins: [],
}
export default config
