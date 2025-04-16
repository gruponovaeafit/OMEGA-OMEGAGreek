"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { TextButton } from "@/app/components/forms/confirmation/individual/text";
import { TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Confirmation2() {

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

      const checkUserStatus = async () => {
        try {
          const res = await fetch("/api/forms/userCheckStatus", { method: "GET" });
          const result = await res.json();

          if (res.ok && result.redirectUrl) {
            router.push(result.redirectUrl);
            return false;
          }

          return true;
        } catch (error) {
          console.error("Error al verificar estado del usuario:", error);
          return true;
        }
      };

      const checkTeamStatus = async () => {
        try {
          const res = await fetch("/api/forms/teamCheckStatus", { method: "GET" });
          const result = await res.json(); // ✅ siempre lee el body

          if (res.status === 400 && result.notification?.message) {
            toast.error(result.notification.message); // ✅ show toast
            return false;
          }

          if (res.ok && result.redirectUrl) {
            router.push(result.redirectUrl);
            return false;
          }

          return true;
        } catch (error) {
          console.error("Error al verificar estado del equipo:", error);
          toast.error("Error inesperado al verificar estado del equipo.");
          return false;
        }
      };

    const [teamName, setTeamName] = useState("");
    return (
        <div className="background_email min-h-screen flex flex-col items-center py-4">
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
            <img
            src="/Siguiente.svg"
            alt="Siguiente"
            onClick={() =>
                (window.location.href =
                "/confirmation/teams/view2")
            }
            />
        </div>
        <Footer />

    </div>

    )

}