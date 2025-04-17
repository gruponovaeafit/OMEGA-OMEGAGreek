"use client";
import React, { useState, useEffect } from "react";
import EmailInput from "@/app/components/emails/text_field";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

// Añadir propiedad a Window para evitar errores TS
declare global {
  interface Window {
    grecaptcha: any;
  }
}

// Determinar si estamos en desarrollo
const isDevelopment = process.env.NODE_ENV === "development";

const Loading: React.FC = () => {
  const [email, setEmail] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const router = useRouter();

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Solo cargar reCAPTCHA si no estamos en desarrollo
  useEffect(() => {
    if (isDevelopment) {
      console.log("Modo desarrollo: reCAPTCHA desactivado");
      return;
    }

    const scriptId = "recaptcha-enterprise";
    if (document.getElementById(scriptId)) {
      if (window.grecaptcha && window.grecaptcha.enterprise) {
        setRecaptchaReady(true);
      }
      return;
    }

    if (!siteKey) {
      console.warn("reCAPTCHA siteKey no disponible.");
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("reCAPTCHA script cargado");
      setRecaptchaReady(true);
    };
    script.onerror = () => {
      console.error("Error al cargar el script de reCAPTCHA");
    };
    document.head.appendChild(script);
  }, [siteKey]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica del email
    if (!email || !email.includes("@")) {
      toast.error("Por favor, ingresa un email válido");
      return;
    }

    // En desarrollo, omitir reCAPTCHA por completo
    if (isDevelopment) {
      try {
        const response = await fetch("/api/forms/userEmailConfirmationForm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            institutional_email: email,
            recaptchaToken: "development_token",
            // Indicador especial para desarrollo
            _devMode: true
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          // Si el API rechaza el token de desarrollo, mostramos un mensaje pero continuamos
          console.warn("API rechazó el token de desarrollo, pero continuamos en modo desarrollo");
          
          // Simular respuesta exitosa para desarrollo
          toast.success("Modo desarrollo: Simulando envío exitoso", {
            onClose: () => {
              // Redirección temporal para desarrollo - ajustar según sea necesario
              router.push("/confirmation/individual");
            },
          });
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
          }
        );
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        toast.error("Hubo un error. Intenta nuevamente.");
      }
      return;
    }

    // Código para producción con reCAPTCHA
    if (!recaptchaReady || !window.grecaptcha || !window.grecaptcha.enterprise) {
      toast.error("reCAPTCHA no está disponible. Por favor, intenta más tarde.");
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
        }
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error. Intenta nuevamente.");
    }
  };

  return (
    <div>
      {isDevelopment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffcc00',
          color: '#333',
          padding: '4px 8px',
          fontSize: '12px',
          textAlign: 'center',
          zIndex: 9999
        }}>
          Modo Desarrollo: reCAPTCHA desactivado
        </div>
      )}
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

        <button type="submit">
          <img
            src="https://novaeafit2.blob.core.windows.net/omega-2025/button_siguiente.svg"
            alt="Botón de siguiente"
            className="h-auto cursor-pointer self-end mr-4"
          />
        </button>
      </form>
    </div>
  );
};

export default Loading;