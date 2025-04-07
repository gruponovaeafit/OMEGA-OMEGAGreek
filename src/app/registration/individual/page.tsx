"use client";
import React, { useState, useEffect } from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import {
  TextQuestion,
  Select,
  Checkbox,
  DateNativeQuestion,
} from "@/app/components/forms/registration/individual/questions";

export default function Home() {
  const router = useRouter();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("C.C");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Verificación continua de cookies
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) {
          console.warn("⛔ Cookie inválida o expirada. Redireccionando...");
          router.push("/");
        }
      } catch (error) {
        console.error("Error verificando cookie:", error);
        router.push("/");
      }
    };

    // Verificación inicial
    checkAuthentication();

    // Verificación continua cada 15 segundos
    const interval = setInterval(() => {
      checkAuthentication();
    }, 15000); // 15.000 ms = 15 segundos

    document.body.classList.add("no-scroll");

    return () => {
      clearInterval(interval);
      document.body.classList.remove("no-scroll");
    };
  }, [router]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formObject = {
      name: nombre,
      surname: apellido,
      id_type: tipoDocumento,
      id_number: numeroDocumento,
      birth_date: fechaNacimiento,
      data_treatment: aceptaTerminos ? 1 : 0,
    };

    try {
      const response = await fetch("/api/forms/userRegistrationForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();

      if (result.incompleteFields) {
        setNombre(result.incompleteFields.name || "");
        setApellido(result.incompleteFields.surname || "");
        setNumeroDocumento(result.incompleteFields.id_number || "");
        setFechaNacimiento(result.incompleteFields.birth_date || "");
        setAceptaTerminos(result.incompleteFields.data_treatment ?? false);
      }

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
        className="background_individual_view1 flex-1 flex flex-col items-center px-6 pt-6"
      >
        <Header />

        <img
          src="https://novaeafit.blob.core.windows.net/omega-2025/text_registro_individual.svg"
          alt="Formulario de Registro"
          className="w-72 h-auto mb-4"
        />

        <TextQuestion
          name="name"
          question="Nombre"
          value={nombre}
          onChange={setNombre}
          placeholder="Nombre"
        />

        <TextQuestion
          name="surname"
          question="Apellido"
          value={apellido}
          onChange={setApellido}
          placeholder="Apellido"
        />

        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">
            Tipo de documento
          </h3>
          <Select
            name="id_type"
            value={tipoDocumento}
            onChange={setTipoDocumento}
            options={["C.C", "T.I", "Pasaporte"]}
          />
        </div>

        <TextQuestion
          name="id_number"
          question="Número de documento"
          value={numeroDocumento}
          onChange={setNumeroDocumento}
          placeholder="ID"
        />

        <DateNativeQuestion
          question="Fecha de nacimiento"
          value={fechaNacimiento}
          onChange={setFechaNacimiento}
        />

        <div className="w-full flex justify-center mb-4">
          <div className="max-w-xs w-full">
            <Checkbox
              name="data_treatment"
              checked={aceptaTerminos}
              onChange={setAceptaTerminos}
              label={
                <>
                  He leído y acepto la{" "}
                  <a
                    href="https://www.eafit.edu.co/datospersonales"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-300 hover:text-blue-100 transition"
                  >
                    Política de tratamiento de datos de EAFIT
                  </a>
                </>
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10 mb-8">
          <img
            src="https://novaeafit.blob.core.windows.net/omega-2025/pacho_zeus.svg"
            alt="Pacho Zeus"
            className="w-44 h-auto"
          />
          <button type="submit">
            <img
              src="https://novaeafit.blob.core.windows.net/omega-2025/button_siguiente.svg"
              alt="Botón siguiente"
              className="w-32 h-auto cursor-pointer"
            />
          </button>
        </div>

        <Footer />
      </form>
    </div>
  );
}
