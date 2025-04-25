"use client";
import React from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";

import Star from "@/app/components/Star"; 

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="background_individual_view2 flex-1 flex flex-col items-center gap-4 px-4 pt-6 overflow-y-auto">
        <Header />

        <Star /> {/* estrellita */}

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