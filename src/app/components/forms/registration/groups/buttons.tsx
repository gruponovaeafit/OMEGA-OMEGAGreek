"use client"

import React from "react";
// Componente SubmitButton
export const SubmitButtonRegistrationTeam: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: "#ED0BC0" }} 
        >
            Enviar
        </button>
    );
};

// Componente ButtonRegistration
interface ButtonRegistrationProps {
    text: React.ReactNode;
    onClick: () => void;
  }
export const ButtonConfirmationRegistrationTeam: React.FC<ButtonRegistrationProps> = ({ text, onClick }) => {
      return(
          <button 
            className="bg-red-500 text-black text-center p-6 rounded-lg max-w-xs w-full my-4 h-[268px]"
            onClick={onClick}
            style={{ backgroundColor: "#ED0BC0" }}
          >
              {text}
          </button>
      )
  }