"use client";

import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function View1() {
    const router = useRouter();
  
    useEffect(() => {
      const timer = setTimeout(() => {
        router.push("/confirmation");
      }, 10000);
      return () => clearTimeout(timer);
    }, [router]);
    
  return (
    <div className="h-screen flex flex-col">
      <form
        className="background_individual_view2 flex-1 flex flex-col items-center gap-2"
      >
        <Header />

        <img
          src="https://novaeafit2.blob.core.windows.net/omega-2025/text_enviado_exitoso.png"
          alt="Confirmación de formulario enviado"
          className="w-52 h-auto"
        />

        <img
          src="/Poseidon.svg"
          alt="Pacho poseidon"
          className="mt-5 w-max-70 h-auto"
        />
        <Footer />
      </form>
    </div>
  );
}
