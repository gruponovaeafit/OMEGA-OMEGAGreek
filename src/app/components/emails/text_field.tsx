import React from "react";

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="email"
      value={value}
      onChange={onChange}
      placeholder={placeholder || "usuario@correo.edu.co"}
      className="w-80 h-12 px-4 text-center text-lg font-light text-gray-900 bg-white/40 rounded-xl placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
};

export default EmailInput;
