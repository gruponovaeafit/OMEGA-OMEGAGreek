import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import verifyRecaptchaEnterprise from "../verifyRecaptchaEnterprise";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Db connection
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const { date_availability } = req.body;

    if (!date_availability) {
      return res.status(400).json({
        notification: { type: "error", message: "Faltan datos requeridos." },
      });
    }

    // Validar reCAPTCHA (posible cuello de botella)
    // const isHuman = await verifyRecaptchaEnterprise(recaptchaToken);
    // if (!isHuman) {
    // return res.status(400).json({
    //     notification: {
    //     type: "error",
    //     message: "Validación reCAPTCHA fallida. Intenta de nuevo.",
    //     },
    // });
    // }

    const userEmail = getEmailFromCookies(req, res);
    if (!userEmail) {
        return res.status(400).json({
        notification: {
            type: "error",
            message: "No se pudo obtener el correo desde las cookies",
        },
        redirectUrl: "/",
        });
    }

    try {
        const pool = await connectToDatabase();

        const result = await pool
        .request()
        .input("date_availability", sql.TinyInt, date_availability)
        .input("email", sql.VarChar, userEmail)
        .query(`
            UPDATE Applicant_details
            SET date_availability = @date_availability
            WHERE institutional_email = @email"
        `);

    return res.status(200).json({
        notification: {
            type: "success",
            message: "Tus datos han sido guardados correctamente",
        },
        redirectUrl: "/userAcademicForm",
        });
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res.status(500).json({
            notification: {
                type: "error",
                message: "Error al actualizar los datos del usuario.",
            },
        });
    }
    } catch (error) {
    res.status(500).json({ error: "Error conectando a la base de datos" });
  }
}