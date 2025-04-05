"use client";
import React, { useState } from "react";
import EmailInput from "@/app/components/emails/text_field";

const Loading: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    window.location.href = '/registration';
  };

  return (
    <div className="background_email flex flex-col items-center justify-center gap-6 px-4 min-h-screen">
      <img 
        src="/logo_email_view.svg" 
        alt="Logo OMEGA y Correo Electrónico" 
        className="w-64 h-auto"
      />

      <EmailInput 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />

    <img 
        src="/button_siguiente.svg" 
        alt="Botón de siguiente"
        onClick={handleSubmit}
        className="h-auto cursor-pointer self-end mr-4"
    />
    </div>
  );
};

export default Loading;
