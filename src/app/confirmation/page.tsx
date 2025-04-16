"use client";
import { TextButton } from "../components/forms/confirmation/individual/text";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function Confirmation() {
  return ( 
    <div className="background_email min-h-screen flex flex-col items-center py-4">
      <Header />
      <TextButton text="Confirmación Individual"/>
      <img 
      src="/Confirmacion_Individual.svg" 
      alt="Confirmación Individual"
      className="w-72 h-auto cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
      onClick={() =>
        (window.location.href =
          "/confirmation/individual")
      }
      />
      
      <TextButton text="Confirmación Grupal"/>

      <img 
      src="/Confirmacion_Grupal.svg" 
      alt="Confirmación Grupal"
      className="w-72 h-auto cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
      onClick={() =>
        (window.location.href =
          "/confirmation/teams")
      } 
      />
      <Footer/>
    </div>
  );
}
