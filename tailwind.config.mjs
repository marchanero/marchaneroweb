/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/scripts/**/*.js',
  ],
  darkMode: 'class', // Permite toggle manual del modo oscuro
  theme: {
    extend: {
      fontFamily: {
        // Display: titulares y wordmark
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        // Body: texto de lectura y UI
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        // Mono: cifras, fechas, etiquetas tipo "lectura de instrumento"
        mono: ['"IBM Plex Mono"', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        // Sistema "traza de señal" — ver plan de diseño
        ink: '#0B1220',
        paper: '#F5F6F4',
        graphite: {
          50: '#F1F3F2',
          100: '#E4E7E9',
          200: '#C7CED3',
          300: '#A0AAB3',
          400: '#78838F',
          500: '#5B6572',
          600: '#3D4759',
          700: '#2A3241',
          800: '#1B212C',
          900: '#11151C',
        },
        line: {
          DEFAULT: '#DDE2E3',
          dark: '#1E2A3D',
        },
        signal: {
          50: '#E3FBF8',
          100: '#C3F5EE',
          300: '#5FE5D6',
          400: '#22D3BE',
          500: '#00BFA6',
          600: '#00A38D',
          700: '#037F6E',
        },
        pulse: {
          50: '#FFF1EB',
          100: '#FFE1D6',
          300: '#FFAF92',
          400: '#FF8562',
          500: '#FF5A36',
          600: '#E8441F',
          700: '#C1350F',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'trace-draw': 'traceDraw 1.6s ease-out forwards',
        'dot-move': 'dotMove 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        traceDraw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        dotMove: {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
