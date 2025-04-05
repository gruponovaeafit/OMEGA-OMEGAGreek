"use client";
import React, { useState } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';

import {
  Select,
} from "@/app/components/forms/registration/individual/questions";

const handleSiguiente = () => {
  window.location.href = '/registration/individual/view3';
};

export default function Home() {
  const [preferred_role1, setPreferred_role1] = useState("Rol 1");
  const [preferred_role2, setPreferred_role2] = useState("Rol 2");

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
        <Header />

        <img 
          src="/text_registro_individual.svg" 
          alt="Formulario de Registro"
          className="w-72 h-auto"
        />

        <img 
          src="/button_admin.svg" 
          alt="Registro individual"
          className="w-72 h-auto"
        />
        <img 
          src="/button_designer.svg" 
          alt="Registro individual"
          className="w-72 h-auto"
        />
        <img 
          src="/button_marketing.svg" 
          alt="Registro individual"
          className="w-72 h-auto"
        />
        <img 
          src="/button_developer.svg" 
          alt="Registro individual"
          className="w-72 h-auto"
        />

        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol preferido 1</h3>
          <Select
            value={preferred_role1}
            onChange={setPreferred_role1}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
        </div>

        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol preferido 2</h3>
          <Select
            value={preferred_role2}
            onChange={setPreferred_role2}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
        </div>

        <img
          src="/button_siguiente.svg"
          alt="Botón siguiente"
          className="w-32 h-auto cursor-pointer"
          onClick={handleSiguiente}
        />
        
        <Footer />
      </div>
    </div>
  );
}
