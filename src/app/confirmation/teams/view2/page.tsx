"use client";

import React, { useState } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { Button } from '@/app/components/UI/Button';
import { toast, ToastContainer } from "react-toastify";
import router from "next/router";

import {
  Select,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";



export default function Home() {
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderRol, setLeaderRol] = useState("Seleccione Rol Lider");

  const [email2, setEmail2] = useState("");
  const [rol2, setRol2] = useState("Seleccione Rol 2"); 

  const [email3, setEmail3] = useState("");
  const [rol3, setRol3] = useState("Seleccione Rol 3"); 

  const [email4, setEmail4] = useState("");
  const [rol4, setRol4] = useState("Seleccione Rol 4"); 

  const [email5, setEmail5] = useState("");
  const [rol5, setRol5] = useState("Seleccione Rol 5"); 

  const [email6, setEmail6] = useState("");
  const [rol6, setRol6] = useState("Seleccione Rol 6"); 

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formObject = {
      leader_rol: leaderRol,
      member2_email: email2,
      member2_rol: rol2,
      member3_email: email3,
      member3_rol: rol3,
      member4_email: email4,
      member4_rol: rol4,
      member5_email: email5,
      member5_rol: rol5,
      member6_email: email6,
      member6_rol: rol6,
    };

    try {
      const response = await fetch("/api/forms/teamRolesConfirmationForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();

      if (result.existingMembersEmail) {
        setEmail2(result.existingMembersEmail[1] || "");
        setEmail3(result.existingMembersEmail[2] || "");
        setEmail4(result.existingMembersEmail[3] || "");
        setEmail5(result.existingMembersEmail[4] || "");
        setEmail6(result.existingMembersEmail[5] || "");
      }

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      toast.success(
        result.notification?.message || "Formulario enviado con éxito.",
        {
          onClose: () =>
            router.push(result.redirectUrl || "/confirmation/teams/view3"),
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
    <>
    
    <form onSubmit={handleFormSubmit} className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
        <Header />
        <img 
          src="/text_confirmacion_grupal.svg" 
          alt="Formulario de Confirmacion grupal"
          className="w-72 h-auto"
        />

      <div className="border-y">
        <div className="w-80 mb-6">
          <Select
            placeholder="Rol del lider"
            label="Rol Lider"
            value={leaderRol}
            onChange={setLeaderRol}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="leader_rol"
          />
        </div>
      </div>

      <div className="border-b">
        <TextQuestion //email 2
            question="Correo electronico del participante 2"
            value={email2}
            onChange={setEmail2}
            placeholder="Participante2@institucion.edu.co"
            name="member2_email"
        />
        <div className="w-80 mb-6">
          <Select
            placeholder="Rol del participante 2"
            label="Rol Participante 2"
            value={rol2}
            onChange={setRol2}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="member2_rol"
          />
        </div>
      </div>
        
      <div className="border-b">
        <TextQuestion //email 3
          question="Correo electronico del participante 3"
          value={email3}
          onChange={setEmail3}
          placeholder="participante3@institucion.edu.co"
          name="member3_email"
        />
        <div className="w-80 mb-6">
          <Select  
            placeholder="Rol del participante 3"
            label="Rol Participante 3"
            value={rol3}
            onChange={setRol3}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="member3_rol"
          />
        </div>
      </div>
         
      <div className="border-b">
        <TextQuestion //email 4
          question="Correo electronico del participante 4"
          value={email4}
          onChange={setEmail4}
          placeholder="participante4@institucion.edu.co"
          name="member4_email"
        />
        <div className="w-80 mb-6">
          <Select
            placeholder="Rol del participante 4"
            label="Rol Participante 4"
            value={rol4}
            onChange={setRol4}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="member4_rol" 
          />
        </div>
      </div>

      <div className="border-b">
        <TextQuestion //email 5
          question="Correo electronico del participante 5"
          value={email5}
          onChange={setEmail5}
          placeholder="participante5@institucion.edu.co"
          name="member5_email"
        />
        <div className="w-80 mb-6">
          <Select
            placeholder="Rol del participante 5"
            label="Rol Participante 5"
            value={rol5}
            onChange={setRol5}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="member5_rol"
          />
        </div>
      </div>

      <div className="border-b">
        <TextQuestion //email 6
          question="Correo electronico del participante 6"
          value={email6}
          onChange={setEmail6}
          placeholder="participante6@institucion.edu.co"
          name="member6_email"
        />
        <div className="w-80 mb-6">
          <Select
            placeholder="Rol del participante 6"
            label="Rol Participante 6"
            value={rol6}
            onChange={setRol6}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="member6_rol"
          />
        </div>
      </div>
         
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <img //bottom pacho artemisa and send.
              src="/personajes_teams.svg"
              alt="Personajes Teams"
              className="w-70 h-auto"
            />
          <Button
            label="Enviar"
            type="submit"
            variant="secondary" 
          />
          </div>
        <Footer />
      </div>
    </form>
    <ToastContainer/>
    </>
  );
}
