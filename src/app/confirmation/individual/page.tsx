"use client"

import { Footer } from "@/app/components/Footer";
import { YesNoQuestion } from "@/app/components/forms/registration/individual/questions";
import { Header } from "@/app/components/Header";
import { Button } from "@/app/components/UI/Button";
import FormHeader from "@/app/components/UI/FormHeader";
import FormStaticAlert from "@/app/components/UI/FormStaticAlert";
import { useState } from "react";

export default function View1() {
  const [dateAvailability, setDateAvailability] = useState<boolean | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            title="Formulario de confirmación"
          />
        </div>
        <div className="w-full max-w-[320px] mt-10">
          <FormStaticAlert iconName="owl">
            <p className="text-xl text-center">El evento se llevará a cabo a partir del sábado <strong>26 de abril a las 11:00 a.m.</strong> hasta el domingo <strong>27 de abril a las 6:00 p.m.</strong></p>
          </FormStaticAlert>
        </div>
        <div className="mt-5">
          <YesNoQuestion
            name="date_availability"
            question="¿Estás disponible para asistir al evento?"
            value={dateAvailability}
            onChange={setDateAvailability}
          >
            <span className="text-xs text-gray-200 block text-center max-w-[85%] mx-auto mb-5">
              *Recuerda que en ese lapso de tiempo no podrás salir del lugar donde se llevará a cabo el evento <strong>(Universidad EAFIT)</strong>
            </span>
          </YesNoQuestion>
        </div>
        <Button label="Siguiente" />
        <Footer />
      </form>
    </div>
  );
}