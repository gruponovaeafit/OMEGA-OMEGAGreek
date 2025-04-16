import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import emailChecker from "../emailCheker";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import sql from "mssql";
import verifyRecaptchaEnterprise from "../verifyRecaptchaEnterprise";

//Validar que esté en la vista de confirmación y redireccionar a los formularios correspondientes


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { institutional_email, recaptchaToken } = req.body;
  if (!institutional_email || !recaptchaToken) {
    return res.status(400).json({
      notification: { type: "error", message: "Faltan datos requeridos." },
    });
  }

  const emailLower = institutional_email.toLowerCase();

  // Validar dominio
  const emailCheckResponse = emailChecker(req, res);
  if (emailCheckResponse !== 200) {
    return res.status(emailCheckResponse).json({
      notification: {
        type: "error",
        message: "El correo no tiene un dominio válido.",
      },
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

  try {
    const pool = await connectToDatabase();

    // Generar JWT
    const jwtToken = jwt.sign(
      { email: emailLower },
      process.env.JWT_KEY as string,
      {
        expiresIn: "20m",
      },
    );
    // Generate Cookies and store JWT in it
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

    const result = await pool
      .request()
      .input("email", sql.VarChar, emailLower)
      .query("SELECT 1 FROM Personal_data WHERE institutional_email = @email");

    if (result.recordset.length === 0) {
      await pool
        .request()
        .input("email", sql.VarChar, emailLower)
        .query(
          "INSERT INTO Personal_data (institutional_email) VALUES (@email)",
        );
    }

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Correo electrónico guardado correctamente.",
      },
      redirectUrl: "/registration",
    });
  } catch (error) {
    console.error("❌ Error en handler:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  }
}
