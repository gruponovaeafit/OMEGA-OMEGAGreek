"use client";
import React, { useState } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';

import {
  Select,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";

const handleSiguiente = () => {
  window.location.href = '/registration/teams/view1';
};

export default function Home() {
  const [teamName, setTeamName] = useState("");

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
        <Header />
        <img 
          src="/text_registro_grupal.svg" 
          alt="Formulario de Registro grupal"
          className="w-72 h-auto"
        />
        <TextQuestion //nombre del equpo
          question="Nombre del equipo"
          value={teamName}
          onChange={setTeamName}
          placeholder="Inserte nombre"
        />
        <div className="flex items-center justify-center gap-4 mt-10 mb-8">
          <img
            src="/pacho_dioniso.svg"
            alt="Pacho dioniso"
            className="w-50 h-auto"
          />
          <img
            src="/button_siguiente.svg"
            alt="Botón siguiente"
            className="w-32 h-auto cursor-pointer"
            onClick={handleSiguiente}
          />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}