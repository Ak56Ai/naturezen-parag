/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#CFFFDC',
          100: '#A5D6A7',
          200: '#81C784',
          300: '#68BA7F',
          400: '#4CAF50',
          500: '#388E3C',
          600: '#2E6F40',
          700: '#253D2C',
          800: '#293325',
          900: '#1B5E20',
        },
        green: {
          50: '#CFFFDC',
          100: '#A5D6A7',
          200: '#81C784',
          300: '#68BA7F',
          400: '#4CAF50',
          500: '#388E3C',
          600: '#2E6F40',
          700: '#253D2C',
          800: '#293325',
          900: '#1B5E20',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'green': '0 4px 14px 0 rgba(76, 175, 80, 0.15)',
        'green-lg': '0 10px 25px -3px rgba(76, 175, 80, 0.2), 0 4px 6px -2px rgba(76, 175, 80, 0.1)',
      },
    },
  },
  plugins: [],
};