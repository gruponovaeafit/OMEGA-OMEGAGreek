"use client"

import { Footer } from "@/app/components/Footer";
import { YesNoQuestion } from "@/app/components/forms/registration/individual/questions";
import { Header } from "@/app/components/Header";
import FormHeader from "@/app/components/UI/FormHeader";
import FormStaticAlert from "@/app/components/UI/FormStaticAlert";
import { useState } from "react";

export default function View1() {
  const [dateAvailability, setDateAvailability] = useState<boolean | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen flex flex-col">
      <form
        onSubmit={handleFormSubmit}
        className="background_individual_view2 flex-1 flex flex-col items-center gap-2"
      >
        <Header />

        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/text_enviado_exitoso.png"
          alt="Confirmación de formulario enviado"
          className="w-52 h-auto"
        />

        <img
          src="/Poseidon.svg"
          alt="Confirmación de formulario enviado"
          className="mt-5 w-max-70 h-auto"
        />
        <Footer />
      </form>
    </div>
  );
}
