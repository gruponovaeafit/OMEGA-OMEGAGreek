import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

// Validación utilitaria
function isNotNullOrUndefined(value: any) {
  return value !== null && value !== undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const pool = await connectToDatabase();
    const email = getEmailFromCookies(req, res);

    if (!email) {
      return res.status(200).json({ redirectUrl: "/email" });
    }

    const userData = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        "SELECT TOP 1 * FROM Personal_data WHERE institutional_email = @email",
      );

    const userInfo = userData.recordset[0];

    const f1Completado =
      isNotNullOrUndefined(userInfo.name) &&
      isNotNullOrUndefined(userInfo.surname) &&
      isNotNullOrUndefined(userInfo.id_number) &&
      isNotNullOrUndefined(userInfo.birth_date) &&
      isNotNullOrUndefined(userInfo.data_treatment);

    const f2Completado =
      isNotNullOrUndefined(userInfo.preferred_role_1) &&
      isNotNullOrUndefined(userInfo.preferred_role_2);

    const f3Completado =
      isNotNullOrUndefined(userInfo.how_did_hear) &&
      isNotNullOrUndefined(userInfo.has_time) &&
      isNotNullOrUndefined(userInfo.phone) &&
      isNotNullOrUndefined(userInfo.previous_participation);

    if (f1Completado && f2Completado && f3Completado) {
      return res.status(200).json({
        redirectUrl: "/registration/individual/final",
      });
    }

    return res.status(200).json({}); // No redirige, usuario puede seguir
  } catch (error) {
    console.error("Error al verificar estado del usuario:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}
