"use client";
import React, { useState } from "react";
import { Footer, Header } from '@/app/layout';
import {
  Select,
  YesNoQuestion,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";

const handleSiguiente = () => {
  window.location.href = '/registration/individual/final';
};

export default function Home() {
  const [hasParticipated, setHasParticipated] = useState<boolean | null>(null);
  const [telefono, setTelefono] = useState("");
  const [conociste, setConociste] = useState("");
  const [disponible, setDisponible] = useState<boolean | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-4 px-4 pt-6 overflow-y-auto">
        <Header />

        <img 
          src="/text_registro_individual.svg" 
          alt="Formulario de Registro"
          className="w-72 h-auto"
        />

        <YesNoQuestion
          question="¿Haz participado antes en alguna versión de la Omega?"
          value={hasParticipated}
          onChange={setHasParticipated}
        />

        <TextQuestion
          question="Número celular"
          value={telefono}
          onChange={setTelefono}
          placeholder="3024567890"
        />

        <TextQuestion
          question="¿Cómo nos conociste?"
          value={conociste}
          onChange={setConociste}
          placeholder="Redes, amigos, etc."
        />

        <img 
          src="/text_evento_a_cabo.svg" 
          alt="Información del evento"
          className="w-72 h-auto"
        />

        <YesNoQuestion
          question="¿Estás disponible para asistir al evento?"
          value={disponible}
          onChange={setDisponible}
        />

          <img
            src="/pacho_hermes.svg"
            alt="Pacho Zeus"
            className="w-54 h-auto"
          />

        <img
          src="/button_send.svg"
          alt="Botón siguiente"
          className="w-40 h-auto cursor-pointer mb-6"
          onClick={handleSiguiente}
        />
        
        <Footer />
      </div>
    </div>
  );
}
