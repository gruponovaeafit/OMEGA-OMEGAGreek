"use client";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import FormHeader from "@/app/components/UI/FormHeader";

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
      const res = await fetch("/api/forms/userCheckStatusConfirmation", {
        method: "GET",
      });
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
      const result = await res.json();

      if (res.status === 400 && result.notification?.message) {
        toast.error(result.notification.message);
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
      
      {/* Reemplazo el título con FormHeader */}
      <div className="w-full max-w-[320px] mb-6">
        <FormHeader title="Formulario de confirmación" />
      </div>
      
      {/* Sección de confirmación individual */}
      
<div 
  className="w-72 bg-transparent p-0 rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
  onClick={handleClickIndividual}
>
  <img
    src="/Confirmacion_Individual.svg"
    alt="Registro individual"
    className="w-full h-auto"
  />
</div>

{/* Sección de confirmación grupal */}
<div 
  className="w-72 mt-6 bg-transparent p-0 rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
  onClick={handleClickGroup}
>
  <img
    src="/Confirmacion_Grupal.svg"
    alt="Registro grupal"
    className="w-full h-auto"
  />
</div>
      
      <Footer />
    </div>
  );
}