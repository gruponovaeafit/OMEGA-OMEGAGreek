'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/forms/registration/inscription_individual/buttons';
import { RoleCard } from '../../../components/forms/registration/inscription_individual/question';
import { InfoBox } from '../../../components/forms/registration/inscription_individual/text';

// Definir el tipo para los roles
interface Role {
  id: string;
  title: string;
  description: string;
}

const roles: Role[] = [
  {
    id: 'administrador',
    title: 'Administrador',
    description: 'Descripción rol'
  },
  {
    id: 'diseno',
    title: 'Diseño',
    description: 'Descripción rol'
  },
  {
    id: 'mercadeo',
    title: 'Mercadeo',
    description: 'Descripción rol'
  },
  {
    id: 'desarrollo',
    title: 'Desarrollo',
    description: 'Descripción rol'
  }
];

const RoleSelectionPage = () => {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleRoleSelection = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
    setError('');
  };

  const handleSubmit = () => {
    if (selectedRoles.length === 0) {
      setError('Por favor, selecciona al menos un rol');
      return;
    }
    
    // Aquí guardarías los datos en un estado global o localStorage
    console.log('Roles seleccionados:', selectedRoles);
    
    // Navegar a la siguiente vista
    router.push('/registration_form/individual_form/individual_form_3');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-gray-200 p-4">
        <h1 className="text-black text-center font-bold">OMEGALAB (LOGO)</h1>
      </div>

      <div className="bg-gray-800 p-2 mx-auto w-full max-w-md">
        <p className="text-center text-white">Inscripción individual</p>
      </div>

      {/* Content */}
      <div className="flex-grow w-full max-w-md mx-auto p-4">
        <InfoBox title="Explicación roles">
          <p className="text-center">
            Selecciona los roles que te interesan para participar en OMEGALAB.
            Cada rol tiene responsabilidades específicas dentro del equipo.
          </p>
        </InfoBox>

        {/* Roles */}
        <div className="space-y-4 mb-6">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              id={role.id}
              title={role.title}
              description={role.description}
              isSelected={selectedRoles.includes(role.id)}
              onClick={() => toggleRoleSelection(role.id)}
              color="red"
            />
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            text="Siguiente"
            onClick={handleSubmit}
            color="red"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full p-4 text-center text-gray-500 text-xs">
        POWERED BY NOVA
      </div>
    </div>
  );
};

export default RoleSelectionPage;