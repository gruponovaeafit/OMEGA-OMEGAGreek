"use client";
import React, { useState } from "react";
import { Footer, Header } from "@/app/layout";
import {
  TextQuestion,
  Select,
  Checkbox,
  DateNativeQuestion
} from "@/app/components/forms/registration/individual/questions";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("C.C");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleSiguiente = () => {
    window.location.href = '/registration/individual/view2';
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view1 flex-1 flex flex-col items-center px-6 pt-6">
        <Header />

        <img
          src="/text_registro_individual.svg"
          alt="Formulario de Registro"
          className="w-72 h-auto mb-4"
        />

        <TextQuestion
          question="Nombre"
          value={nombre}
          onChange={setNombre}
          placeholder="Nombre"
        />

        <TextQuestion
          question="Apellido"
          value={apellido}
          onChange={setApellido}
          placeholder="Apellido"
        />

        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Tipo de documento</h3>
          <Select
            value={tipoDocumento}
            onChange={setTipoDocumento}
            options={["C.C", "T.I", "Pasaporte"]}
          />
        </div>

        <TextQuestion
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
          <Checkbox
            checked={aceptaTerminos}
            onChange={setAceptaTerminos}
            label="He leído y acepto los TyC"
          />
        </div>


        <div className="flex items-center justify-center gap-4 mt-10 mb-8">
          <img
            src="/pacho_zeus.svg"
            alt="Pacho Zeus"
            className="w-44 h-auto"
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