"use client";
import React, { useState, useEffect } from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import {
  YesNoQuestion,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";

export default function Home() {
  const [hasParticipated, setHasParticipated] = useState<boolean | null>(null);
  const [telefono, setTelefono] = useState("");
  const [conociste, setConociste] = useState("");
  const [semestre, setSemestre] = useState("");
  const [disponible, setDisponible] = useState<boolean | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Función para verificar la autenticación
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/");
      }
    };

    // Verificar autenticación al montar el componente
    checkAuthentication();

    const interval = setInterval(() => {
      checkAuthentication(); // Verifica cada 30 segundos
    }, 15000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [router]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/forms/userExtraDataForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previous_participation: hasParticipated,
          semester: semestre,
          phone: telefono,
          how_did_hear: conociste,
          has_time: disponible,
        }),
      });

      const result = await response.json();

      if (result.incompleteFields) {
        setConociste(result.incompleteFields.how_did_hear || "");
        setTelefono(result.incompleteFields.phone || "");
        setSemestre(result.incompleteFields.semester || "");
        setHasParticipated(
          result.incompleteFields.previous_participation ?? null,
        );
        setDisponible(result.incompleteFields.has_time ?? null);
      }

      if (!response.ok) {
        console.error(
          "Error:",
          result.notification?.message || "En la respuesta del servidor.",
        );
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      toast.success(
        result.notification?.message || "Formulario enviado con éxito.",
        {
          onClose: () =>
            router.push(result.redirectUrl || "/registration/individual/final"),
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
        className="background_individual_view2 flex-1 flex flex-col items-center gap-4 px-4 pt-6 overflow-y-auto"
      >
        <Header />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/text_registro_individual.svg"
          alt="Formulario de Registro"
          className="w-72 h-auto"
        />

        <YesNoQuestion
          name="has_participated"
          question="¿Has participado antes en alguna versión de la Omega?"
          value={hasParticipated}
          onChange={setHasParticipated}
        />

        <TextQuestion
          name="semester"
          question="¿En qué semestre estás?"
          value={semestre}
          onChange={setSemestre}
          placeholder="Número de semestre"
        />

        <TextQuestion
          name="phone"
          question="Número celular"
          value={telefono}
          onChange={setTelefono}
          placeholder="Número"
        />

        <TextQuestion
          name="how_did_hear"
          question="¿Cómo nos conociste?"
          value={conociste}
          onChange={setConociste}
          placeholder="Redes, amigos, etc."
        />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/text_evento_a_cabo.svg"
          alt="Información del evento"
          className="w-72 h-auto"
        />

        <YesNoQuestion
          name="has_time"
          question="¿Estás disponible para asistir al evento?"
          value={disponible}
          onChange={setDisponible}
        />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/pacho_hermes.svg"
          alt="Pacho hermes"
          className="w-54 h-auto"
        />

        <button type="submit">
          <img
            src="https://novaeafit.blob.core.windows.net/omega-2025/button_send.svg"
            alt="Botón enviar"
            className="w-40 h-auto cursor-pointer mb-6"
          />
        </button>

        <Footer />
      </form>
    </div>
  );
}
