"use client";

import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import FormHeader from "@/app/components/UI/FormHeader";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { map } from "mssql";

export default function View2() {
  const router = useRouter();

  // Verificación continua del JWT
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        router.push("/");
      }
    };

    checkAuthentication();
    const interval = setInterval(checkAuthentication, 15000);
    return () => clearInterval(interval);
  }, [router]);

  const checkUserStatus = async () => {
    try {
      const res = await fetch("/api/forms/userCheckStatusConfirmation", {
        method: "GET",
      });
      const result = await res.json();

      if (res.ok && result.redirectUrl) {
        router.push(result.redirectUrl);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error al verificar estado del usuario:", error);
      return true;
    }
  };

  const [formData, setFormData] = useState({
    university: "",
    study_area: "",
    career: "",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleFormSubmit = async (
    name: string,
    value: string,
    name1: string,
    value1: string,
    name2: string,
    value2: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [name1]: value1,
      [name2]: value2,
    }));
    console.log("Form data:", formData, "Checkbox checked:", isChecked);

    try {
      const response = await fetch("/api/forms/userAcademicForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [name]: value,
          [name1]: value1,
          [name2]: value2,
          data_treatment: isChecked,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      console.log("Respuesta de la API:", result);
      console.log();
      toast.success(
        result.notification?.message || "Formulario enviado con éxito.",
        {
          onClose: () =>
            router.push(result.redirectUrl || "/confirmation/individual/view3"),
        },
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
      );
    }
  };

  // Enviamos el correo y obtenemos la lista de areas
  const handleChange = async (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      const response = await fetch("/api/forms/userAcademicForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [name]: value }),
      });

      if (!response.ok) {
        console.error("Error al enviar el valor:", await response.text());
        return;
      }
      console.log("Valor enviado:", name, value);
      const result = await response.json();
      console.log("Respuesta de la API:", result.study_area);
      return result.study_area;
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  // Enviamos el correo y la area y obtenemos la lista de carreras
  const handleChange2 = async (
    name: string,
    value: string,
    name1: string,
    value1: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [name1]: value1,
    }));

    try {
      const response = await fetch("/api/forms/userAcademicForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [name]: value, [name1]: value1 }),
      });

      if (!response.ok) {
        console.error("Error al enviar el valor:", await response.text());
        return;
      }
      console.log("Valor enviado:", name, value, name1, value1);
      const result = await response.json();
      console.log("Respuesta de la API:", result.careers);
      return result.careers;
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  // Enviamos el correo, la area y la carrera y obtenemos el id de la carrera y el id del area
  const handleChange3 = async (
    name: string,
    value: string,
    name1: string,
    value1: string,
    name2: string,
    value2: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [name1]: value1,
      [name2]: value2,
    }));

    try {
      const response = await fetch("/api/forms/userAcademicForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [name]: value,
          [name1]: value1,
          [name2]: value2,
        }),
      });

      if (!response.ok) {
        console.error("Error al enviar el valor:", await response.text());
        return;
      }
      console.log("Valor enviado:", name, value, name1, value1, name2, value2);
      const result = await response.json();
      console.log("Respuesta de la API:", result.careers_id);
      return result.careers_id, result.study_area_id;
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const [studyAreaResult, setStudyAreaResult] = useState<string[] | null>(null);
  const [careerResult, setcareerResult] = useState<string[] | null>(null);
  const [careerIdResult, setcareerIdResult] = useState<string[] | null>(null);
  const [studyAreaIdResult, setstudyAreaIdResult] = useState<string | null>(
    null,
  );
  const university = formData.university;
  const studyArea = formData.study_area;

  return (
    //submit con los datos previamente guardados en el estado correspondiente
    <div className="h-screen flex flex-col">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleFormSubmit(
            "university",
            university,
            "study_area",
            studyAreaIdResult ? studyAreaIdResult[0] : "",
            "career",
            careerIdResult ? careerIdResult[0] : "",
          );
        }}
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
            onChange={async (val) => {
              const result = await handleChange("university", val); //utilizamos el handleChange para obtener las areas
              if (result && Array.isArray(result)) {
                setStudyAreaResult(result); // Guarda el array completo en el estado
              }
            }}
            options={[
              "Universidad Nacional",
              "Universidad de Antioquia",
              "Instituto Tecnologico Metropolitano",
              "Universidad Pontificia Bolivariana",
              "Institucion Universitaria Pascual Bravo",
              "Institucion Universitaria Salazar y Herrera",
              "Universidad EAFIT",
            ]}
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu área de estudio"
            label="Área de estudio"
            name="study_area"
            value={formData.study_area}
            onChange={async (val) => {
              const result = await handleChange2(
                "university",
                university,
                "study_area",
                val,
              ); //utilizamos el handleChange2 para obtener las carreras
              if (result && Array.isArray(result)) {
                setcareerResult(result); // Guarda el array completo en el estado
                console.log("Áreas de estudio disponibles:", result);
              }
            }}
            options={
              studyAreaResult
                ? studyAreaResult.map((area) => area) //mapeamos las opciones
                : []
            }
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu programa académico"
            label="Programa académico"
            name="career"
            value={formData.career}
            onChange={async (val) => {
              const result = await handleChange3(
                "university",
                university,
                "study_area",
                studyArea,
                "career",
                val,
              ); //utilizamos el handleChange3 para obtener el id de la carrera y el id del area
              if (result && Array.isArray(result)) {
                setcareerIdResult(result[0]); // Guarda el array completo en el estado
                setstudyAreaIdResult(result[1]); // Guarda el array completo en el estado
              }
            }}
            options={
              careerResult
                ? careerResult.map((carrera) => carrera) //mapeamos las opciones
                : []
            }
          />
        </div>

        <CheckboxButtonIndividual onChange={handleCheckboxChange} />

        <div className="flex flex-wrap justify-center items-center gap-4 w-full max-w-[320px]">
          <img src="/Hefesto.svg" alt="Hefesto" className="w-42 h-44" />
          <Button label="Siguiente" type="submit" />
        </div>
        <Footer />
      </form>
    </div>
  );
}
