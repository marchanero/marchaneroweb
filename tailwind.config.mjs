/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
          50: '#E6F7F6',
          100: '#CCEFEC',
          300: '#66CFC7',
          400: '#2DBDB3',
          500: '#0EA5A0',
          600: '#0B8983',
          700: '#086F6A',
        },
        pulse: {
          100: '#FFE3D9',
          400: '#FF8B6E',
          500: '#FF6B4A',
          600: '#E5502F',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'trace-draw': 'traceDraw 1.6s ease-out forwards',
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
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
