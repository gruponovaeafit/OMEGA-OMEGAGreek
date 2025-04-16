import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Asegúrate de incluir tus rutas de archivos
  ],
  theme: {
    extend: {
      animation: {
        breathing: "breathing 3s ease-in-out infinite",
      },
      keyframes: {
        breathing: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
      },
      backgroundImage: {
        'primary-button': 'linear-gradient(90deg, #131313 0%, #3F4B33 45.19%, #866A42 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
