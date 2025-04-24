"use client"

import { Footer } from "@/app/components/Footer";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import { Select, TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { Header } from "@/app/components/Header";
import { Button } from "@/app/components/UI/Button";
import FormHeader from "@/app/components/UI/FormHeader";
import { useState } from "react";

export default function Confirmation2Page() {
  const [formData, setFormData] = useState({
    city: "",
    neighborhood: "",
    gender: "",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleFormSubmit = (data: unknown) => {
  }

  const handleChangeGender = (data: unknown) => {
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      <form
        onSubmit={handleFormSubmit}
        className="background_individual_view2 flex-1 flex flex-col items-center gap-2"
      >
        <Header />

        <div className="w-full max-w-[320px] mb-6">
          <FormHeader title="Datos geográficos" />
        </div>
        <div className="w-full max-w-[320px]">
          <TextQuestion
            question="¿En qué ciudad vives?"
            questionLabelId="city"
            name="city"
            value={formData.city}
            onChange={(val) => handleChange("city", val)}
            placeholder="Escribe la ciudad en la que vives"
          />
        </div>
        <div className="w-full max-w-[320px]">
          <TextQuestion
            question="¿En qué barrio vives?"
            questionLabelId="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={(val) => handleChange("neighborhood", val)}
            placeholder="Escribe el barrio en el que vives"
          />
        </div>
        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Género"
            label="Género"
            name="gender"
            value={formData.gender}
            onChange={handleChangeGender}
            options={[
              "Masculino",
              "Femenino",
              "Otro",
            ]}
          />
        </div>

        <CheckboxButtonIndividual
          onChange={(checked) => setIsChecked(checked)}
        />

        <div className="flex flex-wrap justify-center items-center gap-4 w-full max-w-[320px]">
          <img src="/Zeus.svg" alt="Hefesto" className="w-42 h-44" />
          <Button label="Siguiente" type="submit" variant="secondary" />
        </div>

        <Footer />
      </form>
    </div>
  );
}
