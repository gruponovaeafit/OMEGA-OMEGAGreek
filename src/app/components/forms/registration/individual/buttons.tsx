'use client';

import React from 'react';
import Image from 'next/image';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  color?: 'pink' | 'purple' | 'blue' | 'default';
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  color = 'default'
}) => {
  const getColorClasses = () => {
    switch(color) {
      case 'pink':
        return 'bg-pink-500 hover:bg-pink-600 text-white';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-pink-500 hover:bg-pink-600 text-white';
    }
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
        ${getColorClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
    >
      {text}
    </button>
  );
};

// Resto del código de botones que tenías anteriormente...