"use client";
import React from 'react';
import TextHome from '@/app/components/home/text';
import ButtonHome from '@/app/components/home/buttons';



const handleClickIndividual = () => {
    window.location.href = '/registration/individual';
}

const handleClickGroup = () => {
    window.location.href = '/registration/group';
}

export default function Home() {
  return (
    <div className='bg-black min-h-screen flex flex-col items-center py-4'>
      
        <ButtonHome text={<TextHome text='Registro Individual'/>} onClick={handleClickIndividual}/>
      
        <ButtonHome text={<TextHome text='Registro Colectivo'/>} onClick={handleClickGroup}/>
            <img src="/POWERED_BY_NOVA.svg" alt="" className='absolute bottom-4'/>
        <div>
            
        </div>
    </div>
  );
}

