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
        mainClassMatch: "#336D76",
        buttonClassMatch: "#00252A",
        premiumButtonClassMatch: "#00874D",
      },
    },
  },
  plugins: [],
};
