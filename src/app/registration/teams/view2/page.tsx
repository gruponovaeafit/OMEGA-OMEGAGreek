"use client";
import React, { useState, useEffect } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");
  const [person3, setPerson3] = useState("");
  const [person4, setPerson4] = useState("");
  const [person5, setPerson5] = useState("");

  const router = useRouter();

  // Cargar miembros existentes del equipo
  const fetchTeamData = async () => {
    try {
      const res = await fetch("/api/forms/teamData", { method: "GET" });
      const data = await res.json();

      if (res.ok) {
        const members = data.members || [];

        // Asignar correos por orden
        if (members[0]) setPerson1(members[1]);
        if (members[1]) setPerson2(members[2]);
        if (members[2]) setPerson3(members[3]);
        if (members[3]) setPerson4(members[4]);
        if (members[4]) setPerson5(members[5]);
      } else {
        toast.error("Error al obtener los miembros del equipo.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del equipo:", error);
      toast.error("Error al obtener los datos del equipo.");
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleSubmit = async () => {
    const emails = [person1, person2, person3, person4, person5].filter(Boolean);

    try {
      const res = await fetch("/api/forms/teamData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al guardar miembros.");
        return;
      }

      toast.success(data.message || "Miembros registrados correctamente");

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }
      
    } catch (error) {
      console.error("Error al guardar los miembros:", error);
      toast.error("Error en el servidor.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <Header />

        <img
          src="/text_registro_grupal.svg"
          alt="Formulario de Registro grupal"
          className="w-72 h-auto"
        />

        <TextQuestion
          name="person1"
          question="Correo participante 1"
          value={person1}
          onChange={setPerson1}
          placeholder="participante1@institucion.edu.co"
        />

        <TextQuestion
          name="person2"
          question="Correo participante 2"
          value={person2}
          onChange={setPerson2}
          placeholder="participante2@institucion.edu.co"
        />
        <TextQuestion
          name="person3"
          question="Correo participante 3"
          value={person3}
          onChange={setPerson3}
          placeholder="participante3@institucion.edu.co"
        />
        <TextQuestion
          name="person4"
          question="Correo participante 4"
          value={person4}
          onChange={setPerson4}
          placeholder="participante4@institucion.edu.co"
        />
        <TextQuestion
          name="person5"
          question="Correo participante 5"
          value={person5}
          onChange={setPerson5}
          placeholder="participante5@institucion.edu.co"
        />

        <img
          src="/button_siguiente.svg"
          alt="Botón siguiente"
          className="w-32 h-auto cursor-pointer"
          onClick={handleSubmit}
        />

        <img
          src="/pacho_dioniso.svg"
          alt="Pacho dioniso"
          className="w-48 h-auto"
        />

        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}
