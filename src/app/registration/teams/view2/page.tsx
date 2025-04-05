"use client";

import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { InfoBox } from "@/app/components/forms/registration/teams/text";

export default function View2() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between"
      style={{
        backgroundImage: "url('/FONDO-APP.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      {/* InfoBox posicionado debajo del logo */}
      <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2">
        <InfoBox className="border-4 border-white px-4 py-2 rounded bg-transparent">
          <img src="/InscriptionTittle.svg" alt="Inscription Title" />
        </InfoBox>
      </div>
      <main className="flex-grow flex items-center justify-center"></main>
      <Footer />
    </div>
  );
}