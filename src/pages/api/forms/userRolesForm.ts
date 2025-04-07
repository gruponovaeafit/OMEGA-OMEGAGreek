import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Int, VarChar } from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

// Segunda vista: guarda los roles preferidos del usuario
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Mapeo de nombres de rol a índices
    const rolesNames: Record<number, string> = {
      1: "Administrador",
      2: "Diseñador",
      3: "Marketing",
      4: "Desarrollador",
    };

    let { preferred_role1, preferred_role2 } = req.body;
    console.log("Roles seleccionados: ", preferred_role1, preferred_role2);

    // Invertimos el mapeo: nombre → índice
    const roleNameToIndex = Object.entries(rolesNames).reduce((acc, [index, name]) => {
      acc[name] = Number(index);
      return acc;
    }, {} as Record<string, number>);

    preferred_role1 = roleNameToIndex[preferred_role1] ?? null;
    preferred_role2 = roleNameToIndex[preferred_role2] ?? null;

    console.log("preferred_role1 (index):", preferred_role1);
    console.log("preferred_role2 (index):", preferred_role2);

    // Validación
    if (preferred_role1 === null || preferred_role2 === null) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Selección inválida",
        },
        status: 400,
      });
    }

    try {
      const userEmail = getEmailFromCookies(req, res);

      if (!userEmail) {
        return res.status(400).json({
          status: 400,
          redirectUrl: "/email",
        });
      }

      console.log("Correo electrónico del usuario desde cookies:", userEmail);

      await pool
        .request()
        .input("rol1", Int, preferred_role1)
        .input("rol2", Int, preferred_role2)
        .input("email", VarChar(255), userEmail)
        .query(
          "UPDATE Personal_data SET preferred_role_1 = @rol1, preferred_role_2 = @rol2 WHERE institutional_email = @email"
        );

      console.log("Usuario actualizado correctamente con roles.");

      return res.status(200).json({
        notification: {
          type: "info",
          message: "Tus datos han sido guardados correctamente",
        },
        status: 200,
        redirectUrl: "/registration/individual/view3",
      });
    } catch (error) {
      console.error("❌ Error al guardar los datos:", error);
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Error al guardar los datos",
        },
        status: 400,
      });
    }
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error conectando a la base de datos",
      },
    });
  }
}
