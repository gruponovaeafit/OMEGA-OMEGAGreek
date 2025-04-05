import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Text from '../../text';
import { Button } from '../../buttons';
import { Header, Footer } from '../../layout';

const RegistrationConfirmationPage: React.FC = () => {
  const router = useRouter();

  const handleStartOver = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-900 to-indigo-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-lg p-8 text-center shadow-lg">
            {/* Carácter de mapache como mascota */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative">
                <Image 
                  src="/raccoon-success.svg" 
                  alt="Confirmación" 
                  width={128}
                  height={128}
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center p-6">
              <h2 className="text-xl font-bold text-white">Formulario enviado con éxito</h2>
            </div>
            
            <p className="text-white text-sm mt-4">
              Recibirás un correo con los detalles de tu inscripción pronto.
            </p>
            
            <div className="mt-8">
              <Button
                text="Volver al inicio"
                onClick={handleStartOver}
                color="pink"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegistrationConfirmationPage;