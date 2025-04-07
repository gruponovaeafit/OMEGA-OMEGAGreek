import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import emailChecker from "../emailCheker";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import sql from "mssql";

async function verifyRecaptchaEnterprise(token: string): Promise<boolean> {
  const apiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const proyect = process.env.RECAPTCHA_PROYECT;
  const assessmentURL = `https://recaptchaenterprise.googleapis.com/v1/projects/${proyect}/assessments?key=${apiKey}`;

  const requestBody = {
    event: {
      token,
      siteKey,
      expectedAction: "LOGIN",
    },
  };

  const response = await fetch(assessmentURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  // 🐛 DEBUG: imprimir toda la respuesta de la API de reCAPTCHA Enterprise
  console.log("🔍 reCAPTCHA Enterprise Response:", JSON.stringify(data, null, 2));

  const isValid = data.tokenProperties?.valid === true && data.riskAnalysis?.score >= 0.5;
  console.log("✅ ¿Es humano?", isValid, "| 🧠 Score:", data.riskAnalysis?.score);

  return isValid;
}

function isNotNullOrUndefined(value: any) {
  return value !== null && value !== undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const pool = await connectToDatabase();
    const { institutional_email, recaptchaToken } = req.body;

    if (!institutional_email || !recaptchaToken) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Faltan datos requeridos.",
        },
      });
    }

    const isHuman = await verifyRecaptchaEnterprise(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Validación reCAPTCHA fallida. Intenta de nuevo.",
        },
      });
    }

    const emailLower = institutional_email.toLowerCase();

    const emailCheckResponse = emailChecker(req, res);
    if (emailCheckResponse !== 200) {
      return res.status(emailCheckResponse).json({
        notification: {
          type: "error",
          message: "El correo no tiene un dominio válido.",
        },
      });
    }

    const jwtToken = jwt.sign({ email: emailLower }, process.env.JWT_KEY as string, {
      expiresIn: "20m",
    });

    res.setHeader(
      "Set-Cookie",
      serialize("jwtToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600,
        path: "/",
        sameSite: "strict",
      })
    );

    const existingUser = await pool
      .request()
      .input("email", sql.VarChar, emailLower)
      .query("SELECT TOP 1 * FROM Personal_data WHERE institutional_email = @email");

    if (existingUser.recordset.length > 0) {
      const user = existingUser.recordset[0];

      const f1 = isNotNullOrUndefined(user.name) &&
        isNotNullOrUndefined(user.surname) &&
        isNotNullOrUndefined(user.id_number) &&
        isNotNullOrUndefined(user.birth_date) &&
        isNotNullOrUndefined(user.data_treatment);

      const f2 = isNotNullOrUndefined(user.preferred_role_1) &&
        isNotNullOrUndefined(user.preferred_role_2);

      const f3 = isNotNullOrUndefined(user.how_did_hear) &&
        isNotNullOrUndefined(user.has_time) &&
        isNotNullOrUndefined(user.phone) &&
        isNotNullOrUndefined(user.previous_participation);

      if (!f1) {
        return res.status(200).json({
          notification: {
            type: "info",
            message: "Tienes datos pendientes por completar (1).",
          },
          redirectUrl: "/registration/individual",
        });
      }

      if (!f2) {
        return res.status(200).json({
          notification: {
            type: "info",
            message: "Tienes datos pendientes por completar (2).",
          },
          redirectUrl: "/registration/individual/view2",
        });
      }

      if (!f3) {
        return res.status(200).json({
          notification: {
            type: "info",
            message: "Tienes datos pendientes por completar (3).",
          },
          redirectUrl: "/registration/individual/view3",
        });
      }

      return res.status(200).json({
        notification: {
          type: "info",
          message: "Ya completaste el formulario de registro individual.",
        },
        redirectUrl: "/registration/",
      });
    }

    await pool
      .request()
      .input("email", sql.VarChar, emailLower)
      .query("INSERT INTO Personal_data (institutional_email) VALUES (@email)");

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Correo electrónico guardado correctamente.",
      },
      redirectUrl: "/registration/individual",
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  }
}
