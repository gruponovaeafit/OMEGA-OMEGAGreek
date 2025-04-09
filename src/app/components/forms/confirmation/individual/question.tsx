"use client";

import React from "react";

interface QuestionConfirmationTextProps {
  value: string; // Cambiado a value
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Agregado onChange
}

const QuestionConfirmationText: React.FC<QuestionConfirmationTextProps> = ({
  value,
  placeholder,
  onChange,
}) => {
  return (
    <input
      type="text"
      value={value} // Usar value para un componente controlado
      onChange={onChange} // Manejar cambios
      placeholder={placeholder}
      className="w-full h-10 p-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default QuestionConfirmationText;
