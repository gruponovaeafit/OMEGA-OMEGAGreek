"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { useState } from "react";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";
import FormHeader from "@/app/components/UI/FormHeader";
import FormStaticAlert from "@/app/components/UI/FormStaticAlert";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

  const [food, setFood] = useState("Preferencia alimentaria");

  const handleSiguiente = async () => {
    try {
      const response = await fetch("/api/forms/userFoodPreferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food_preferences: food }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        toast.error(result.notification?.message || "Error al guardar.");
        return;
      }
  
      toast.success(result.notification?.message, {
        onClose: () => router.push(result.redirectUrl || "/confirmation/teams/send"),
      });
    } catch (error) {
      console.error("Error al enviar preferencia alimentaria:", error);
      toast.error("Error interno al guardar preferencia.");
    }
  };

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
          options={["Vegetariano/a", "Vegano/a", "Sin restricciones"]}
          name="leaderFood"
        />
      </div>

      <div className="w-full max-w-[320px] mt-10">
        <FormStaticAlert iconName="hammer">
          <p className="text-xl text-center">
            Antes del evento, te estaremos enviando recomendaciones e
            información importante a tu correo.{" "}
            <strong>¡Mantente atento/a!</strong>
          </p>
        </FormStaticAlert>
      </div>

      <div className="flex justify-center items-center gap-0 mt-7">
        <img src="/Demeter.svg" alt="Demeter" className="w-55 h-55" />
        <Button
          label="Enviar"
          onClick={handleSiguiente}
          type="submit"
          variant="secondary"
        />
      </div>
      <Footer />
    </div>
  );
}
