"use client"

import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/UI/Button";
import { Select, TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import FormHeader from "@/app/components/UI/FormHeader";

export default function Confirmation3() {
  const [formData, setFormData] = useState({
    eps: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    relationship: "",
    medical_info: ""
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data:", formData, "Checkbox checked:", isChecked);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <div className="h-screen flex flex-col">
      <form
        onSubmit={handleFormSubmit}
        className="background_individual_view2 flex-1 flex flex-col items-center gap-2"
      >
        <Header />

        <div className="w-full max-w-[320px] mb-6">
          <FormHeader
            title="Preguntas médicas"
            note="*Estas son muy importantes para garantizar tu bienestar durante el evento"
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu EPS"
            label="EPS"
            name="eps"
            value={formData.eps}
            onChange={(val) => handleChange("eps", val)}
            options={["Administrador", "Diseñador", "Mercadeo", "Desarrollador"]}
          />
        </div>

        <TextQuestion
          question="Nombre contacto de emergencia"
          questionLabelId="emergency_contact_name"
          name="emergency_contact_name"
          value={formData.emergency_contact_name}
          onChange={(val) => handleChange("emergency_contact_name", val)}
          placeholder="Escribe el nombre de tu contacto"
        />

        <TextQuestion
          question="Número celular del contacto de emergencia"
          questionLabelId="emergency_contact_phone"
          name="emergency_contact_phone"
          value={formData.emergency_contact_phone}
          onChange={(val) => handleChange("emergency_contact_phone", val)}
          placeholder="Escribe el número de tu contacto"
        />

        <TextQuestion
          question="Tu relación con el contacto de emergencia"
          questionLabelId="relationship"
          name="relationship"
          value={formData.relationship}
          onChange={(val) => handleChange("relationship", val)}
          placeholder="Escribe el parentesco con tu contacto"
        />

        <TextQuestion
          question="Información médica relevante"
          questionLabelId="medical_info"
          name="medical_info"
          value={formData.medical_info}
          onChange={(val) => handleChange("medical_info", val)}
          placeholder="Escríbelas aquí en caso de que aplique"
        />

        <div className="flex flex-wrap justify-center items-center gap-4 px-4">
          <img
            src="/Afrodita.svg"
            alt="Afrodita"
            className="w-48 h-48"
          />
          <Button label="Siguiente" />
        </div>

        <Footer />
      </form>
    </div>
  );
}
