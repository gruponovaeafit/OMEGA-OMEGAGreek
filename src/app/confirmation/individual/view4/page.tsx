"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { useState } from "react";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";
import FormHeader from "@/app/components/UI/FormHeader";
import FormStaticAlert from "@/app/components/UI/FormStaticAlert";

const handleSiguiente = () => {
    window.location.href = '/confirmation/teams/send';
  };

export default function View4() {
    
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

        <div className="w-full max-w-[320px] mt-10">
          <FormStaticAlert iconName="hammer">
            <p className="text-xl text-center">Antes del evento, te estaremos enviando recomendaciones e información importante a tu correo. <strong>¡Mantente atento/a!</strong></p>
          </FormStaticAlert>
        </div>

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