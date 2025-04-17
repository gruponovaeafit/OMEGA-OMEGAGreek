"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { TextButton } from "@/app/components/forms/confirmation/individual/text";
import { TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import FormHeader from "@/app/components/UI/FormHeader";
import FormStaticAlert from "@/app/components/UI/FormStaticAlert";
import { Button } from "@/app/components/UI/Button";

export default function Confirmation2() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [defaultTeamName, setDefaultTeamName] = useState("");

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) router.push("/");
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        router.push("/");
      }
    };

    checkAuthentication();
    const interval = setInterval(checkAuthentication, 15000);
    return () => clearInterval(interval);
  }, [router]);

  // Obtener nombre actual del equipo al cargar
  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const res = await fetch("/api/forms/teamNameConfirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team_name: "" }), // Solo para obtener
        });
        const data = await res.json();

        if (res.ok && data.teamName) {
          setTeamName(data.teamName); // Valor editable por usuario
          setDefaultTeamName(data.teamName); // Valor como placeholder
        }
      } catch (error) {
        console.error("Error al obtener el nombre del equipo:", error);
      }
    };

    fetchTeamName();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formObject = { team_name: teamName };

    try {
      const response = await fetch("/api/forms/teamNameConfirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      toast.success(
        result.notification?.message || "Formulario enviado con éxito.",
        {
          onClose: () => router.push(result.redirectUrl),
        },
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Hubo un error al enviar el formulario.");
    }
  };

  return (
    <>
      <form
        className="background_email min-h-screen flex flex-col items-center py-4"
        onSubmit={handleFormSubmit}
      >
        <Header />
        
        {/* Reemplazo del banner con FormHeader */}
        <div className="w-full max-w-[320px] mb-6">
          <FormHeader title={
            <>
              Confirmación<br />
              grupal
            </>
          } />
        </div>
        
        {/* Reemplazo del recordatorio con FormStaticAlert */}
        <div className="w-full max-w-[320px] mt-2 mb-6">
          <FormStaticAlert iconName="hammer">
            <p className="text-center">
              Recuerda que cada integrante del grupo deberá responder el formulario de confirmación individual (incluyendo el lider)
            </p>
          </FormStaticAlert>
        </div>
        
        <TextButton text="Nombre del equipo" />
        <TextQuestion
          name="team_name"
          question=""
          type="string"
          value={teamName}
          onChange={setTeamName}
          placeholder={defaultTeamName || "Ingrese nombre de equipo"}
        />
        
        <div className="flex justify-center items-center max-w-xs gap-4 mt-4">
          {/* Dionisio como imagen */}
          <img 
            src="/Dionisio.svg" 
            alt="Dionisio" 
            className="w-72 h-72 ml-[-40px] mt-3" 
          />
          
          <Button 
            label="Siguiente" 
            type="submit" 
            variant="primary" 
            iconName="chevron-right"
            className="ml-[-52px]"  
          />
        </div>
        <Footer />
      </form>
      <ToastContainer />
    </>
  );
}