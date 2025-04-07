import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Date as SqlDate, TinyInt, VarChar } from "mssql";
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

  const {
    name,
    surname,
    id_number,
    phone,
    birth_date,
    data_treatment = 0,
  } = req.body;

  if (!name || !surname || !id_number || !birth_date) {
    return res.status(400).json({
      notification: { type: "error", message: "Faltan datos requeridos" },
    });
  }

  const birthDate = new globalThis.Date(birth_date);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  if (isNaN(birthDate.getTime()) || age < 10) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "La edad ingresada no es válida",
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
      .input("name", VarChar(50), name)
      .input("surname", VarChar(50), surname)
      .input("id_number", VarChar(50), id_number)
      .input("birth_date", SqlDate, birth_date)
      .input("data_treatment", TinyInt, data_treatment)
      .input("userEmail", VarChar(100), userEmail).query(`
        UPDATE Personal_data
        SET name = @name,
            surname = @surname,
            id_number = @id_number,
            birth_date = @birth_date,
            data_treatment = @data_treatment
        WHERE institutional_email = @userEmail
      `);

    return res.status(200).json({
      notification: {
        type: "info",
        message: "Tus datos han sido guardados correctamente",
      },
      redirectUrl: "/registration/individual/view2",
    });
  } catch (error) {
    console.error("❌ Error al guardar los datos:", error);
    return res.status(500).json({
      notification: { type: "error", message: "Error al guardar los datos" },
    });
  }
}
