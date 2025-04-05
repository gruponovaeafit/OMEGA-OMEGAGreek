import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const QuestionsPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    participadoAntes: null as boolean | null,
    celular: '',
    comoConociste: '',
    disponible: null as boolean | null
  });

  const handleYesNoChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones o lógica de envío
    router.push('/registration/individual/view6');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 relative flex flex-col">
      {/* Logo Superior */}
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
          src="/images/Componentes/buho.svg" 
          alt="Buho" 
          width={50} 
          height={50} 
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 pt-20">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h1 className="text-white text-2xl font-bold text-center mb-6">
            Inscripción Individual
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pregunta de participación previa */}
            <div>
              <p className="text-white mb-2 text-center">
                ¿Has participado antes en alguna versión de la Omega?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleYesNoChange('participadoAntes', true)}
                  className={`px-6 py-2 rounded-full transition-colors 
                    ${formData.participadoAntes === true 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleYesNoChange('participadoAntes', false)}
                  className={`px-6 py-2 rounded-full transition-colors 
                    ${formData.participadoAntes === false 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Número de celular */}
            <div>
              <input
                type="tel"
                name="celular"
                placeholder="Número celular"
                value={formData.celular}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Cómo nos conociste */}
            <div>
              <input
                type="text"
                name="comoConociste"
                placeholder="¿Cómo nos conociste?"
                value={formData.comoConociste}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Información del evento */}
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-white text-sm">
                El evento se llevará a cabo a partir del sábado 26 de abril a las 11:00 a.m. hasta el domingo 27 de abril a las 6:00 p.m.
              </p>
            </div>

            {/* Disponibilidad */}
            <div>
              <p className="text-white mb-2 text-center">
                ¿Estás disponible para asistir al evento?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleYesNoChange('disponible', true)}
                  className={`px-6 py-2 rounded-full transition-colors 
                    ${formData.disponible === true 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleYesNoChange('disponible', false)}
                  className={`px-6 py-2 rounded-full transition-colors 
                    ${formData.disponible === false 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Botón de envío */}
            <button 
              type="submit" 
              className="w-full mt-4 p-3 bg-white/30 text-white rounded-full hover:bg-white/40 transition-colors flex items-center justify-center"
            >
              <div className="w-6 h-6 mr-2">
                <Image 
                  src="/images/Componentes/pachohermes.svg" 
                  alt="Enviar" 
                  layout="responsive"
                  width={24} 
                  height={24} 
                />
              </div>
              Enviar
            </button>
          </form>
        </div>
      </div>

      {/* Elementos inferiores */}
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

export default QuestionsPage;