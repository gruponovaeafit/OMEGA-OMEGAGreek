"use client"

import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import FormHeader from "@/app/components/UI/FormHeader";

export default function Confirmation3() {
  const [formData, setFormData] = useState({
    university: "",
    study_area: "",
    career: "",
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
          <FormHeader title="Formulario de confirmación" />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu universidad"
            label="Universidad"
            name="university"
            value={formData.university}
            onChange={(val) => handleChange("university", val)}
            options={["Administrador", "Diseñador", "Mercadeo", "Desarrollador"]}
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu área de estudio"
            label="Área de estudio"
            name="study_area"
            value={formData.study_area}
            onChange={(val) => handleChange("study_area", val)}
            options={["Administrador", "Diseñador", "Mercadeo", "Desarrollador"]}
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu programa académico"
            label="Programa académico"
            name="career"
            value={formData.career}
            onChange={(val) => handleChange("career", val)}
            options={["Administrador", "Diseñador", "Mercadeo", "Desarrollador"]}
          />
        </div>

        <CheckboxButtonIndividual onChange={handleCheckboxChange} />

        <div className="flex flex-wrap justify-center items-center gap-4 px-4">
          <img
            src="/Hefesto.svg"
            alt="Hefesto"
            className="w-48 h-48"
          />
          <Button label="Siguiente" />
        </div>

        <Footer />
      </form>
    </div>
  );
}
