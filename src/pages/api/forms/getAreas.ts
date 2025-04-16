import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Int } from "mssql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { university } = req.body;

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
  if (!universityId) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "Universidad inválida o faltante.",
      },
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input("university", Int, universityId)
      .query(`SELECT id, area_name FROM Areas WHERE university = @university`);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Áreas obtenidas correctamente.",
      },
      areas: result.recordset,
    });

  } catch (error) {
    console.error("❌ Error al obtener áreas:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al obtener áreas.",
      },
    });
  }
}
