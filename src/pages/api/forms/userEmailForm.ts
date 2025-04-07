import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import emailChecker from "../emailCheker";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import sql from "mssql";

// Función auxiliar para validar campos definidos y no nulos
function isNotNullOrUndefined(value: any) {
  return value !== null && value !== undefined;
}

// First view, where the institutional email is stored
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const pool = await connectToDatabase();
    const institutional_email = req.body.institutional_email;

    if (!institutional_email) {
      console.error("Campo faltante");
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const emailLower = institutional_email.toLowerCase();

    try {
      const existingUser = await pool
        .request()
        .input("email", sql.VarChar, emailLower)
        .query("SELECT TOP 1 institutional_email FROM Personal_data WHERE institutional_email = @email");

      // Validar formato de correo
      const emailCheckResponse = emailChecker(req, res);
      if (emailCheckResponse !== 200) {
        console.error("El correo no pasó la validación:", { institutional_email });
        return res.status(emailCheckResponse).json({
          notification: {
            type: "error",
            message: "El correo no tiene un dominio válido.",
          },
        });
      }

      // Guardar en cookie JWT
      const jwtToken = jwt.sign({ email: institutional_email }, process.env.JWT_KEY as string, {
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

      // Si ya existe el usuario, verificar formularios completados
      if (existingUser.recordset.length > 0) {
        const userData = await pool
          .request()
          .input("email", sql.VarChar, emailLower)
          .query("SELECT TOP 1 * FROM Personal_data WHERE institutional_email = @email");
        const userInfo = userData.recordset[0];

        // Verificar formulario 1
        const f1Completado =
          isNotNullOrUndefined(userInfo.name) &&
          isNotNullOrUndefined(userInfo.surname) &&
          isNotNullOrUndefined(userInfo.id_number) &&
          isNotNullOrUndefined(userInfo.birth_date) &&
          isNotNullOrUndefined(userInfo.data_treatment);

        // Verificar formulario 2
        const f2Completado =
          isNotNullOrUndefined(userInfo.preferred_role_1) &&
          isNotNullOrUndefined(userInfo.preferred_role_2);

        // Verificar formulario 3
        const f3Completado =
          isNotNullOrUndefined(userInfo.how_did_hear) &&
          isNotNullOrUndefined(userInfo.has_time) &&
          isNotNullOrUndefined(userInfo.phone) &&
          isNotNullOrUndefined(userInfo.previous_participation);

        console.log("▶️ f1Completado:", f1Completado);
        console.log("▶️ f2Completado:", f2Completado);
        console.log("▶️ f3Completado:", f3Completado);

        if (!f1Completado) {
          const incompleteFields = [];
          if (!isNotNullOrUndefined(userInfo.name)) incompleteFields.push("name");
          if (!isNotNullOrUndefined(userInfo.surname)) incompleteFields.push("surname");
          if (!isNotNullOrUndefined(userInfo.id_number)) incompleteFields.push("id_number");
          if (!isNotNullOrUndefined(userInfo.birth_date)) incompleteFields.push("birth_date");
          if (!isNotNullOrUndefined(userInfo.data_treatment)) incompleteFields.push("data_treatment");

          return res.status(200).json({
            notification: {
              type: "info",
              message: "Tienes datos pendientes por completar (2).",
            },
            incompleteFields,
            redirectUrl: "/registration/individual",
          });
        }

        if (!f2Completado) {
          const incompleteFields = [];
          if (!isNotNullOrUndefined(userInfo.preferred_role_1)) incompleteFields.push("preferred_role1");
          if (!isNotNullOrUndefined(userInfo.preferred_role_2)) incompleteFields.push("preferred_role2");

          return res.status(200).json({
            notification: {
              type: "info",
              message: "Tienes datos pendientes por completar (3).",
            },
            incompleteFields,
            redirectUrl: "/registration/individual/view2",
          });
        }

        if (!f3Completado) {
          const incompleteFields = [];
          if (!isNotNullOrUndefined(userInfo.how_did_hear)) incompleteFields.push("how_did_hear");
          if (!isNotNullOrUndefined(userInfo.has_time)) incompleteFields.push("has_time");
          if (!isNotNullOrUndefined(userInfo.phone)) incompleteFields.push("phone");
          if (!isNotNullOrUndefined(userInfo.previus_participation)) incompleteFields.push("previus_participation");

          return res.status(200).json({
            notification: {
              type: "info",
              message: "Tienes datos pendientes por completar (4).",
            },
            incompleteFields,
            redirectUrl: "/registration/individual/view3",
          });
        }

        // ✅ Todos los formularios han sido completados
        console.log("✅ Todos los formularios han sido completados. Redirigiendo a /registration/individual/final");

        return res.status(200).json({
          notification: {
            type: "info",
            message: "Ya completaste el formulario de registro individual.",
          },
          redirectUrl: "/registration/",
        });
      }

      // Si el correo no existe: insertar nuevo usuario
      await pool
        .request()
        .input("email", sql.VarChar, emailLower)
        .query("INSERT INTO Personal_data (institutional_email) VALUES (@email)");

      console.log("📥 Correo insertado correctamente:", institutional_email);

      return res.status(200).json({
        notification: {
          type: "success",
          message: "Correo electrónico guardado correctamente.",
        },
        redirectUrl: "/registration/individual",
      });
    } catch (error) {
      console.error("❌ Error interno:", error);
      return res.status(500).json({
        notification: {
          type: "error",
          message: "Error al insertar el correo en la base de datos.",
        },
      });
    }
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error al conectar con la base de datos.",
      },
    });
  }
}
