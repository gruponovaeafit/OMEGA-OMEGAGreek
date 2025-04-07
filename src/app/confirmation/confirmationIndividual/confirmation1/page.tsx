"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import QuestionConfirmationText from "@/app/components/forms/confirmation/individual/question";
import { TextConfirmation } from "@/app/components/forms/confirmation/individual/text";
import { SubmitButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";

export default function ParentComponent() {
    const [inputValue, setInputValue] = useState(""); 
    const [isChecked, setIsChecked] = useState(false); 
    const router = useRouter(); 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setIsChecked(checked);
    };

    const handleSubmit = () => {
        if (!inputValue) {
            console.log("Por favor, ingresa un correo electrónico.");
            return;
        }

        if (!isChecked) {
            console.log("Por favor, acepta los términos y condiciones.");
            return;
        }

        console.log("Formulario enviado con éxito:", {
            email: inputValue,
            termsAccepted: isChecked,
        });

        // Redirigir usando useRouter
        router.push('/confirmation/confirmation2');
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center w-full max-w-2xl px-8">
                <TextConfirmation text="Correo Electronico" />
                <QuestionConfirmationText
                    value={inputValue}
                    placeholder="pepito@institucion.edu.co"
                    onChange={handleInputChange}
                />
                <CheckboxButtonIndividual onChange={handleCheckboxChange} />
                <SubmitButtonIndividual onClick={handleSubmit} />
                <img src="https://novaeafit.blob.core.windows.net/omega-2025/POWERED_BY_NOVA.svg" alt="" className="absolute bottom-4" />
            </div>
        </div>
    );
}