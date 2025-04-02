"use client";
import React from 'react';
import { ButtonConfirmationRegistrationTeam } from '@/app/components/forms/registration/groups/buttons';
import { TextConfirmationTeamRegistration } from '@/app/components/forms/registration/groups/text';

const handleClickIndividual = () => {
    window.location.href = '/registration/individual';
}

const handleClickGroup = () => {
    window.location.href = '/registration/group';
}

export default function RegistrationTeam() {
  return (
    <div className='background_home min-h-screen flex flex-col items-center py-4'>
      
        <ButtonConfirmationRegistrationTeam text={<TextConfirmationTeamRegistration text='Registro Individual'/>} onClick={handleClickIndividual}/>
      
        <ButtonConfirmationRegistrationTeam text={<TextConfirmationTeamRegistration text='Registro Colectivo'/>} onClick={handleClickGroup}/>
            <img src="/POWERED_BY_NOVA.svg" alt="" className='absolute bottom-4'/>
        <div>
            
        </div>
    </div>
  );
}