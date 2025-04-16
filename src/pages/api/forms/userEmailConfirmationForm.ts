import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import verifyRecaptchaEnterprise from "../verifyRecaptchaEnterprise";
import sql from "mssql";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

// recatchap validar que este autorizado para esta vista
// validar que el correo ya haya sido registrado
// crear las cookies y almacenar el correo en el jwt

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Db connection
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    //Validate that the email and captcha is not empty
    const { institutional_email, recaptchaToken } = req.body;
    if (!institutional_email || !recaptchaToken) {
      return res.status(400).json({
        notification: { type: "error", message: "Faltan datos requeridos." },
      });
    }

    const emailLower = institutional_email.toLowerCase();

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

    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input("institutional_email", sql.VarChar, emailLower)
      .query(
        "SELECT * FROM Personal_data WHERE institutional_email = @institutional_email",
      );

    if (result.recordset.length === 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El correo no ha sido registrado.",
        },
      });
    }

    // Generar JWT
    const jwtToken = jwt.sign(
      { email: emailLower },
      process.env.JWT_KEY as string,
      {
        expiresIn: "20m",
      },
    );

    // Generate cookies and store JWT in it
    res.setHeader(
      "Set-Cookie",
      serialize("jwtToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600,
        path: "/",
        sameSite: "strict",
      }),
    );

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Correo electrónico guardado correctamente.",
      },
      redirectUrl: "/confirmation",
    });
  } catch (error) {
    console.error("Error en la conexión a la base de datos:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error en la conexión a la base de datos.",
      },
    });
  }
}
