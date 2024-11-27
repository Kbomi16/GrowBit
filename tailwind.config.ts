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
          10: '#E3F9E5',
          20: '#C1F2C1',
          30: '#A0EAA0',
          40: '#81C645',
          50: '#6AA83A',
          60: '#4D8C2F',
          70: '#3A7225',
          80: '#2E5C1F',
          90: '#1E4A19',
          100: '#1D392B',
        },
      },
    },
  },
  plugins: [],
}
export default config
