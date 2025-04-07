import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

// Función robusta para convertir a booleano
function parseBoolean(value: any): boolean {
  return (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1" ||
    value === "on"
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        notification: {
          type: "error",
          message: "El método no es permitido",
        },
      });
    }

    const pool = await connectToDatabase();

    // Extraer datos del cuerpo del formulario
    const { phone, how_did_hear, previous_participation, has_time, semester } =
      req.body;

    // Validación básica
    if (
      !phone ||
      !how_did_hear ||
      semester === undefined ||
      previous_participation === null ||
      has_time === null
    ) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Faltan datos requeridos",
        },
        status: 400,
        incompleteFields: {
          phone,
          how_did_hear,
          semester,
          previous_participation,
          has_time,
        },
      });
    }

    const userEmail = getEmailFromCookies(req, res);
    if (!userEmail) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "No se pudo obtener el correo desde las cookies",
        },
        redirectUrl: "/email",
      });
    }

    console.log("Correo desde cookie:", userEmail);
    console.log(
      "✅ has_participated:",
      previous_participation,
      "→",
      parseBoolean(previous_participation),
    );
    console.log("✅ has_time:", has_time, "→", parseBoolean(has_time));

    await pool
      .request()
      .input("phone", sql.VarChar(20), phone)
      .input("how_did_hear", sql.VarChar(255), how_did_hear)
      .input(
        "previous_participation",
        sql.Bit,
        parseBoolean(previous_participation),
      )
      .input("has_time", sql.Bit, parseBoolean(has_time))
      .input("semester", sql.Int, parseInt(semester))
      .input("email", sql.VarChar(255), userEmail).query(`
        UPDATE Personal_data
        SET phone = @phone,
            how_did_hear = @how_did_hear,
            previous_participation = @previous_participation,
            has_time = @has_time,
            semester = @semester
        WHERE institutional_email = @email
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Tus datos han sido guardados correctamente",
      },
      redirectUrl: "/registration/individual/final",
    });
  } catch (error) {
    console.error("❌ Error al procesar la solicitud:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error en el servidor al guardar los datos",
      },
    });
  }
}
