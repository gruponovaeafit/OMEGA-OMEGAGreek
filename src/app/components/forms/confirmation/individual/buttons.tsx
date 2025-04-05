"use client";

import React, { useState } from "react";

// Componente CheckboxButton
export const CheckboxButtonIndividual: React.FC<{ onChange: (checked: boolean) => void }> = ({ onChange }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsChecked(checked);
        onChange(checked); // Notifica al componente padre
    };

    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="checkbox" className="ml-2 text-white">
                He leído los términos y condiciones
            </label>
        </div>
    );
};

// Componente SubmitButton
export const SubmitButtonIndividual: React.FC<{ onClick: () => void }> = ({ onClick }) => {
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

interface ButtonConfirmationProps {
    text: React.ReactNode;
    onClick: () => void;
  }
export const ButtonConfirmationIndividual: React.FC<ButtonConfirmationProps> = ({ text, onClick }) => {
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