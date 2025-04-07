import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Date, Text, TinyInt, VarChar } from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

// Second view, where the personal data is stored

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //Db connection
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

    // Get data from the request body;

    const { name, surname, id_number, phone, birth_date } = req.body;
    console.log("Datos recibidos:", req.body);

    // Data treatment is missing in the request body, so we set it to 0 by default
    const data_treatment = req.body.data_treatment || 0;

    // Validate that the data is not empty

    if (
      !name ||
      !surname ||
      !id_number ||
      !birth_date ||
      !data_treatment === undefined
    ) {
      console.error("Campos faltantes", {
        name,
        surname,
        id_number,
        phone,
        birth_date,
        data_treatment,
      });
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Faltan datos requeridos",
        },
        status: 400,
      });
    }

    // Validate that the birthdate  is not very recent
    const birthDate = new global.Date(birth_date);
    const today = new global.Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 10) {
      console.error("Edad inválida:", { birth_date });
      return res.status(400).json({
        notification: {
          type: "error",
          message: "La edad ingresada no es válida",
        },
        status: 400,
      });
    }

    try {
      // get the institutional email from the cookies
      const userEmail = getEmailFromCookies(req, res);

      if (userEmail == null) {
        return res.status(400).json({
          status: 400,
          redirectUrl: "/email",
        });
      }

      console.log("Correo electrónico del usuario desde cookies:", userEmail);

      pool
        .request()
        .input("name", VarChar(50), name)
        .input("surname", VarChar, surname)
        .input("id_number", VarChar, id_number)
        .input("birth_date", Date, birth_date)
        .input("data_treatment", TinyInt, data_treatment)
        .input("userEmail", VarChar, userEmail).query(`

                UPDATE Personal_data
                SET name = @name,
                    surname = @surname,
                    id_number = @id_number,
                    birth_date = @birth_date,
                    data_treatment = @data_treatment
                WHERE institutional_email = @userEmail

            `);

      // Routing to the third view
      console.log("Usuario insertado correctamente:");
      return res.status(200).json({
        notification: {
          type: "info",
          message: "Tus datos han sido guardados correctamente",
        },
        status: 200,
        redirectUrl: "/registration/individual/view2",
      });
    } catch (error) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Error al guardar los datos",
        },
        status: 400,
      });
    }
  } catch (error) {
    res.status(500).json({
      notification: {
        type: "error",
        message: "Error conectando a la base de datos",
      },
    });
  }
}
