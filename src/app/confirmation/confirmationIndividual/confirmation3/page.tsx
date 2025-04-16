"use client"

import { useState } from "react";
import { Header } from "@/app/components/Header"
import { Footer } from "@/app/components/Footer"
import { Button } from "@/app/components/UI/Button"
import { Select } from "@/app/components/forms/registration/individual/questions"

export default function Confirmation3() {
  const [test, setTest] = useState("");


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

        <div className="w-80 mb-6">
          <Select
            label="Universidad"
            name="test"
            value={test}
            onChange={setTest}
            options={[
              "Administrador",
              "Diseñador",
              "Mercadeo",
              "Desarrollador",
            ]}
          />
        </div>

        <Button label="Siguiente" />

        <Footer />
      </form>
    </div>
  )
}