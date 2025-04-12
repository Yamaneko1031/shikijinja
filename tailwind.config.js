/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fude: ['KouzanMouhitu', 'serif'],
        ackaisyo: ['Ackaisyo', 'serif'],
        aoyagi: ['AoyagiKouzan', 'serif'],
        otsutome: ['OtsutomeFont', 'serif'],
      },
    },
  },
};
