import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import emailChecker from "../emailCheker";

//First view, where the institutional email is stored

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    // Db connection
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Método no permitido" });
        }

        const pool = await connectToDatabase();
        const [ institutional_email ] = req.body;

        if (!institutional_email) {
            return res.status(400).json({ error: "Faltan datos requeridos" });  
        }
        emailChecker(req, res);
        // Validate that the email exist in Personal_data table
        const result = await pool.request()
            .input("institutional_email", institutional_email)
            .query("SELECT * FROM Personal_data WHERE institutional_email = @institutional_email");
        if (result.recordset.length === 0) {
            await pool.request()
            .input("institutional_email", institutional_email)
            .query("INSERT INTO Personal_data (institutional_email) VALUES (@institutional_email)");
            console.log("Email insertado en la base de datos:", { institutional_email });

            // Routing to the second view is missing here
            return res.status(200).json({
                notification: {
                    type: "success",
                    message: "El correo ha sido registrado correctamente.",
                },
            });
        } else {
            console.error("El correo ya está registrado:", { institutional_email });
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "El correo ya está registrado",
                },
            });
        }


        res.status(200).json({ message: "Conexión exitosa" });
      } catch (error) {
        res.status(500).json({ error: "Error conectando a la base de datos" });
    }

}