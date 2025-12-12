/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nebula: {
          50: '#f6f3ff',
          100: '#ede8ff',
          200: '#dcd4ff',
          300: '#c0b0ff',
          400: '#a18eff',
          500: '#7c60ff',
          600: '#5c42d8',
          700: '#462fa8',
          800: '#35267f',
          900: '#2a2261',
        },
      },
      boxShadow: {
        glow: '0 10px 60px rgba(124, 96, 255, 0.35)',
        neon: '0 0 20px rgba(167, 139, 250, 0.7), 0 0 60px rgba(167, 139, 250, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.25 },
          '50%': { opacity: 0.6 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        fall: {
          '0%': { transform: 'translateY(-40px) rotate(-15deg)', opacity: 0 },
          '20%': { opacity: 1 },
          '100%': { transform: 'translateY(120px) rotate(25deg)', opacity: 0 },
        },
        pop: {
          '0%': { opacity: 0, transform: 'scale(0.92) translateY(6px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 6s ease-in-out infinite',
        shake: 'shake 0.45s ease-in-out',
        fall: 'fall 1.8s ease-out forwards',
        pop: 'pop 0.28s ease-out',
      },
    },
  },
  plugins: [],
};
