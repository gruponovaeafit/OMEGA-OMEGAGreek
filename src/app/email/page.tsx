"use client";
import React, { useState } from "react";
import EmailInput from "@/app/components/emails/text_field";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Loading: React.FC = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const response = await fetch("api/forms/userEmailForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      toast.success(result.notification?.message || "Formulario enviado con éxito.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          if (result.redirectUrl) {
            router.push(result.redirectUrl);
          }
        },
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="background_email flex flex-col items-center justify-center gap-6 px-4 min-h-screen"
      >
        <img
          src="/logo_email_view.svg"
          alt="Logo OMEGA y Correo Electrónico"
          className="w-64 h-auto"
        />

        <EmailInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          <img
            src="/button_siguiente.svg"
            alt="Botón de siguiente"
            className="h-auto cursor-pointer self-end mr-4"
          />
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Loading;
