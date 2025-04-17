"use client";
import React from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import FormStaticAlert from "@/app/components/UI/FormStaticAlert";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-4 px-4 pt-6 overflow-y-auto">
        <Header />

        <div className="w-full max-w-[320px] mt-4 mb-6">
          <FormStaticAlert iconName="owl">
            <p className="text-xl text-center font-bold text-white">
              Formulario enviado con éxito
            </p>
          </FormStaticAlert>
        </div>

        {/* imagen personajes */}
        <img
          src="/Confirmation_Grupal_Send.svg"
          alt="Grupo confirmacion"
          className="w-54 h-auto"
        />

        <Footer />
      </div>
    </div>
  );
}