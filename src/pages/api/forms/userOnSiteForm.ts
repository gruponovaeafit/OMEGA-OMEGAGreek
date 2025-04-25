import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import { TinyInt, VarChar, Int } from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { city, neighborhood, gender, data_treatment } = req.body;
  console.log("Datos recibidos:", req.body.city, req.body.neighborhood, req.body.gender, req.body.data_treatment);

  if (!city || !neighborhood || !gender || typeof data_treatment === "undefined" ) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "Faltan datos requeridos para guardar.",
      },
    });
  }

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
      .input("city", Int, city)
      .input("neighborhood", VarChar(255), neighborhood)
      .input("gender", VarChar(255), gender)
      .query(`
      UPDATE ONSITE_DATA
      SET city = @city, neighborhood = @neighborhood, gender = @gender
      WHERE institutional_email = @email
      `);

    await pool
      .request()
      .input("email", VarChar(255), email)
      .input("dt", TinyInt, data_treatment)
      .query(`
      UPDATE PERSONAL_DATA
      SET data_treatment = @dt
      WHERE institutional_email = @email
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Datos guardados con éxito.",
      },
      redirectUrl: "/onsite/send",
    });
  } catch (err) {

    console.error("❌ Error al guardar datos OnSite", err);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al guardar datos.",
      },
    });
  }
}