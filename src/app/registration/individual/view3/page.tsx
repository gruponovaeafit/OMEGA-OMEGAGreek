"use client";
import React, { useState } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

import {
  Select,
  YesNoQuestion,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";



export default function Home() {
  const [hasParticipated, setHasParticipated] = useState<boolean | null>(null);
  const [telefono, setTelefono] = useState("");
  const [conociste, setConociste] = useState("");
  const [semestre, setSemestre] = useState("");
  const [disponible, setDisponible] = useState<boolean | null>(null);

     // Verifing cookies
     const router = useRouter();
  
     useEffect(() => {
       const checkAuthentication = async () => { 

         try {
           const res = await fetch("/api/cookiesChecker", { method: "GET" });

             if (res.status !== 200) {
               router.push("/"); 
             }
           } catch (error) {
             console.error("Error checking authentication:", error);
             router.push("/"); 
           }
       }

       checkAuthentication();
       document.body.classList.add("no-scroll");
       return () => {
         document.body.classList.remove("no-scroll");
       };
     }, []);

     const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       const formElement = e.currentTarget;
       const formData = new FormData(formElement);
       const formObject = Object.fromEntries(formData.entries());

       try {
         const response = await fetch("/api/forms/userRolesForm", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(formObject),
         });

         const result = await response.json();
         
        if(result.incompleteFields){
            setConociste(result.incompleteFields.how_did_hear || "");
            setTelefono(result.incompleteFields.phone || "");
            setSemestre(result.incompleteFields.semester || "");
            setHasParticipated(result.incompleteFields.previous_participation || null);
            setDisponible(result.incompleteFields.has_time || null);
        }

         if (!response.ok) {
           console.error("Error:", result.notification?.message || "En la respuesta del servidor.");
           toast.error(result.notification?.message || "Error en el servidor.", {
             position: "top-center",
             autoClose: 3000,
             hideProgressBar: false,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
           });
           return;
         }

        toast.success(result.notification?.message || "Formulario enviado con éxito.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => router.push(result.redirectUrl || "/registration/individual/view2"),
        });

       } catch (error) {
         console.error("Error al enviar el formulario:", error);
         toast.error("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.", {
           position: "top-center",
           autoClose: 3000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
         });
       }
     };


  return (
    <div className="h-screen flex flex-col">
      <form onSubmit={handleFormSubmit} className="background_individual_view2 flex-1 flex flex-col items-center gap-4 px-4 pt-6 overflow-y-auto">
        <Header />

        <img 
          src="/text_registro_individual.svg" 
          alt="Formulario de Registro"
          className="w-72 h-auto"
        />

        <YesNoQuestion
          name="has_participated"
          question="¿Haz participado antes en alguna versión de la Omega?"
          value={hasParticipated}
          onChange={setHasParticipated}
        />

        <TextQuestion
          name="semester"
          question="¿En qué semestre estás?"
          value={semestre}
          onChange={setSemestre}
          placeholder="numero de semestre"
        />

        <TextQuestion
          name="phone"
          question="Número celular"
          value={telefono}
          onChange={setTelefono}
          placeholder="Número"
        />

        <TextQuestion
          name="how_did_hear"
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
          name="has_time"
          question="¿Estás disponible para asistir al evento?"
          value={disponible}
          onChange={setDisponible}
        />

          <img
            src="/pacho_hermes.svg"
            alt="Pacho hermes"
            className="w-54 h-auto"
          />

        <button type="submit" >
          <img
            src="/button_send.svg"
            alt="Botón enviar"
            className="w-40 h-auto cursor-pointer mb-6"
          />
        </button>

        <Footer />
      </form>
      <ToastContainer/>
    </div>
  );
}
