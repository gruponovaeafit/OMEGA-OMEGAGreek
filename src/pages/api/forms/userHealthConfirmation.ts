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
      eps,
      emergency_contact_name,
      emergency_contact_phone,
      relationship
    } = req.body;

    if (
      !recaptchaToken
      // || !eps
      // || !emergency_contact_name
      // || !emergency_contact_phone
      // || !relationship
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
        .input("eps", VarChar(50), eps)
        .input("emergency_contact_name", VarChar(100), emergency_contact_name)
        .input("relationship", VarChar(20), relationship)
        .input("email", VarChar(100), userEmail)
        .input("emergency_contact_phone", VarChar(20), emergency_contact_phone).query(`
          UPDATE Applicant_details
          SET eps = @eps, emergency_contact_phone = @emergency_contact_phone,
          relationship = @relationship, emergency_contact_name = @emergency_contact_name
          WHERE institutional_email = @email
        `);
  
      return res.status(200).json({
        notification: {
          type: "info",
          message: "Tus datos han sido guardados correctamente",
        },
        redirectUrl: "/confirmation/individual/view4",
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
