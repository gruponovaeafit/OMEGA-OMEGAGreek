"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { useState } from "react";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";
import FormHeader from "@/app/components/UI/FormHeader";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";


const handleSiguiente = () => {
    window.location.href = '/confirmation/teams/send';
  };

export default function View4() {

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
        const res = await fetch("/api/forms/userCheckStatusConfirmation", { method: "GET" });
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

    const [food, setFood] = useState("Preferencia alimentaria");

    return (
        <div className="background_email min-h-screen flex flex-col items-center py-4">
        <Header />
        <div className="w-full max-w-[320px] mb-6">
          <FormHeader title="Formulario de confirmación" />
        </div>
        <div className="w-80 mb-6">
            <Select
                placeholder="Selecciona tu preferencia alimentaria"
                label="¿Cuál es tu preferencia alimentaria?"
                value={food}
                onChange={setFood}
                options={["Vegetariano/a", "Vegano/a", "Ninguna de las anteriores"]}
                name="leaderFood"
            />
        </div>

        <img
            src="/Confirmation_Individual_Reminder.svg"
            alt="Confirmation_Individual_Reminder"
            className="-mt-8"
        />


        <div className="flex justify-center items-center gap-0 mt-7">
            <img
            src="/Demeter.svg"
             alt="Demeter"
             className="w-55 h-55"
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

    )

}