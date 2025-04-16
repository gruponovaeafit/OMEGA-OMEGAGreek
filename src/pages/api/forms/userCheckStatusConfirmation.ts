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
      .query("SELECT * FROM APPLICANT_DETAILS WHERE institutional_email = @email");

    const user = recordset[0];
    if (!user)
      return res.status(200).json({ redirectUrl: "/confirmation/individual" });

    const isFilled = (fields: any[]) => fields.every(isNotNullOrUndefined);

    // Vista 1: disponibilidad
    const f1 = isFilled([user.date_availability]);

    // Vista 2: datos académicos
    const f2 = isFilled([user.university, user.study_area, user.career]);

    // Vista 3: información médica y contacto
    const f3 = isFilled([
      user.eps,
      user.emergency_contact_name,
      user.emergency_contact_phone,
      user.relationship,
      user.medical_info,
    ]);

    // Vista 4: preferencias alimentarias
    const f4 = isFilled([user.food_preferences]);

    let redirectUrl = "";

    if (!f1) {
      redirectUrl = "/confirmation/individual";
    } else if (!f2) {
      redirectUrl = "/confirmation/individual/view2";
    } else if (!f3) {
      redirectUrl = "/confirmation/individual/view3";
    } else if (!f4) {
      redirectUrl = "/confirmation/individual/view4";
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
