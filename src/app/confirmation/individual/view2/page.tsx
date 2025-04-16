"use client";

import { useState, useEffect, FormEvent } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/UI/Button";
import { Select } from "@/app/components/forms/registration/individual/questions";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import FormHeader from "@/app/components/UI/FormHeader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface StudyArea {
  id: number;
  area_name: string;
}

interface Career {
  id: number;
  career_name: string;
}

export default function View2() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch("/api/cookiesChecker", { method: "GET" });
        if (res.status !== 200) router.push("/");
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        router.push("/");
      }
    };

    checkAuthentication();
    const interval = setInterval(checkAuthentication, 15000);
    return () => clearInterval(interval);
  }, [router]);

  const [formData, setFormData] = useState({
    university: "",
    study_area: "",
    career: "",
  });

  const [studyAreas, setStudyAreas] = useState<StudyArea[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [studyAreaId, setStudyAreaId] = useState<number | null>(null);
  const [careerId, setCareerId] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleChangeUniversity = async (university: string) => {
    setFormData((prev) => ({
      ...prev,
      university,
      study_area: "",
      career: "",
    }));
    setCareers([]);
    setStudyAreaId(null);
    setCareerId(null);

    try {
      const response = await fetch("/api/forms/getAreas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university }),
      });

      const result = await response.json();
      if (response.ok && Array.isArray(result.areas))
        setStudyAreas(result.areas);
      else toast.error(result.notification?.message);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
    }
  };

  const handleChangeStudyArea = async (areaName: string) => {
    const selected = studyAreas.find((a) => a.area_name === areaName);
    if (!selected) return;

    setFormData((prev) => ({ ...prev, study_area: areaName, career: "" }));
    setStudyAreaId(selected.id);
    setCareerId(null);

    try {
      const response = await fetch("/api/forms/getCareers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ study_area_id: selected.id }),
      });

      const result = await response.json();
      if (response.ok && Array.isArray(result.careers))
        setCareers(result.careers);
      else toast.error(result.notification?.message);
    } catch (error) {
      console.error("Error al obtener carreras:", error);
    }
  };

  const handleChangeCareer = (careerName: string) => {
    const selected = careers.find((c) => c.career_name === careerName);
    if (!selected) return;
    setFormData((prev) => ({ ...prev, career: careerName }));
    setCareerId(selected.id);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/forms/saveApplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: formData.university,
          study_area_id: studyAreaId,
          career_id: careerId,
          data_treatment: isChecked ? 1 : 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      toast.success(result.notification?.message, {
        onClose: () =>
          router.push(result.redirectUrl || "/confirmation/individual/view3"),
      });
    } catch (error) {
      console.error("Error al guardar datos:", error);
      toast.error("Error interno al guardar los datos.");
    }
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
            onChange={handleChangeUniversity}
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
            onChange={handleChangeStudyArea}
            options={studyAreas.map((a) => a.area_name)}
          />
        </div>

        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Selecciona tu programa académico"
            label="Programa académico"
            name="career"
            value={formData.career}
            onChange={handleChangeCareer}
            options={careers.map((c) => c.career_name)}
          />
        </div>

        <CheckboxButtonIndividual
          onChange={(checked) => setIsChecked(checked)}
        />

        <div className="flex flex-wrap justify-center items-center gap-4 w-full max-w-[320px]">
          <img src="/Hefesto.svg" alt="Hefesto" className="w-42 h-44" />
          <Button label="Siguiente" type="submit" />
        </div>

        <Footer />
      </form>
    </div>
  );
}
