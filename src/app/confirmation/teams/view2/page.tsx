"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { Button } from "@/app/components/UI/Button";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import {
  Select,
  TextQuestion,
} from "@/app/components/forms/registration/individual/questions";

export default function Home() {
  const router = useRouter();

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

  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderRol, setLeaderRol] = useState("Seleccione Rol");

  const [email2, setEmail2] = useState("");
  const [rol2, setRol2] = useState("Seleccione Rol");

  const [email3, setEmail3] = useState("");
  const [rol3, setRol3] = useState("Seleccione Rol");

  const [email4, setEmail4] = useState("");
  const [rol4, setRol4] = useState("Seleccione Rol");

  const [email5, setEmail5] = useState("");
  const [rol5, setRol5] = useState("Seleccione Rol");

  const [email6, setEmail6] = useState("");
  const [rol6, setRol6] = useState("Seleccione Rol");

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/forms/teamRolesConfirmationForm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const result = await response.json();
        console.log("➡️ Datos del backend:", result);

        if (response.ok && result.teamEmails && result.teamRoles) {
          setLeaderEmail(result.teamEmails[0] || "");
          setLeaderRol(result.teamRoles[0] || "Seleccione Rol");

          setEmail2(result.teamEmails[1] || "");
          setRol2(result.teamRoles[1] || "Seleccione Rol");

          setEmail3(result.teamEmails[2] || "");
          setRol3(result.teamRoles[2] || "Seleccione Rol");

          setEmail4(result.teamEmails[3] || "");
          setRol4(result.teamRoles[3] || "Seleccione Rol");

          setEmail5(result.teamEmails[4] || "");
          setRol5(result.teamRoles[4] || "Seleccione Rol");

          setEmail6(result.teamEmails[5] || "");
          setRol6(result.teamRoles[5] || "Seleccione Rol");
        }
      } catch (error) {
        console.error("Error al cargar miembros existentes:", error);
      }
    };

    fetchTeamData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formObject = {
      leader_email: leaderEmail === "" ? null : leaderEmail,
      leader_rol: leaderRol === "Seleccione Rol" ? null : leaderRol,
      member2_email: email2 === "" ? null : email2,
      member2_rol: rol2 === "Seleccione Rol" ? null : rol2,
      member3_email: email3 === "" ? null : email3,
      member3_rol: rol3 === "Seleccione Rol" ? null : rol3,
      member4_email: email4 === "" ? null : email4,
      member4_rol: rol4 === "Seleccione Rol" ? null : rol4,
      member5_email: email5 === "" ? null : email5,
      member5_rol: rol5 === "Seleccione Rol" ? null : rol5,
      member6_email: email6 === "" ? null : email6,
      member6_rol: rol6 === "Seleccione Rol" ? null : rol6,
    };

    try {
      const response = await fetch("/api/forms/teamRolesConfirmationForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();
      console.log("➡️ Datos del backend:", result);

      if (!response.ok) {
        toast.error(result.notification?.message || "Error en el servidor.");
        return;
      }

      toast.success(
        result.notification?.message || "Formulario enviado con éxito.",
        {
          onClose: () =>
            router.push(result.redirectUrl || "/confirmation/teams/send"),
        },
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="h-screen flex flex-col">
        <div className="background_individual_view2 flex-1 flex flex-col items-center gap-2">
          <Header />
          <img
            src="/text_confirmacion_grupal.svg"
            alt="Formulario de Confirmacion grupal"
            className="w-72 h-auto"
          />

          <div className="border-b">
            <TextQuestion
              question="Correo del líder"
              value={leaderEmail}
              onChange={setLeaderEmail}
              placeholder="lider@institucion.edu.co"
              name="leader_email"
            />
            <div className="w-80 mb-4 mt-4">
              <Select
                placeholder="Rol del líder"
                label="Rol Líder"
                value={leaderRol}
                onChange={setLeaderRol}
                options={[
                  "Administrador",
                  "Diseñador",
                  "Mercadeo",
                  "Desarrollador",
                ]}
                name="leader_rol"
              />
            </div>
          </div>

          {[2, 3, 4, 5, 6].map((n) => (
            <div className="border-b" key={n}>
              <TextQuestion
                question={`Participante ${n}`}
                value={eval(`email${n}`)}
                onChange={(val) => eval(`setEmail${n}`)(val)}
                placeholder={`participante${n}@institucion.edu.co`}
                name={`member${n}_email`}
              />
              <div className="w-80 mb-6">
                <Select
                  placeholder={`Rol del participante ${n}`}
                  label={`Rol Participante ${n}`}
                  value={eval(`rol${n}`)}
                  onChange={(val) => eval(`setRol${n}`)(val)}
                  options={[
                    "Administrador",
                    "Diseñador",
                    "Mercadeo",
                    "Desarrollador",
                  ]}
                  name={`member${n}_rol`}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center">
            <img
              src="/personajes_teams.svg"
              alt="Personajes Teams"
              className="w-70 h-auto mb-4"
            />
            <Button label="Enviar" type="submit" variant="secondary" />
          </div>
          <Footer />
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
