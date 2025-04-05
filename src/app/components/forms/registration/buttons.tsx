import React from "react";
import { text } from "stream/consumers";

interface ButtonHomeProps {
    text: string
    onClick: () => void;
    imageSrc?: string; // ← esta es la nueva prop dinámica
}


export const ButtonHome: React.FC<ButtonHomeProps> = ({ text, onClick, imageSrc }) => {
    return (

        <div>
            <h1>{text}</h1>
            <button 
            className="relative bg-transparent  text-black text-center p-6 rounded-lg max-w-xs w-full my-4 h-[268px] overflow-hidden flex flex-col items-center justify-center"
            onClick={onClick}
        >

            {imageSrc && (
                <img 
                    src={imageSrc} 
                    alt="Imagen decorativa dinámica"
                    className="w-20 h-auto"
                />
            )}


        </button>
        </div>
    );
};



