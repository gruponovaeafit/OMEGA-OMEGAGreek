"use client";
import { TextButton } from "../components/forms/confirmation/individual/text";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const handleClickIndividual = async () => {
  const canProceed = await checkUserStatus();
  if (canProceed) {
    router.push("/confirmation/individual");
  }
};

const handleClickGroup = async () => {
  const canProceed = await checkTeamStatus();
  if (canProceed) {
    router.push("/confirmation/teams");
  }
};

export default function Confirmation() {
  return ( 
    <div className="background_email min-h-screen flex flex-col items-center py-4">
      <Header />
      <img
          src="/Formulario_Inscripcion_Titulo.svg"
          alt="Formulario de Inscripción Título"
          className="w-72 h-auto"
        />
      <img
          src="/Inscripcion_Individual_Boton.svg"
          alt="Registro individual"
          className="w-72 h-auto cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
          onClick={handleClickIndividual}
        />

        <img
          src="/Inscripcion_Grupal_Boton.svg"
          alt="Registro grupal"
          className="w-72 h-auto mt-6 cursor-pointer transition-transform duration-200 hover:scale-105 hover:brightness-110"
          onClick={handleClickGroup}
        />
      <Footer/>
    </div>
  );
}
