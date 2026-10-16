/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal Blue Palette
        royal: {
          950: '#060B18',
          900: '#0F172A',
          800: '#1E293B',
          700: '#1D4ED8',
          600: '#2563EB', // Core Royal Blue Accent
          500: '#3B82F6',
          400: '#60A5FA',
          200: '#BFDBFE',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        // Royal White Surfaces
        white: '#FFFFFF',
        offwhite: '#FAFAFC',
        canvas: '#F8FAFC',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'royal': '0 4px 20px -2px rgba(37, 99, 235, 0.15)',
        'royal-lg': '0 10px 30px -5px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
};
