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

  const {
    eps,
    emergency_contact_name,
    emergency_contact_phone,
    relationship,
    medical_info,
  } = req.body;

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
      .input("eps", VarChar(255), eps)
      .input("emergency_contact_name", VarChar(255), emergency_contact_name)
      .input("emergency_contact_phone", VarChar(255), emergency_contact_phone)
      .input("relationship", VarChar(255), relationship)
      .input("medical_info", VarChar(255), medical_info).query(`
        UPDATE APPLICANT_DETAILS
        SET
          eps = @eps,
          emergency_contact_name = @emergency_contact_name,
          emergency_contact_phone = @emergency_contact_phone,
          relationship = @relationship,
          medical_info = @medical_info
        WHERE institutional_email = @email
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Información médica guardada correctamente.",
      },
      redirectUrl: "/confirmation/individual/view4",
    });
  } catch (err) {
    console.error("❌ Error al guardar información médica:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al guardar los datos.",
      },
    });
  }
}
