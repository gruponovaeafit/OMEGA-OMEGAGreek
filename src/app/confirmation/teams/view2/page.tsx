"use client";

import React, { useState } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { Button } from '@/app/components/UI/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Select,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";

const handleSiguiente = () => {
  window.location.href = '/confirmation/teams/send';
};

export default function Home() {

  const router = useRouter();

    // Verificación continua del JWT
    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          const res = await fetch("/api/cookiesChecker", { method: "GET" });
          if (res.status !== 200) {
            router.push("/");
          }
        } catch (error) {
          console.error("Error verificando autenticación:", error);
          router.push("/");
        }
      };

      checkAuthentication();
      const interval = setInterval(checkAuthentication, 15000);
      return () => clearInterval(interval);
    }, [router]);

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

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
        <Header />
        <img 
          src="/text_confirmacion_grupal.svg" 
          alt="Formulario de Confirmacion grupal"
          className="w-72 h-auto"
        />

      <div className="border-y">
        <TextQuestion //email del lider
          question="Correo electronico del líder (Obligatorio)"
          value={leaderEmail}
          onChange={setLeaderEmail}
          placeholder="lider@institucion.edu.co"
          name="leaderEmail"
        />
        <div className="w-80 mb-6">
          <Select
            label="Rol Lider"
            value={leaderRol}
            onChange={setLeaderRol}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="leaderRol"
          />
        </div>
      </div>
        
      <div className="border-b">
        <TextQuestion //email 2
            question="Correo electronico del participante 2"
            value={email2}
            onChange={setEmail2}
            placeholder="Participante2@institucion.edu.co"
            name="email2"
        />
        <div className="w-80 mb-6">
          <Select
            label="Rol Participante 2"
            value={rol2}
            onChange={setRol2}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="rol2"
          />
        </div>
      </div>
        
      <div className="border-b">
        <TextQuestion //email 3
          question="Correo electronico del participante 3"
          value={email3}
          onChange={setEmail3}
          placeholder="participante3@institucion.edu.co"
          name="email3"
        />
        <div className="w-80 mb-6">
          <Select  
            label="Rol Participante 3"
            value={rol3}
            onChange={setRol3}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="rol3"
          />
        </div>
      </div>
         
      <div className="border-b">
        <TextQuestion //email 4
          question="Correo electronico del participante 4"
          value={email4}
          onChange={setEmail4}
          placeholder="participante4@institucion.edu.co"
          name="email4"
        />
        <div className="w-80 mb-6">
          <Select
            label="Rol Participante 4"
            value={rol4}
            onChange={setRol4}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="rol4" 
          />
        </div>
      </div>

      <div className="border-b">
        <TextQuestion //email 5
          question="Correo electronico del participante 5"
          value={email5}
          onChange={setEmail5}
          placeholder="participante5@institucion.edu.co"
          name="email5"
        />
        <div className="w-80 mb-6">
          <Select
            label="Rol Participante 5"
            value={rol5}
            onChange={setRol5}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="rol5"
          />
        </div>
      </div>

      <div className="border-b">
        <TextQuestion //email 6
          question="Correo electronico del participante 6"
          value={email6}
          onChange={setEmail6}
          placeholder="participante6@institucion.edu.co"
          name="email6"
        />
        <div className="w-80 mb-6">
          <Select
            label="Rol Participante 6"
            value={rol6}
            onChange={setRol6}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
            name="rol6"
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
            onClick={handleSiguiente}
            type="submit"
            variant="secondary" 
          />
          </div>
        <Footer />
      </div>
    </div>
  );
}
