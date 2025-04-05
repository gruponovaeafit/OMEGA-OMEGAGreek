import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
// Third view, where the user selects the roles they want to apply for
// The roles are stored as a number (1, 2, 3, 4) in the database, and the user can select up to 2 roles
// Frontend sends the user's roles (up to 2)

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    // Db connection
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Método no permitido" });
        }

        const pool = await connectToDatabase();

        res.status(200).json({ message: "Conexión exitosa" });
      } catch (error) {
        res.status(500).json({ error: "Error conectando a la base de datos" });
    }

}