import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";

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