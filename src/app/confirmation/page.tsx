"use client";
import { TextButton } from "../components/forms/confirmation/individual/text";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";

export default function Confirmation() {

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
      router.push("/confirmation/individual");
    }
  };

  const handleClickGroup = async () => {
    const canProceed = await checkTeamStatus();
    if (canProceed) {
      router.push("/confirmation/teams");
    }
  };

  return (
    <div className="background_email min-h-screen flex flex-col items-center py-4">
      <Header />
      <img
          src="/Formulario_Inscripcion_Titulo.svg"
          alt="Formulario de Inscripción Título"
          className="w-72 h-auto"
        />
      <img
          src="/Inscripcion_Individual_Boton.svg"
          alt="Registro individual"
          className="w-72 h-auto cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
          onClick={handleClickIndividual}
        />

        <img
          src="/Inscripcion_Grupal_Boton.svg"
          alt="Registro grupal"
          className="w-72 h-auto mt-6 cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
          onClick={handleClickGroup}
        />
      <Footer/>
    </div>
  );
}
