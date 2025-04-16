import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Int, TinyInt, VarChar } from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { university, study_area_id, career_id, data_treatment } = req.body;

  const universityMap: Record<string, number> = {
    "Universidad Nacional": 1,
    "Universidad de Antioquia": 2,
    "Instituto Tecnologico Metropolitano": 3,
    "Universidad Pontificia Bolivariana": 4,
    "Institucion Universitaria Pascual Bravo": 5,
    "Institucion Universitaria Salazar y Herrera": 6,
    "Universidad EAFIT": 7,
  };

  const universityId = universityMap[university];
  if (
    !universityId ||
    !study_area_id ||
    !career_id ||
    typeof data_treatment === "undefined"
  ) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "Faltan datos requeridos para guardar.",
      },
    });
  }

  const userEmail = getEmailFromCookies(req, res);
  if (!userEmail) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "Usuario no autenticado.",
      },
      redirectUrl: "/",
    });
  }

  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("university", Int, universityId)
      .input("study_area", Int, study_area_id)
      .input("career", Int, career_id)
      .input("data_treatment", TinyInt, data_treatment)
      .input("email", VarChar(255), userEmail).query(`
        UPDATE Applicant_details
        SET university = @university, study_area = @study_area, career = @career, data_treatment = @data_treatment
        WHERE institutional_email = @email
      `);

    return res.status(200).json({
      notification: {
        type: "info",
        message: "Tus datos han sido guardados correctamente.",
      },
      redirectUrl: "/confirmation/individual/view3",
    });
  } catch (error) {
    console.error("❌ Error al guardar datos:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al guardar datos.",
      },
    });
  }
}
