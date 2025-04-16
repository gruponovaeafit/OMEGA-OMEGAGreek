"use client"

import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import FormHeader from "@/app/components/UI/FormHeader";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";


export default function View2() {

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
          const res = await fetch("/api/forms/userCheckStatusConfirmation", { method: "GET" });
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
    university: "",
    study_area: "",
    career: "",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formObject = Object.fromEntries(formData.entries());
    console.log("Form data:", formData, "Checkbox checked:", isChecked);

    try {
      const response = await fetch("/api/forms/userAcademicForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      toast.success(
        result.notification?.message || "Formulario enviado con éxito.",
        {
          onClose: () =>
            router.push(result.redirectUrl || "/confirmation/individual/view3"),
        },
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
      );
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <div className="h-screen flex flex-col">
      <form
        onSubmit={handleFormSubmit}
        className="background_individual_view2 flex-1 flex flex-col items-center gap-2"
      >
        <Header />

        <div className="w-full max-w-[320px] mb-6">
          <FormHeader title="Formulario de confirmación" />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu universidad"
            label="Universidad"
            name="university"
            value={formData.university}
            onChange={(val) => handleChange("university", val)}
            options={["Administrador", "Diseñador", "Mercadeo", "Desarrollador"]}
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu área de estudio"
            label="Área de estudio"
            name="study_area"
            value={formData.study_area}
            onChange={(val) => handleChange("study_area", val)}
            options={["Administrador", "Diseñador", "Mercadeo", "Desarrollador"]}
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu programa académico"
            label="Programa académico"
            name="career"
            value={formData.career}
            onChange={(val) => handleChange("career", val)}
            options={["Administrador", "Diseñador", "Mercadeo", "Desarrollador"]}
          />
        </div>

        <CheckboxButtonIndividual onChange={handleCheckboxChange} />

        <div className="flex flex-wrap justify-center items-center gap-4 w-full max-w-[320px]">
          <img
            src="/Hefesto.svg"
            alt="Hefesto"
            className="w-42 h-44"
          />
          <Button label="Siguiente" />
        </div>

        <Footer />
      </form>
    </div>
  );
}
