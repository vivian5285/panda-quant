/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        panda: {
          primary: {
            start: '#00FF9D',
            end: '#00BFAE'
          },
          dark: {
            background: '#0A0A0A',
            text: '#FFFFFF',
            secondary: '#1A1A1A',
            accent: '#2A2A2A'
          },
          light: {
            background: '#FFFFFF',
            text: '#000000',
            secondary: '#F5F5F5',
            accent: '#E5E5E5'
          }
        }
      },
      backgroundImage: {
        'panda-gradient': 'linear-gradient(135deg, #00FF9D 0%, #00BFAE 100%)',
        'panda-gradient-light': 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, rgba(0, 191, 174, 0.1) 100%)'
      },
      boxShadow: {
        'panda-card': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'panda-button': '0 4px 15px rgba(0, 255, 157, 0.3)'
      },
      animation: {
        'panda-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 