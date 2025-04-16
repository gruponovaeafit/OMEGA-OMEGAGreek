"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { TextButton } from "@/app/components/forms/confirmation/individual/text";
import { TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import router from "next/router";


export default function Confirmation2() {

    const [teamName, setTeamName] = useState("");

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formObject = {
          teamName: teamName,
        };
    
        try {
          const response = await fetch("/api/forms/teamNameConfirmation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
          });
    
          const result = await response.json();
    
          if (result.teamName) {
            setTeamName(result.teamName || "");
          }
    
          if (!response.ok) {
            toast.error(result.notification?.message || "Error en el servidor.");
            return;
          }
    
          toast.success(
            result.notification?.message || "Formulario enviado con éxito.",
            {
              onClose: () =>
                router.push(result.redirectUrl || "/confirmation/view2"),
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
    <form className="background_email min-h-screen flex flex-col items-center py-4" onSubmit={handleFormSubmit}>
            <Header />
            <img
                src="/BannerGroup.svg"
                alt="Banner_Group"
            />
            <img
                src="/Reminder.svg"
                alt="reminder"
            />
            <TextButton text="Nombre del equipo"/>
            <TextQuestion name="Nombre de equipo" question="" type="string" value={teamName} onChange={setTeamName} placeholder="Ingrese nombre de equipo"/>
            <div className="flex justify-center items-center">
                <img
                src="/Dionisio.svg"
                alt="Dionisio"
                className="w-50 h-50"
                />
                <button type="submit">
                    <img
                    src="/Siguiente.svg"
                    alt="Siguiente"

                    />
                </button>
            </div>
            <Footer />
    </form>
    <ToastContainer/>
    </>
    )

}