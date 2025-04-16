"use client"

import { Footer } from "@/app/components/Footer";
import { YesNoQuestion } from "@/app/components/forms/registration/individual/questions";
import { Header } from "@/app/components/Header";
import FormHeader from "@/app/components/UI/FormHeader";
import { useState } from "react";

export default function View2() {
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

        <div className="w-full max-w-[320px] mb-6">
          <FormHeader
            title="Formulario de confirmación"
          />
        </div>

        <YesNoQuestion
          name="date_availability"
          question="¿Estás disponible para asistir al evento?"
          value={dateAvailability}
          onChange={setDateAvailability}
        />

        <div className="flex flex-wrap justify-center items-center gap-4 px-4">
          <img
            src="/Afrodita.svg"
            alt="Afrodita"
            className="w-48 h-48"
          />
        </div>

        <Footer />
      </form>
    </div>
  );
}
