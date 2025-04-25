import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const pool = await connectToDatabase();
    const cities = await pool
      .request()
      .query(`SELECT id, city FROM CITIES`);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "",
      },
      cities: cities.recordset,
    });
  } catch (error) {
    console.error("❌ Error al obtener ciudades:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al obtener ciudades.",
      },
    });
  }
}
