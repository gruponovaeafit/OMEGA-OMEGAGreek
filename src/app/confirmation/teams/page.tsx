"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { TextButton } from "@/app/components/forms/confirmation/individual/text";
import { TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { useState } from "react";

export default function Confirmation2() {

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
             className="w-32 h-32"
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