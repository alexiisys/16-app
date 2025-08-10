const colors = require('./src/components/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'montserrat-200': ['Montserrat_200ExtraLight'],
        'montserrat-300': ['Montserrat_300Light'],
        'montserrat-400': ['Montserrat_400Regular'],
        'montserrat-500': ['Montserrat_500Medium'],
        'montserrat-600': ['Montserrat_600SemiBold'],
        'montserrat-700': ['Montserrat_700Bold'],
        'montserrat-800': ['Montserrat_800ExtraBold'],
        'gilroy-100': ['Gilroy-Thin'],
        'gilroy-200': ['Gilroy-UltraLight'],
        'gilroy-300': ['Gilroy-Light'],
        'gilroy-400': ['Gilroy-Regular'],
        'gilroy-500': ['Gilroy-Medium'],
        'gilroy-600': ['Gilroy-SemiBold'],
        'gilroy-700': ['Gilroy-Bold'],
        'gilroy-800': ['Gilroy-ExtraBold'],
        'gilroy-900': ['Gilroy-Black'],
        gilroy: ['Gilroy-Regular'],
        inter: ['Inter'],
      },
      colors,
    },
  },
  plugins: [],
};
