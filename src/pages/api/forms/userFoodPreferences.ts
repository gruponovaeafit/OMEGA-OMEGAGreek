import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import { VarChar } from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { food_preferences } = req.body;
  const email = getEmailFromCookies(req, res);

  if (!email) {
    return res.status(401).json({
      notification: { type: "error", message: "No autenticado." },
      redirectUrl: "/",
    });
  }

  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("email", VarChar(255), email)
      .input("food_preferences", VarChar(255), food_preferences).query(`
        UPDATE APPLICANT_DETAILS
        SET food_preferences = @food_preferences
        WHERE institutional_email = @email
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Preferencia alimentaria guardada.",
      },
      redirectUrl: "/confirmation/teams/send",
    });
  } catch (err) {
    console.error("❌ Error al guardar preferencia alimentaria:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al guardar datos.",
      },
    });
  }
}
