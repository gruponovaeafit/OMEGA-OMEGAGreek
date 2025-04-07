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
          src="https://novaeafit.blob.core.windows.net/omega-2025/text_enviado_exitoso.png" 
          alt="Formulario de Registro"
          className="w-52 h-auto"
        />

          <img
            src="https://novaeafit.blob.core.windows.net/omega-2025/pacho_apolo.svg"
            alt="Pacho Apolo"
            className="w-54 h-auto"
          />
        
        <Footer />
      </div>
    </div>
  );
}