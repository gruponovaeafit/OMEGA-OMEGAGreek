"use client";

import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";


export default function View2() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between"
      style={{
        backgroundImage: "url('/view3bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
            {/* Componente con el titulo de la vista */}  
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-white text-3xl font-bold">Contenido principal</h1>
      </main>
      <Footer />
    </div>
  );
}