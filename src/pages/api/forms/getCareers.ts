import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Int } from "mssql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { study_area_id } = req.body;

  if (!study_area_id) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "Área de estudio requerida.",
      },
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input("area_id", Int, study_area_id)
      .query(`SELECT id, career_name FROM careers WHERE area = @area_id`);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Carreras obtenidas correctamente.",
      },
      careers: result.recordset,
    });

  } catch (error) {
    console.error("❌ Error al obtener carreras:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al obtener carreras.",
      },
    });
  }
}
