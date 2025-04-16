"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { useState } from "react";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";

const handleSiguiente = () => {
    window.location.href = '/confirmation/teams/send';
  };

export default function Confirmation2() {
    
    const [food, setFood] = useState("Preferencia alimentaria"); 

    return (  
        <div className="background_email min-h-screen flex flex-col items-center py-4">
        <Header />
        
        <img 
            src="/Confirmation_Grupal.svg" 
            alt="onfirmation_Grupal" 
        />
        <div className="w-80 mb-6">
            <Select
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