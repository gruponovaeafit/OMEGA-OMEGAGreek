"use client";
import React, { useState, useEffect } from "react";
import EmailInput from "@/app/components/emails/text_field";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/UI/Button";

// Añadir propiedad a Window para evitar errores TS
declare global {
  interface Window {
    grecaptcha: any;
  }
}

const Loading: React.FC = () => {
  const [email, setEmail] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const router = useRouter();

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Cargar reCAPTCHA Enterprise
  useEffect(() => {
    const scriptId = "recaptcha-enterprise";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => setRecaptchaReady(true);
    document.body.appendChild(script);
  }, [siteKey]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recaptchaReady || !window.grecaptcha) {
      toast.error("reCAPTCHA aún no está listo. Intenta de nuevo.");
      return;
    }

    try {
      const token = await window.grecaptcha.enterprise.execute(siteKey, {
        action: "LOGIN",
      });

      if (!token) {
        toast.error("No se pudo obtener el token de reCAPTCHA.");
        return;
      }

      const response = await fetch("/api/forms/userEmailConfirmationForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institutional_email: email,
          recaptchaToken: token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      toast.success(
        result.notification?.message || "Formulario enviado con éxito.",
        {
          onClose: () => {
            if (result.redirectUrl) {
              router.push(result.redirectUrl);
            }
          },
        },
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="background_email flex flex-col items-center justify-center gap-6 px-4 min-h-screen"
      >
        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/logo_email_view.svg"
          alt="Logo OMEGA y Correo Electrónico"
          className="w-64 h-auto"
        />

        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />

        <Button type="submit" label="Siguiente" />
      </form>
    </div>
  );
};

export default Loading;
