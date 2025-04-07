"use client";
import React, { useEffect } from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";

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

    // Verificación inicial y cada 15 segundos
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
        return false; // Ya completó el formulario
      }

      return true; // Puede continuar
    } catch (error) {
      console.error("Error al verificar estado del usuario:", error);
      return true;
    }
  };

  const handleClickIndividual = async () => {
    const canProceed = await checkUserStatus();
    if (canProceed) {
      router.push("/registration/individual");
    }
  };

  const handleClickGroup = async () => {
    const canProceed = await checkUserStatus();
    if (canProceed) {
      router.push("/registration/teams");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="background_home flex-1 flex flex-col items-center gap-6">
        <Header />

        <img
          src="/text_formulario_de_registro.svg"
          alt="Formulario de Registro"
          className="w-72 h-auto"
        />

        <img
          src="/button_registration_individual.svg"
          alt="Registro individual"
          className="w-72 h-auto"
          onClick={handleClickIndividual}
        />

        <img
          src="/button_registration_team.svg"
          alt="Registro grupal"
          className="w-72 h-auto mt-6"
          onClick={handleClickGroup}
        />

        <Footer />
      </div>
    </div>
  );
}
