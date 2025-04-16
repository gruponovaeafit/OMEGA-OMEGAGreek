"use client";

import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/UI/Button";
import {
  Select,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";
import FormHeader from "@/app/components/UI/FormHeader";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";

export default function View3() {
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

  const [formData, setFormData] = useState({
    eps: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    relationship: "",
    medical_info: "",
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      <form
        onSubmit={handleFormSubmit}
        className="background_individual_view2 flex-1 flex flex-col items-center gap-2"
      >
        <Header />

        <div className="w-full max-w-[320px] mb-6">
          <FormHeader
            title="Preguntas médicas"
            note="*Estas son muy importantes para garantizar tu bienestar durante el evento"
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu EPS"
            label="EPS"
            name="eps"
            value={formData.eps}
            onChange={(val) => handleChange("eps", val)}
            options={[
              "Administrador",
              "Diseñador",
              "Mercadeo",
              "Desarrollador",
            ]}
          />
        </div>

        <TextQuestion
          question="Nombre contacto de emergencia"
          questionLabelId="emergency_contact_name"
          name="emergency_contact_name"
          value={formData.emergency_contact_name}
          onChange={(val) => handleChange("emergency_contact_name", val)}
          placeholder="Escribe el nombre de tu contacto"
        />

        <TextQuestion
          question="Número celular del contacto de emergencia"
          questionLabelId="emergency_contact_phone"
          name="emergency_contact_phone"
          value={formData.emergency_contact_phone}
          onChange={(val) => handleChange("emergency_contact_phone", val)}
          placeholder="Escribe el número de tu contacto"
        />

        <TextQuestion
          question="Tu relación con el contacto de emergencia"
          questionLabelId="relationship"
          name="relationship"
          value={formData.relationship}
          onChange={(val) => handleChange("relationship", val)}
          placeholder="Escribe el parentesco con tu contacto"
        />

        <TextQuestion
          question="Información médica relevante"
          questionLabelId="medical_info"
          name="medical_info"
          value={formData.medical_info}
          onChange={(val) => handleChange("medical_info", val)}
          placeholder="Escríbelas aquí en caso de que aplique"
        />

        <div className="flex flex-wrap justify-between items-center gap-4 w-full max-w-[320px]">
          <img src="/Afrodita.svg" alt="Afrodita" className="w-40 h-42" />
          <Button label="Siguiente" />
        </div>

        <Footer />
      </form>
    </div>
  );
}
