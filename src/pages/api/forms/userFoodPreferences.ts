import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import verifyRecaptchaEnterprise from '../verifyRecaptchaEnterprise';
import { getEmailFromCookies } from '../getEmailFromCookies';
import { VarChar } from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Db connection
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }
  
    const {
      recaptchaToken,
      food_preferences
    } = req.body;

    if (
      !recaptchaToken
      || !food_preferences
    ) {
      return res.status(400).json({
        notification: { type: "error", message: "Faltan datos requeridos." },
      });
    }
  
    // Validar reCAPTCHA (posible cuello de botella)
    const isHuman = await verifyRecaptchaEnterprise(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Validación reCAPTCHA fallida. Intenta de nuevo.",
        },
      });
    }

    const userEmail = getEmailFromCookies(req, res);
    if (!userEmail) {
      return res.status(400).json({ redirectUrl: "/email" });
    }

    try {
      const pool = await connectToDatabase();
      await pool
        .request()
        // !TODO: Check if these fields are going to be optional or required:
        .input("food_preferences", VarChar(50), food_preferences)
        .input("email", VarChar(100), userEmail)
        .query(`
          UPDATE Applicant_details
          SET food_preferences = @food_preferences
          WHERE institutional_email = @email
        `);
  
      return res.status(200).json({
        notification: {
          type: "info",
          message: "Tus datos han sido guardados correctamente",
        },
        redirectUrl: "/confirmation/individual/final",
      });
    } catch(error) {
      console.error("❌ Error al guardar los datos:", error);
      return res.status(500).json({
        notification: {
          type: "error",
          message: "Error al guardar los datos",
        },
      });
    }

  } catch (error) {
    res.status(500).json({ error: "Error conectando a la base de datos" });
  }
}
