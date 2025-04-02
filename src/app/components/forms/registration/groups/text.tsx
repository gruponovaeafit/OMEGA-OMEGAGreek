"use client";
import React from "react";

interface TextConfirmationProps {
    text: string;
}

// Componente 
export const TextConfirmationTeamRegistration: React.FC<TextConfirmationProps> = ({ text }) => {
    return (
        <div>
            <h1 className="text-4xl font-bold">{text}</h1> 
        </div>
    );
}

//Componente 
export const TextButtonTeam: React.FC<TextConfirmationProps> = ({ text }) => {
    return (
        <div>
            <h1>{text}</h1> 
        </div>
    );
}