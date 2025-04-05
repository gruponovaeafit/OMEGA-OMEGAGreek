"use client";
import React from "react";
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';


export default function Home() {

  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-4 px-4 pt-6 overflow-y-auto">
        <Header />

        <img 
          src="/text_enviado_exito.svg" 
          alt="Formulario de Registro"
          className="w-52 h-auto"
        />

          <img
            src="/pacho_atenea.svg"
            alt="Pacho Zeus"
            className="w-54 h-auto"
          />
        
        <Footer />
      </div>
    </div>
  );
}
