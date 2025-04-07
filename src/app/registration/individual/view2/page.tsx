"use client";
import React, { useState } from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

import {
  Select,
} from "@/app/components/forms/registration/individual/questions";
import { toast, ToastContainer } from "react-toastify";



export default function Home() {
  const [preferred_role1, setPreferred_role1] = useState("Rol 1");
  const [preferred_role2, setPreferred_role2] = useState("Rol 2");

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
      <form onSubmit={handleFormSubmit} className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
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
            name="preferred_role1"
            value={preferred_role1}
            onChange={setPreferred_role1}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
        </div>

        <div className="w-80 mb-6">
          <h3 className="text-white font-bold text-sm mb-2 text-center">Rol preferido 2</h3>
          <Select
            name="preferred_role2"
            value={preferred_role2}
            onChange={setPreferred_role2}
            options={["Administrador", "Diseñador", "Marketing", "Desarrollador"]}
          />
        </div>

        <button type="submit">
          <img
            src="/button_siguiente.svg"
            alt="Botón siguiente"
            className="w-32 h-auto cursor-pointer"
          />
        </button>

        <Footer />
      </form>
      <ToastContainer/>
    </div>
  );
}
