import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";



export default async function handler(req: NextApiRequest, res: NextApiResponse){

    //Conexión con la db     
    try {
        const pool = await connectToDatabase();
        res.status(200).json({ message: "Conexión exitosa" });
      } catch (error) {
        res.status(500).json({ error: "Error conectando a la base de datos" });
    }

}   