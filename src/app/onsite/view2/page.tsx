"use client"

import { Footer } from "@/app/components/Footer";
import { CheckboxButtonIndividual } from "@/app/components/forms/confirmation/individual/buttons";
import { Select, TextQuestion } from "@/app/components/forms/registration/individual/questions";
import { Header } from "@/app/components/Header";
import { Button } from "@/app/components/UI/Button";
import FormHeader from "@/app/components/UI/FormHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface City {
  id: number;
  city: string;
}

export default function Confirmation2Page() {
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
    city: "",
    neighborhood: "",
    gender: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesId, setCitiesId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/forms/getCities", { method: "POST" });
        if (!res.ok) throw new Error("Error al cargar las ciudades.");
        const result = await res.json();
        setCities(result.cities);
      } catch (error) {
        console.error("Error al cargar las ciudades:", error);
        toast.error("No se pudieron cargar las ciudades.");
      }
    };

    fetchCities();
  }, []);

  const handleFormSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/forms/userOnSiteForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: citiesId,
          neighborhood: formData.neighborhood,
          gender: formData.gender,
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
          router.push(result.redirectUrl || "/onsite/view2"),
      });
    } catch (error) {
      console.error("Error al guardar datos:", error);
      toast.error("Error interno al guardar los datos.");
    }
  }

  const handleChangeCity = (city: string) => {
    const selected = cities.find((a) => a.city === city);
    if (!selected) return;

    setFormData((prev) => ({ ...prev, city: city, career: "" }));
    setCitiesId(selected.id);
  };

  const handleChangeGender = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

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
        <div className="w-full max-w-[320px] mb-6">
          <Select
            placeholder="Ciudad"
            label="¿En qué ciudad vives?"
            name="city"
            value={formData.city}
            onChange={handleChangeCity}
            options={cities.map((a) => a.city)}
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
          <Button label="Enviar" type="submit" variant="secondary" />
        </div>

        <Footer />
      </form>
    </div>
  );
}
