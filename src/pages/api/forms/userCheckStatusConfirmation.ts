import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

const isNotNullOrUndefined = (val: any) => val !== null && val !== undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const email = getEmailFromCookies(req, res);
    if (!email) return res.status(200).json({ redirectUrl: "/email" });

    const pool = await connectToDatabase();
    const { recordset } = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Personal_data WHERE institutional_email = @email");

    const user = recordset[0];
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const isFilled = (fields: any[]) => fields.every(isNotNullOrUndefined);

    const f1 = isFilled([
      user.teamName
    ]);
    const f2 = isFilled([user.preferred_role_1, user.preferred_role_2]);
    const f3 = isFilled([
      user.university,
      user.study_area,
      user.career
    ]);

    let redirectUrl = null;

    if (!f1) {
      redirectUrl = "/confirmation/confirmation1";
    } else if (!f2) {
      redirectUrl = "/confirmation/confirmation2";
    } else if (!f3) {
      redirectUrl = "/confirmation/confirmation3";
    } else {
      redirectUrl = "/registration/individual/final";
    }

    return res.status(200).json({ redirectUrl });
  } catch (error) {
    console.error("❌ Error al verificar estado del usuario:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}