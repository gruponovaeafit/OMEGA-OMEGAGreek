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

    // const { recaptchaToken } = req.body;

    // if (!recaptchaToken) {
    //   return res.status(400).json({
    //     notification: { type: "error", message: "Faltan datos requeridos." },
    //   });
    // }

    // // Validar reCAPTCHA (posible cuello de botella)
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

    const emailLower = userEmail.toLowerCase();

    try {
        const pool = await connectToDatabase();

        const result = await pool
        .request()
        .input("email", sql.VarChar, emailLower)
        .query(
          "SELECT team_name FROM teams_data WHERE leader_email = @email"
        );

        const teamName = result.recordset[0].team_name;

        //send to the front the team name
        res.status(200).json({
            notification: {
                type: "success",
                message: "Nombre de equipo obtenido correctamente.",
            },
            teamName: teamName,
        });

        try{

            // the field team_name should be a value in frontend
            const {team_name} = req.body;
            if (!team_name) {
                return res.status(400).json({
                    notification: { type: "error", message: "Faltan datos requeridos." },
                });
            }

            const pool = await connectToDatabase();

            //verify that the team name is not existing in the database
            const existingTeamName = await pool
            .request()
            .input("team_name", sql.VarChar, team_name)
            .query(
                "SELECT * FROM teams_data WHERE team_name = @team_name"
            );
            if (existingTeamName.recordset.length > 0) {
                return res.status(400).json({
                    notification: {
                        type: "error",
                        message: "El nombre de equipo ya existe.",
                    },
                });
            }

            const result = await pool
            .request()
            .input("team_name", sql.VarChar, team_name)
            .input("email", sql.VarChar, emailLower)
            .query(`
                UPDATE teams_data
                SET team_name = @team_name
                WHERE leader_email = @email"
            `);

            return res.status(200).json({
                notification: {
                    type: "success",
                    message: "Nombre de equipo actualizado correctamente.",
                },
                redirectUrl: "/teamRolesConfirmationForm",
            });

            }catch (error) {
                return res.status(400).json({
                    notification: {
                        type: "error",
                        message: "Error al obtener el nombre del equipo.",
                    },
                });
            }

        } catch (error) {
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "Error al obtener el nombre del equipo.",
                },
            });
        };

    }catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error al conectar a la base de datos.",
      },
    });
  }
}
