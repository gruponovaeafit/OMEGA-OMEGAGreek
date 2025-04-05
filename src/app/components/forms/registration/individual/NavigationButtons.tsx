import React from 'react';
import Image from 'next/image';

interface NavigationButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

// Botón de navegación (Siguiente, Anterior)
export const NavigationButton: React.FC<NavigationButtonProps> = ({
  text,
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-full px-6 py-2 
        bg-gray-800 text-white font-medium text-sm 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'} 
        ${className}`}
    >
      {text}
      <span className="ml-2">
        <Image 
          src="/next-icon.svg"  
          alt="Siguiente"
          width={20}
          height={20}
        />
      </span>
    </button>
  );
};

// Botón circular para navegación
export const CircleButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
  ariaLabel: string;
}> = ({
  onClick,
  icon,
  className = '',
  disabled = false,
  ariaLabel
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white 
        transition-colors hover:bg-green-600 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon}
    </button>
  );
};

// Contenedor para botones de siguiente/anterior
export const PrevNextButtons: React.FC<{
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  className?: string;
}> = ({
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
  className = ''
}) => {
  return (
    <div className={`flex justify-between w-full ${className}`}>
      {onPrev ? (
        <CircleButton
          onClick={onPrev}
          disabled={disablePrev}
          ariaLabel="Anterior"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          }
        />
      ) : <div></div>}
      
      {onNext && (
        <CircleButton
          onClick={onNext}
          disabled={disableNext}
          ariaLabel="Siguiente"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          }
        />
      )}
    </div>
  );
};

export default {
  NavigationButton,
  CircleButton,
  PrevNextButtons
};