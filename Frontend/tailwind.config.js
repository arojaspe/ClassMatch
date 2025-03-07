/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        KhandRegular: ["Khand-Regular"],
        KhandBold: ["Khand-Bold"],
        KhandLigth: ["Khand-Ligth"],
        KhandMedium: ["Khand-Medium"],
        KhandSemiBold: ["Khand-SemiBold"],
      },
      colors: {
        headClassMatch: "#004954",
        mainClassMatch: "#72A2A9",
        buttonClassMatch: "#00252A",
        premiumButtonClassMatch: "#00874D",
        accentButtonClassMatch: "#00BEC9",
        cardClassMatch: "#a2bfc4",
        backgroundClassMatch: "#c2d3d6",
        accentClassMatch: "#aec5c9",
      },
    },
  },
  plugins: [],
};
