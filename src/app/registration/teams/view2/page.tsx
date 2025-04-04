"use client";

import { Header } from "@/app/components/forms/registration/teams/Extras";
import { Footer } from "@/app/components/forms/registration/teams/Extras";

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
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-white text-3xl font-bold">Contenido principal</h1>
      </main>
      <Footer />
    </div>
  );
}