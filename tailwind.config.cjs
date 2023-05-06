/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'fast-pulse': 'fast-pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fast-pulse':  {
          '0%, 100%': { opacity: 1},
          '50%': {opacity: 0.4 }
        }
      }

    },
  },
  plugins: [],
};
