"use client";
import React, { useState, useEffect } from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import { Select } from "@/app/components/forms/registration/individual/questions";

export default function Home() {
  const [preferred_role1, setPreferred_role1] = useState("Rol 1");
  const [preferred_role2, setPreferred_role2] = useState("Rol 2");

  const router = useRouter();

  // ⏱️ Verificar cookies al cargar y luego cada 30 segundos
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) {
          console.warn("🔒 Token inválido o expirado. Redirigiendo a /");
          router.push("/");
        }
      } catch (error) {
        console.error("❌ Error verificando autenticación:", error);
        router.push("/");
      }
    };

    checkAuthentication(); // Verifica al cargar

    const interval = setInterval(() => {
      checkAuthentication(); // Verifica cada 30 segundos
    }, 30000);

    document.body.classList.add("no-scroll");
    return () => {
      clearInterval(interval);
      document.body.classList.remove("no-scroll");
    };
  }, [router]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/forms/userRolesForm", {
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
            router.push(result.redirectUrl || "/registration/individual/view2"),
        },
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
      );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <form
        onSubmit={handleFormSubmit}
        className="background_individual_view2 flex-1 flex flex-col items-center gap-2"
      >
        <Header />

        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/text_registro_individual.svg"
          alt="Formulario de Registro"
          className="w-72 h-auto"
        />

        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/button_admin.svg"
          alt="Admin"
          className="w-72 h-auto"
        />
        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/button_designer.svg"
          alt="Diseño"
          className="w-72 h-auto"
        />
        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/button_marketing.svg"
          alt="Marketing"
          className="w-72 h-auto"
        />
        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/button_developer.svg"
          alt="Desarrollador"
          className="w-72 h-auto"
        />

        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">
            Rol preferido 1
          </h3>
          <Select
            name="preferred_role1"
            placeholder="Rol preferido 1"
            value={preferred_role1}
            onChange={setPreferred_role1}
            options={[
              "Administrador",
              "Diseñador",
              "Mercadeo",
              "Desarrollador",
            ]}
          />
        </div>

        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">
            Rol preferido 2
          </h3>
          <Select
            name="preferred_role2"
            placeholder="Rol preferido 2"
            value={preferred_role2}
            onChange={setPreferred_role2}
            options={[
              "Administrador",
              "Diseñador",
              "Mercadeo",
              "Desarrollador",
            ]}
          />
        </div>

        <button type="submit">
          <img
            src="https://novaeafit2.blob.core.windows.net/omega-2025/button_siguiente.svg"
            alt="Botón siguiente"
            className="w-32 h-auto cursor-pointer"
          />
        </button>

        <Footer />
      </form>
    </div>
  );
}
