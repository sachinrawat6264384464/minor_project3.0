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
        // Brutalist Concrete Theme (from MOME poster)
        concrete: {
          DEFAULT: '#8C8C8C',
          50: '#F4F5F6',
          100: '#E6E7E9',
          200: '#C8CBD0',
          300: '#A6ABB2',
          400: '#8C8C8C', // Exact Background
          500: '#757980',
          600: '#5F6268',
          700: '#46494E',
          800: '#2E3034',
          900: '#18191B',
          950: '#0C0D0E',
        },
        // Royal Blue Palette (preserved for app workspace if needed)
        royal: {
          950: '#060B18',
          900: '#0F172A',
          800: '#1E293B',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          200: '#BFDBFE',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        white: '#FFFFFF',
        offwhite: '#FAFAFC',
        canvas: '#8C8C8C',
        border: '#000000',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        chiseled: ['Foldit', 'Nova Cut', 'Syne', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-white': '4px 4px 0px 0px #FFFFFF',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-lg-white': '8px 8px 0px 0px #FFFFFF',
        'royal': '0 4px 20px -2px rgba(37, 99, 235, 0.15)',
        'royal-lg': '0 10px 30px -5px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
};
