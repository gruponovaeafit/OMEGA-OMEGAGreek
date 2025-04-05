"use client";
import React from 'react';
import TextHome from '@/app/components/forms/registration/text';
import { ButtonHome } from '../components/forms/registration/buttons';
import { Footer } from '../layout';
import { Header } from '../layout';



const handleClickIndividual = () => {
    window.location.href = '/registration/individual';
}

const handleClickGroup = () => {
    window.location.href = '/registration/teams';
}

export default function Home() {
  return (
    <div>
      <Header/>
      <div className='background_home min-h-screen flex flex-col items-center py-4'>
        
        <ButtonHome text= "Inscripción Individual" imageSrc='/register_ind.svg' onClick={handleClickIndividual}/>
      
        <ButtonHome text='Inscripción Grupal' imageSrc= '/register_team.svg' onClick={handleClickGroup}/>
        <Footer/>
      </div>
    </div>
  );
}

