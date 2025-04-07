import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      notification: { type: "error", message: "El método no es permitido" },
    });
  }

  try {
    const { phone, how_did_hear, previous_participation, has_time, semester } =
      req.body;

    // Validaciones básicas de campos requeridos
    if (
      !phone ||
      !how_did_hear ||
      semester === undefined ||
      previous_participation === null ||
      has_time === null
    ) {
      return res.status(400).json({
        notification: { type: "error", message: "Faltan datos requeridos" },
        incompleteFields: {
          phone,
          how_did_hear,
          semester,
          previous_participation,
          has_time,
        },
      });
    }

    // Validar semestre entre 0 y 12
    const semesterInt = parseInt(semester);
    if (isNaN(semesterInt) || semesterInt < 1 || semesterInt > 12) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El semestre debe estar entre 1 y 12",
        },
      });
    }

    // Validar celular colombiano: 10 dígitos, empieza en 3
    const phoneRegex = /^3\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        notification: {
          type: "error",
          message:
            "El número de celular debe tener 10 dígitos y comenzar con 3",
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

    const pool = await connectToDatabase();

    await pool
      .request()
      .input("phone", sql.VarChar(20), phone)
      .input("how_did_hear", sql.VarChar(255), how_did_hear)
      .input("previous_participation", sql.Bit, Boolean(previous_participation))
      .input("has_time", sql.Bit, Boolean(has_time))
      .input("semester", sql.Int, semesterInt)
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
