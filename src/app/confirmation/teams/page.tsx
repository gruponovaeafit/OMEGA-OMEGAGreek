"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { TextButton } from "@/app/components/forms/confirmation/individual/text";
import { TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function Confirmation2() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [defaultTeamName, setDefaultTeamName] = useState("");

  // Verificación continua del JWT
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
        <img src="/BannerGroup.svg" alt="Banner_Group" />
        <img src="/Reminder.svg" alt="reminder" />
        <TextButton text="Nombre del equipo" />
        <TextQuestion
          name="team_name"
          question=""
          type="string"
          value={teamName}
          onChange={setTeamName}
          placeholder={defaultTeamName || "Ingrese nombre de equipo"}
        />
        <div className="flex justify-center items-center max-w-xs ">
          <img src="/Dionisio.svg" alt="Dionisio" className="w-40 h-40" />
          <button type="submit">
            <img src="/Siguiente.svg" alt="Siguiente" />
          </button>
        </div>
        <Footer />
      </form>
      <ToastContainer />
    </>
  );
}
