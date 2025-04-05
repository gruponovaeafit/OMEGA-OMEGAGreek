'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from 'src/app/components/forms/registration/individual/buttons';

const RegistrationConfirmationPage: React.FC = () => {
  const router = useRouter();

  const handleStartOver = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 relative flex flex-col">
      {/* Logo Superior */}
      <div className="absolute top-0 left-0 right-0 flex justify-center py-4">
        <div className="w-16 h-16">
          <Image 
            src="/images/Componentes/Logo.svg" 
            alt="Logo" 
            width={64} 
            height={64} 
          />
        </div>
      </div>

      {/* Elemento decorativo */}
      <div className="absolute top-4 right-4">
        <Image 
          src="/images/Componentes/estrella.svg" 
          alt="Estrella" 
          width={50} 
          height={50} 
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center">
          <h1 className="text-white text-2xl font-bold mb-6">
            Formulario enviado con éxito
          </h1>

          <div className="flex justify-center mb-6">
            <div className="w-64 h-64 relative">
              <Image 
                src="/images/Componentes/pachoatenea.svg" 
                alt="Personaje" 
                width={256} 
                height={256} 
              />
            </div>
          </div>

          <p className="text-white text-sm mb-6">
            Recibirás un correo con los detalles de tu inscripción pronto.
          </p>

          <Button
            text="Volver al inicio"
            onClick={handleStartOver}
            color="pink"
            className="w-full"
          />
        </div>
      </div>

      {/* Elementos inferiores */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
        <Image 
          src="/images/Componentes/Nova.svg" 
          alt="Powered by Nova" 
          width={150} 
          height={50} 
        />
      </div>
    </div>
  );
};

export default RegistrationConfirmationPage;