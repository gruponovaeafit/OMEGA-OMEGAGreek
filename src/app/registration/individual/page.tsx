'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Text from '../../components/forms/registration/individual/text';
import Button from '../../components/forms/registration/individual/buttons';
import { InputField } from '@/app/components/forms/registration/teams/question';
import { SelectField } from '../../components/forms/registration/individual/question';
import { DateField } from '../../components/forms/registration/individual/question';
import { Checkbox } from '../../components/forms/registration/individual/question';
import { Header } from "@/app/layout";
import { Footer } from "@/app/layout";


const PersonalInfoForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    aceptaTerminos: false
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

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleDateChange = (date: string) => {
    setFormData({
      ...formData,
      fechaNacimiento: date,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido) newErrors.apellido = 'El apellido es requerido';
    if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Seleccione un tipo de documento';
    if (!formData.numeroDocumento) newErrors.numeroDocumento = 'El número de documento es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.aceptaTerminos) newErrors.aceptaTerminos = 'Debe aceptar los términos y condiciones';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí guardarías los datos en un estado global o localStorage
      console.log('Datos del formulario:', formData);
      
      // Navegar a la siguiente vista
      router.push('/registration_form/individual_form/individual_form_2');
    }
  };

  const documentTypes = [
    { value: 'dni', label: 'DNI' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'cedula', label: 'Cédula de Identidad' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
      {/* Componente con el titulo de la vista */}  
      
      {/* Form */}
      <div className="flex-grow w-full max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            error={errors.nombre}
            color="purple"
            placeholder="Juan"
          />

          <InputField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            required
            error={errors.apellido}
            color="purple"
            placeholder="Pérez"
          />

          <SelectField
            label="Tipo de documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleSelectChange}
            options={documentTypes}
            required
            error={errors.tipoDocumento}
            color="amber"
          />

          <InputField
            label="Número de documento"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleInputChange}
            required
            error={errors.numeroDocumento}
            color="purple"
            placeholder="12345678"
          />

          <DateField
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleDateChange}
            required
            error={errors.fechaNacimiento}
          />

          <Checkbox
            label="He leído y acepto los TyC"
            name="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={handleCheckboxChange}
            required
            error={errors.aceptaTerminos}
          />

          <div className="flex justify-end mt-6">
            <Button
              text="Siguiente"
              type="submit"
              color="pink"
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

export default PersonalInfoForm;