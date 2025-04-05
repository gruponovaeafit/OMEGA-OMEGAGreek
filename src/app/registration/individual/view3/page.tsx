import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const IndividualRegistrationPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'C.C.',
    numeroDocumento: '',
    fechaNacimiento: '',
    tyc: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías agregar validaciones
    router.push('/registration/individual/view4');
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

      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h1 className="text-white text-2xl font-bold text-center mb-6">
            Inscripción Individual
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="C.C.">C.C.</option>
                <option value="T.I.">T.I.</option>
                <option value="C.E.">C.E.</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                name="numeroDocumento"
                placeholder="Número de documento"
                value={formData.numeroDocumento}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <input
                type="text"
                name="fechaNacimiento"
                placeholder="Calendario"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="tyc"
                checked={formData.tyc}
                onChange={() => setFormData(prev => ({...prev, tyc: !prev.tyc}))}
                className="mr-2 bg-white/20"
              />
              <label htmlFor="tyc" className="text-white">
                He leído y acepto los TyC
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <div className="w-6 h-6 mr-2">
                <Image 
                  src="/images/Componentes/pachozeus.svg" 
                  alt="Siguiente" 
                  layout="responsive"
                  width={24} 
                  height={24} 
                />
              </div>
              Siguiente
            </button>
          </form>
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
      <div className="absolute bottom-4 right-4">
        <Image 
          src="/images/Componentes/parteboton.svg" 
          alt="Botón" 
          width={50} 
          height={50} 
        />
      </div>
    </div>
  );
};

export default IndividualRegistrationPage;