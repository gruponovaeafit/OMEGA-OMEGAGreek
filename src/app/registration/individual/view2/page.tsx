import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const RegistrationOptionsPage: React.FC = () => {
  const router = useRouter();

  const handleIndividualRegistration = () => {
    router.push('/registration/individual/view3');
  };

  const handleGroupRegistration = () => {
    router.push('/registration/group');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 relative flex flex-col">
      <div className="absolute top-0 left-0 right-0 flex justify-center py-4">
        <div className="w-16 h-16">
          <Image 
            src="/images/Componentes/Logo.svg" 
            alt="Logo" 
            layout="responsive"
            width={64} 
            height={64} 
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 space-y-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h1 className="text-white text-2xl font-bold text-center mb-6">
            Formulario de Inscripción
          </h1>

          <div 
            onClick={handleIndividualRegistration} 
            className="mb-4 cursor-pointer"
          >
            <div className="bg-white/20 rounded-xl p-4 flex items-center">
              <div className="w-24 h-24 mr-4">
                <Image 
                  src="/images/Componentes/personajeverde.svg" 
                  alt="Inscripción Individual" 
                  layout="responsive"
                  width={96} 
                  height={96} 
                />
              </div>
              <span className="text-white text-lg font-semibold">
                Inscripción Individual
              </span>
            </div>
          </div>

          <div 
            onClick={handleGroupRegistration} 
            className="cursor-pointer"
          >
            <div className="bg-white/20 rounded-xl p-4 flex items-center">
              <div className="w-24 h-24 mr-4">
                <Image 
                  src="/images/Componentes/personajesgrupo.svg" 
                  alt="Inscripción Grupal" 
                  layout="responsive"
                  width={96} 
                  height={96} 
                />
              </div>
              <span className="text-white text-lg font-semibold">
                Inscripción Grupal
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
        <Image 
          src="/images/Componentes/Nova.svg" 
          alt="Powered by Nova" 
          width={150} 
          height={50} 
        />
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-4 right-4">
        <Image 
          src="/images/Componentes/esfera.svg" 
          alt="Esfera" 
          width={50} 
          height={50} 
        />
      </div>
      <div className="absolute top-4 left-4">
        <Image 
          src="/images/Componentes/ala.svg" 
          alt="Ala" 
          width={50} 
          height={50} 
        />
      </div>
    </div>
  );
};

export default RegistrationOptionsPage;