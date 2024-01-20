/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        textColor: "#2d2f31",
        mainColor: "#007dfc",
        mainColorBold: "#0054fc",
        mainColorHover: "rgba(0, 125, 252, 0.2)",
        secondColor: "#2563eb",
        activeColor: "#FF630B",
        ratingColor: "#b4690e",
        draft: '#34495E',
        pending: '#9B59B6',
        active: '#30CBB3',
        rejected: '#E74C3C' 
      },
      fontFamily: {
        roboto: ['Roboto']
      },
      boxShadow: {
        'shadowBottom': "0 1px 4px rgba(0,0,0,0.12)",
      },
      keyframes: {
        linearInfinite: {
          '0%': {
            transform:  'translateX(0) scaleX(0)'
          },
          '40%': {
            transform:  'translateX(0) scaleX(0.2)'
          },
          '100%': {
            transform:  'translateX(100%) scaleX(0.6)'
          }
        },
        homeLeft: {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '40%': {
            transform: 'translateX(-60%)'
          },
          '60%': {
            transform: 'translateX(-40%)'
          },
          '100%': {
            transform: 'translateX(0)'
          },
        }
      },
       animation: {
        'linearProgress': 'linearInfinite 1s linear infinite',
        'homeLeftToRight': 'homeLeft 1s linear'
       }
    },
  },
  plugins: [],
}


