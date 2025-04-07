"use client";
import React, { useEffect } from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();

  // Verificación continua del JWT
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        router.push("/");
      }
    };

    checkAuthentication();
    const interval = setInterval(checkAuthentication, 15000);
    return () => clearInterval(interval);
  }, [router]);

  const checkUserStatus = async () => {
    try {
      const res = await fetch("/api/forms/userCheckStatus", { method: "GET" });
      const result = await res.json();

      if (res.ok && result.redirectUrl) {
        router.push(result.redirectUrl);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error al verificar estado del usuario:", error);
      return true;
    }
  };

  const checkTeamStatus = async () => {
    try {
      const res = await fetch("/api/forms/teamCheckStatus", { method: "GET" });
      const result = await res.json(); // ✅ siempre lee el body

      if (res.status === 400 && result.notification?.message) {
        toast.error(result.notification.message); // ✅ show toast
        return false;
      }

      if (res.ok && result.redirectUrl) {
        router.push(result.redirectUrl);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error al verificar estado del equipo:", error);
      toast.error("Error inesperado al verificar estado del equipo.");
      return false;
    }
  };

  const handleClickIndividual = async () => {
    const canProceed = await checkUserStatus();
    if (canProceed) {
      router.push("/registration/individual");
    }
  };

  const handleClickGroup = async () => {
    const canProceed = await checkTeamStatus();
    if (canProceed) {
      router.push("/registration/teams");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="background_home flex-1 flex flex-col items-center gap-6">
        <Header />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/text_formulario_de_registro.svg"
          alt="Formulario de Registro"
          className="w-72 h-auto"
        />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/button_registration_individual.svg"
          alt="Registro individual"
          className="w-72 h-auto cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
          onClick={handleClickIndividual}
        />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/button_registration_team.svg"
          alt="Registro grupal"
          className="w-72 h-auto mt-6 cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
          onClick={handleClickGroup}
        />

        <Footer />
      </div>
    </div>
  );
}
