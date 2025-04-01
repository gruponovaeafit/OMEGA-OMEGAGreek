import React from "react";

interface ButtonHomeProps {
    text: React.ReactNode;
    onClick: () => void;
  }
  
  const ButtonHome: React.FC<ButtonHomeProps> = ({ text, onClick }) => {
      return(
          <button 
            className="bg-red-500 text-black text-center p-6 rounded-lg max-w-xs w-full my-4 h-[268px]"
            onClick={onClick}
          >
              {text}
          </button>
      )
  }
  
  export default ButtonHome;