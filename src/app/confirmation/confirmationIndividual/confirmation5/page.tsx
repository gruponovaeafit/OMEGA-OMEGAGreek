"use client";
import React, { useState } from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Por favor, ingresa el nombre del equipo.");
      return;
    }

    console.log("Nombre del equipo:", teamName);
    // Aquí puedes redirigir o guardar datos
    router.push("/registration/teams/next-step"); // Reemplaza con tu ruta real
  };

  return (
    <div className="h-screen flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="background_home flex-1 flex flex-col items-center gap-4 px-4"
      >
        <Header />

        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/text_formulario_de_registro.svg"
          alt="Formulario de Confirmación"
          className="w-72 h-auto"
        />

        {/* Texto del martillo */}
        <div className="bg-white/10 border border-white/30 text-white text-sm rounded-lg p-4 w-72 text-center">
          <img
            src="https://novaeafit2.blob.core.windows.net/omega-2025/icon_martillo.svg"
            alt="Martillo"
            className="w-8 h-8 mx-auto mb-2"
          />
          <p>
            El correo que se introdujo al empezar el formulario es el del líder del grupo. 
            Más adelante, cada integrante deberá registrarse individualmente, ¡incluyendo el líder!
          </p>
        </div>

        {/* Input del nombre del equipo */}
        <label className="text-white text-lg font-semibold mt-4">
          Nombre del equipo
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Nombre"
          className="w-72 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-orange-400 text-white placeholder-white text-center"
        />

        {/* Botón de siguiente */}
        <button
          type="submit"
          className="mt-4 w-32 bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full"
        >
          Siguiente
        </button>

        <Footer />
        <ToastContainer />
      </form>
    </div>
  );
}
