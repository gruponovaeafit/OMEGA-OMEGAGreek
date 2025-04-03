'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Text, { InfoBox } from '../../../components/forms/registration/individual/text';
import Button, { ButtonGroup } from '../../../components/forms/registration/individual/buttons';
import { 
  InputField, 
  SelectField 
} from '../../../components/forms/registration/individual/question';

interface FormData {
  correoElectronico: string;
  numeroCelular: string;
  comoNosConociste: string;
  disponible: boolean | null;
}

const ContactInfoPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    correoElectronico: '',
    numeroCelular: '',
    comoNosConociste: '',
    disponible: null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAvailabilityChange = (value: string) => {
    setFormData({
      ...formData,
      disponible: value === 'si',
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.correoElectronico) {
      newErrors.correoElectronico = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correoElectronico)) {
      newErrors.correoElectronico = 'El correo electrónico no es válido';
    }
    
    if (!formData.numeroCelular) {
      newErrors.numeroCelular = 'El número celular es requerido';
    }
    
    if (!formData.comoNosConociste) {
      newErrors.comoNosConociste = 'Por favor indique cómo nos conoció';
    }
    
    if (formData.disponible === null) {
      newErrors.disponible = 'Por favor indique su disponibilidad';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí guardarías los datos en un estado global o localStorage
      console.log('Datos de contacto:', formData);
      
      // Aquí normalmente enviarías los datos al backend
      // Simular envío exitoso
      router.push('/registration_form/individual_form/individual_form_4');
    }
  };

  const referralOptions = [
    { value: 'redes', label: 'Redes Sociales' },
    { value: 'amigo', label: 'Un amigo' },
    { value: 'universidad', label: 'Universidad' },
    { value: 'evento', label: 'Evento' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-gray-200 p-4">
        <h1 className="text-black text-center font-bold">OMEGALAB (LOGO)</h1>
      </div>

      <div className="bg-gray-800 p-2 mx-auto w-full max-w-md">
        <p className="text-center text-white">Inscripción individual</p>
      </div>

      {/* Form */}
      <div className="flex-grow w-full max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Correo electrónico"
            name="correoElectronico"
            type="email"
            value={formData.correoElectronico}
            onChange={handleInputChange}
            required
            error={errors.correoElectronico}
            color="purple"
            placeholder="ejemplo@mail.com"
          />

          <InputField
            label="Número celular"
            name="numeroCelular"
            type="tel"
            value={formData.numeroCelular}
            onChange={handleInputChange}
            required
            error={errors.numeroCelular}
            color="purple"
            placeholder="+57 3001234567"
          />

          <SelectField
            label="¿Cómo nos conociste?"
            name="comoNosConociste"
            value={formData.comoNosConociste}
            onChange={handleSelectChange}
            options={referralOptions}
            required
            error={errors.comoNosConociste}
            color="blue"
          />

          {/* Fechas y horas del evento */}
          <InfoBox title="Fechas y horas del evento">
            <p className="text-center">
              El evento se realizará del 10 al 12 de junio de 2023, de 9am a 5pm.
            </p>
          </InfoBox>

          {/* Disponibilidad */}
          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-300 mb-3">
              ¿Estás disponible para asistir al evento?
            </p>
            
            <div className="flex justify-center space-x-6">
              <button
                type="button"
                onClick={() => handleAvailabilityChange('si')}
                className={`px-8 py-3 rounded-md ${
                  formData.disponible === true ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'
                }`}
              >
                Sí
              </button>
              
              <button
                type="button"
                onClick={() => handleAvailabilityChange('no')}
                className={`px-8 py-3 rounded-md ${
                  formData.disponible === false ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'
                }`}
              >
                No
              </button>
            </div>
            {errors.disponible && (
              <p className="mt-1 text-sm text-red-500 text-center">{errors.disponible}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              text="Enviar"
              color="red"
              className="px-8"
            />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full p-4 text-center text-gray-500 text-xs">
        POWERED BY NOVA
      </div>
    </div>
  );
};

export default ContactInfoPage;