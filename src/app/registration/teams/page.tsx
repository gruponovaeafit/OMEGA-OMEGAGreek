"use client";
import React, { useState, useEffect } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [teamName, setTeamName] = useState("");
  const router = useRouter();

  // Verificación continua de cookies/JWT cada 15 segundos
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) {
          console.warn("⛔ Cookie inválida o expirada. Redireccionando...");
          router.push("/");
        }
      } catch (error) {
        console.error("Error verificando cookie:", error);
        router.push("/");
      }
    };

    // Ejecutar al cargar
    checkAuthentication();

    // Ejecutar cada 15 segundos
    const interval = setInterval(checkAuthentication, 15000);

    return () => clearInterval(interval);
  }, [router]);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/forms/teamRegistrationForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_name: teamName }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.notification?.message || "Error al registrar el equipo.");
        return;
      }

      toast.success(result.notification?.message || "Registro exitoso", {
        onClose: () => {
          if (result.redirectUrl) router.push(result.redirectUrl);
        },
      });

    } catch (error) {
      toast.error("Error al enviar el formulario.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <Header />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/text_registro_grupal.svg"
          alt="Formulario de Registro grupal"
          className="w-72 h-auto"
        />

        <TextQuestion
          name="teamname"
          question="Nombre del equipo"
          value={teamName}
          onChange={setTeamName}
          placeholder="Inserte nombre"
        />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/button_siguiente.svg"
          alt="Botón siguiente"
          className="w-32 h-auto cursor-pointer"
          onClick={handleSubmit}
        />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/pacho_dioniso.svg"
          alt="Pacho dioniso"
          className="w-48 h-auto"
        />

        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}
