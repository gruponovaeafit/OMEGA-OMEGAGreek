// pages/api/saveDateAvailability.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import { Bit, VarChar } from "mssql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { date_availability } = req.body;
  const email = getEmailFromCookies(req, res);

  if (!email) {
    return res.status(401).json({
      notification: { type: "error", message: "No autenticado." },
      redirectUrl: "/",
    });
  }

  try {
    const pool = await connectToDatabase();

    // Verificar si ya existe un registro para ese email
    const checkResult = await pool.request()
      .input("email", VarChar(255), email)
      .query("SELECT COUNT(*) AS count FROM APPLICANT_DETAILS WHERE institutional_email = @email");

    const exists = checkResult.recordset[0].count > 0;

    if (exists) {
      // Actualiza si ya existe
      await pool.request()
        .input("date_availability", Bit, date_availability)
        .input("email", VarChar(255), email)
        .query(`
          UPDATE APPLICANT_DETAILS
          SET date_availability = @date_availability
          WHERE institutional_email = @email
        `);
    } else {
      // Inserta si no existe
      await pool.request()
        .input("email", VarChar(255), email)
        .input("date_availability", Bit, date_availability)
        .query(`
          INSERT INTO APPLICANT_DETAILS (institutional_email, date_availability)
          VALUES (@email, @date_availability)
        `);
    }

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Disponibilidad guardada exitosamente.",
      },
      redirectUrl: "/confirmation/individual/view2",
    });

  } catch (err) {
    console.error("❌ Error al guardar disponibilidad:", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al guardar disponibilidad.",
      },
    });
  }
}
