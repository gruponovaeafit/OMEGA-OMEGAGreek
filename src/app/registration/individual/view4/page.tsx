import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const RolesExplanationPage: React.FC = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      name: 'Administrador',
      image: '/images/Componentes/administrador.svg',
      description: 'Dirige el proyecto, coordina las actividades y garantiza que se cumplan los objetivos. Responsable de la toma de decisiones estratégicas.'
    },
    {
      name: 'Diseño',
      image: '/images/Componentes/diseno.svg',
      description: 'Crea los elementos visuales del proyecto, desde interfaces hasta materiales promocionales. Responsable de la estética y experiencia de usuario.'
    },
    {
      name: 'Mercadeo',
      image: '/images/Componentes/mercadeo.svg',
      description: 'Desarrolla estrategias para promocionar el proyecto, identificar audiencias y crear mensajes efectivos. Responsable de la visibilidad y alcance.'
    },
    {
      name: 'Desarrollo',
      image: '/images/Componentes/personajeverde.svg',
      description: 'Implementa las soluciones técnicas, programa funcionalidades y asegura la operatividad. Responsable de la construcción y mantenimiento.'
    }
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      router.push('/registration/individual/view5');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 relative flex flex-col">
      {/* Logo */}
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

      {/* Decorative elements */}
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
          src="/images/Componentes/arpa.svg" 
          alt="Arpa" 
          width={50} 
          height={50} 
        />
      </div>
      <div className="absolute top-1/3 right-4">
        <Image 
          src="/images/Componentes/estrella.svg" 
          alt="Estrella" 
          width={30} 
          height={30} 
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 pt-20">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h1 className="text-white text-2xl font-bold text-center mb-6">
            Explicación de roles
          </h1>

          <div className="text-center mb-6 bg-white/20 rounded-lg p-4">
            <p className="text-white text-sm">
              Lee atentamente la descripción de cada rol y selecciona el que más se adapte a tus intereses.
            </p>
          </div>

          <div className="space-y-4">
            {roles.map((role) => (
              <div 
                key={role.name}
                onClick={() => handleRoleSelect(role.name)}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all 
                  ${selectedRole === role.name 
                    ? 'bg-white/30 border-2 border-white' 
                    : 'bg-white/20 hover:bg-white/30'}`}
              >
                <div className="w-16 h-16 mr-4">
                  <Image 
                    src={role.image} 
                    alt={role.name} 
                    layout="responsive"
                    width={64} 
                    height={64} 
                  />
                </div>
                <div>
                  <h2 className="text-white font-bold">{role.name}</h2>
                  <p className="text-white/70 text-sm">{role.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleNext}
            disabled={!selectedRole}
            className={`w-full mt-6 p-3 rounded-full transition-colors 
              ${selectedRole 
                ? 'bg-white/30 text-white hover:bg-white/40' 
                : 'bg-white/10 text-white/50 cursor-not-allowed'}`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Bottom elements */}
      <div className="absolute bottom-4 left-4">
        <Image 
          src="/images/Componentes/parteboton.svg" 
          alt="Parte botón" 
          width={50} 
          height={50} 
        />
      </div>
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

export default RolesExplanationPage;