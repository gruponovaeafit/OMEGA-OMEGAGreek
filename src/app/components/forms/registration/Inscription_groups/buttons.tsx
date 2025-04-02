import React from 'react';
import { useRouter } from 'next/router';

interface ButtonProps {
text: string;
onClick?: () => void;
isPrimary?: boolean;
type?: 'button' | 'submit' | 'reset';
disabled?: boolean;
fullWidth?: boolean;

}

const Button: React.FC<ButtonProps> = ( {
text,
onClick,
isPrimary = true,
type = 'button',
disabled = false,
fullWidth = false

}) => {
    const router = useRouter ();
    
    const handleClick = () => {
        if (onClick) {
            onClick ();
        }
    };

    return (
        <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={`${fullWidth ? 'w-full' : 'px-6'} py-2 rounded-md text-sm font-medium transition-colors
        ${isPrimary 
          ? 'bg-pink-500 text-white hover:bg-pink-600' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {text}
    </button>
  );
};

export const AddMemberButton: React.FC<{ onClick: ()=> void }> = ( { onClick }) =>{

    return (
        <button
        onClick={onClick}
        className="flex items-center justify-center px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
    >
      
      <div 
        className="h-5 w-5 mr-2"
        style={{
            backgroundImage: "url('/icons/add-member-icon.svg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",


        }}
    ></div>

    Añadir miembro
 </button>


    );
};

export default Button;







    







