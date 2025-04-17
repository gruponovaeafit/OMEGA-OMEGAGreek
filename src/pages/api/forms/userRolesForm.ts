import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Int, VarChar } from "mssql";
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

  const { preferred_role1, preferred_role2 } = req.body;

  const roleMap: Record<string, number> = {
    Administrador: 1,
    Diseñador: 2,
    Mercadeo: 3,
    Desarrollador: 4,
  };

  const rol1 = roleMap[preferred_role1] ?? null;
  const rol2 = roleMap[preferred_role2] ?? null;

  if (rol1 === null || rol2 === null) {
    return res.status(400).json({
      notification: { type: "error", message: "Selección inválida" },
    });
  }

  if (rol1 === rol2) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "No puedes seleccionar el mismo rol dos veces",
      },
    });
  }

  const userEmail = getEmailFromCookies(req, res);
  if (!userEmail) {
    return res.status(400).json({ redirectUrl: "/email" });
  }

  try {
    const pool = await connectToDatabase();

    await pool
      .request()
      .input("rol1", Int, rol1)
      .input("rol2", Int, rol2)
      .input("email", VarChar(255), userEmail).query(`
        UPDATE Personal_data
        SET preferred_role_1 = @rol1, preferred_role_2 = @rol2
        WHERE institutional_email = @email
      `);

    return res.status(200).json({
      notification: {
        type: "info",
        message: "Tus datos han sido guardados correctamente",
      },
      redirectUrl: "/registration/individual/view3",
    });
  } catch (error) {
    console.error("❌ Error al guardar los datos:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error al guardar los datos",
      },
    });
  }
}
