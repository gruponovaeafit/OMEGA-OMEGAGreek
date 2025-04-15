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
  const [leaderRol, setLeaderRol] = useState("Selecciones Rol Lider");

  const [email1, setEmail1] = useState("");
  const [rol1, setRol1] = useState("Selecciones Rol 1"); 

  const [email2, setEmail2] = useState("");
  const [rol2, setRol2] = useState("Selecciones Rol 2"); 

  const [email3, setEmail3] = useState("");
  const [rol3, setRol3] = useState("Selecciones Rol 3"); 

  const [email4, setEmail4] = useState("");
  const [rol4, setRol4] = useState("Selecciones Rol 4"); 

  const [email5, setEmail5] = useState("");
  const [rol5, setRol5] = useState("Selecciones Rol 5"); 

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
        <Header />
        <img 
          src="/text_confirmacion_grupal.svg" 
          alt="Formulario de Confirmacion grupal"
          className="w-72 h-auto"
        />
        <TextQuestion //email del lider
          question="Correo electronico del líder (Obligatorio)"
          value={leaderEmail}
          onChange={setLeaderEmail}
          placeholder="lider@institucion.edu.co"
        />
        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol Lider</h3>
             <Select
           value={leaderRol}
            onChange={setLeaderRol}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
         </div>
         
         <TextQuestion //email 1
          question="Correo electronico del participante 1"
          value={email1}
          onChange={setEmail1}
          placeholder="Participante1@institucion.edu.co"
        />
        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol participante 1</h3>
             <Select
           value={rol1}
            onChange={setRol1}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
         </div>

         <TextQuestion //email 2
          question="Correo electronico del participante 2"
          value={email2}
          onChange={setEmail2}
          placeholder="participante2@institucion.edu.co"
        />
        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol participante 2</h3>
             <Select
           value={rol2}
            onChange={setRol2}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
         </div>

         <TextQuestion //email 3
          question="Correo electronico del participante 3"
          value={email3}
          onChange={setEmail3}
          placeholder="participante3@institucion.edu.co"
        />
        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol participante 3</h3>
             <Select
           value={rol3}
            onChange={setRol3}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
         </div>

         <TextQuestion //email 4
          question="Correo electronico del participante 4"
          value={email4}
          onChange={setEmail4}
          placeholder="participante4@institucion.edu.co"
        />
        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol participante 4</h3>
             <Select
           value={rol4}
            onChange={setRol4}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
         </div>

         <TextQuestion //email 5
          question="Correo electronico del participante 5"
          value={email5}
          onChange={setEmail5}
          placeholder="participante5@institucion.edu.co"
        />
        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol participante 5</h3>
             <Select
           value={rol5}
            onChange={setRol5}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
         </div>
        
        <div className="flex items-center justify-center gap-4 mt-10 mb-8">
          <img //bottom pacho artemisa and send.
            src="/personajes_teams.svg"
            alt="Personajes Teams"
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
