"use client";
import React, { useState } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';

import {
  Select,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";

const handleSiguiente = () => {
  window.location.href = '/registration/teams/final';
};

export default function Home() {
  const [leaderEmail, setLeaderEmail] = useState("");
  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");
  const [person3, setPerson3] = useState("");
  const [person4, setPerson4] = useState("");
  const [person5, setPerson5] = useState("");
  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
        <Header />
        <img 
          src="/text_registro_grupal.svg" 
          alt="Formulario de Registro grupal"
          className="w-72 h-auto"
        />
        <TextQuestion //email del lider
          question="Correo electronico del líder (Obligatorio)"
          value={leaderEmail}
          onChange={setLeaderEmail}
          placeholder="lider@institucion.edu.co"
        />
        <TextQuestion //email del primer integrante
          question="Correo participante 1"
          value={person1}
          onChange={setPerson1}
          placeholder="participante1@institucion.edu.co"
        />
        <TextQuestion //email del segundo integrante
          question="Correo participante 2"
          value={person2}
          onChange={setPerson2}
          placeholder="participante2@institucion.edu.co"
        />
        <TextQuestion //email del tercer integrante
          question="Correo participante 3"
          value={person3}
          onChange={setPerson3}
          placeholder="participante3@institucion.edu.co"
        />
        <TextQuestion //email del cuarto integrante
          question="Correo participante 4"
          value={person4}
          onChange={setPerson4}
          placeholder="participante4@institucion.edu.co"
        />
        <TextQuestion //email del quinto integrante
          question="Correo participante 5"
          value={person5}
          onChange={setPerson5}
          placeholder="participante5@institucion.edu.co"
        />    
        
        <div className="flex items-center justify-center gap-4 mt-10 mb-8">
          <img //bottom pacho artemisa and send.
            src="/pacho_artemisa.svg"
            alt="Pacho artemisa"
            className="w-44 h-auto"
          />
          <img
          src="/button_send.svg"
          alt="Botón enviar"
          className="w-40 h-auto cursor-pointer mb-6"
          onClick={handleSiguiente}
        />
        </div>
        <Footer />
      </div>
    </div>
  );
}
