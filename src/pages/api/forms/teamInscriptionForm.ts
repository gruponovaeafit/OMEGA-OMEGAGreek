import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";




export default async function handler(req: NextApiRequest, res: NextApiResponse){

    //Db connection
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Método no permitido" });
        }

        const pool = await connectToDatabase();
        res.status(200).json({ message: "Conexión exitosa" });

        // Get data from the request body;
        const { team_name, leader_email} = req.body;
        console.log("Datos recibidos:", req.body);

        // Validate that the data is not empty
        if (!team_name || !leader_email) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        // Validate that the email is in the correct format
        if (!leader_email || !leader_email.endsWith("@eafit.edu.co")) {
            console.error("Correo inválido o faltante:", { leader_email });
            return res.status(400).json({
              notification: {
                type: "error",
                message: "El correo debe ser del dominio @eafit.edu.co.",
              },
            });
        }

        // Validate that the email exist in the database
        const result = await pool.request()
            .input("leader_email", leader_email)
            .query("SELECT * FROM Personal_data WHERE institutional_email = @leader_email");
        const rows = result.recordset;
        if (rows.length === 0) {
            console.error("Correo no encontrado en la base de datos:", { leader_email });
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "El correo no existe en la base de datos.",
                },
            });
        }

        try {
            const timestamp = new global.Date(); // Get the current date and time
            pool.request()
                .input("team_name", team_name)
                .input("leader_email", leader_email)
                .input("timestamp", timestamp)
                .query("INSERT INTO Teams_data (team_name, leader_email, created_at) VALUES (@team_name, @leader_email, @timestamp)");
                console.log("Equipo insertado:", { team_name, leader_email, timestamp });

                return res.status(200).json({ message: "Inscripción exitosa" });

        } catch (error) {
            return res.status(400).json({ error: "Error al insertar en la base de datos" });
          }

    } catch (error) {
            console.error("Error al insertar en la base de datos:", error);
            res.status(500).json({ error: "Error al insertar en la base de datos" });
      }
}
