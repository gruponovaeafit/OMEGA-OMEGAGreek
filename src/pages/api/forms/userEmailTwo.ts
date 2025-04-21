import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import verifyRecaptchaEnterprise from "../verifyRecaptchaEnterprise";
import emailChecker from "../emailCheker";
import sql from "mssql";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

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

  // Validar reCAPTCHA
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

    // Verificar si ya existe
    const result = await pool
      .request()
      .input("email", sql.VarChar, emailLower)
      .query("SELECT * FROM Personal_data WHERE institutional_email = @email");

    const userExists = result.recordset.length > 0;
    const userData = result.recordset?.[0] || {};

    // Generar JWT
    const jwtKey = process.env.JWT_KEY;
    if (!jwtKey) {
      return res.status(500).json({
        notification: {
          type: "error",
          message: "JWT_KEY no configurado en el servidor.",
        },
      });
    }

    const jwtToken = jwt.sign({ email: emailLower }, jwtKey, {
      expiresIn: "20m",
    });

    // Guardar JWT en cookie
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

    // Si no existe → insertar y redirigir a formulario
    if (!userExists) {
      await pool
        .request()
        .input("email", sql.VarChar, emailLower)
        .query("INSERT INTO Personal_data (institutional_email) VALUES (@email)");

      return res.status(200).json({
        notification: {
          type: "info",
          message: "Correo registrado. Completa el formulario.",
        },
        redirectUrl: "/registration",
      });
    }

    // Validar si hay campos incompletos
    const requiredFields = [
      "preferred_role_1",
      "preferred_role_2",
      "name",
      "surname",
      "id_number",
      "phone",
      "birth_date",
      "how_did_hear",
      "has_time",
      "previous_participation",
      "data_treatment",
      "semester",
    ];

    const hasIncompleteData = requiredFields.some((field) => {
      const value = userData[field];
      return (
        !Object.prototype.hasOwnProperty.call(userData, field) ||
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
      );
    });

    if (hasIncompleteData) {
      return res.status(200).json({
        notification: {
          type: "info",
          message: "Faltan datos por completar. Serás redirigido al formulario.",
        },
        redirectUrl: "/registration",
      });
    } else {
      return res.status(200).json({
        notification: {
          type: "success",
          message: "Correo electrónico validado correctamente.",
        },
        redirectUrl: "/confirmation",
      });
    }
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
