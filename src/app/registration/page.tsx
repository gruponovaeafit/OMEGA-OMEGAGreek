"use client";
import React from 'react';
import { ButtonHome } from '../components/forms/registration/buttons';
import { Footer } from '@/app/layout';
import { Header } from '@/app/layout';

const handleClickIndividual = () => {
  window.location.href = '/registration/individual';
};

const handleClickGroup = () => {
  window.location.href = '/registration/teams';
};

export default function Home() {
  return (
    <div className="h-screen flex flex-col">

      <div className="background_home flex-1 flex flex-col items-center gap-6 ">

      <Header />
        <img 
            src="/text_formulario_de_registro.svg" 
            alt="Formulario de Registro"
            className="w-72 h-auto"
        />
        <img 
          src="/button_registration_individual.svg" 
          alt="Registro individual"
          className="w-72 h-auto"
          onClick={handleClickIndividual}
        />
        <img 
          src="/button_registration_team.svg" 
          alt="Registro grupal"
          className="w-72 h-auto mt-6"
          onClick={handleClickGroup}
        />
      
        <Footer />
      </div>


    </div>
  );
}
