import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";


//Traer la información del fetch.
//Validar información según criterios de aceptación de AyP (Preguntar la validación del campo University)
//Tener en mente que problamente hayan 3 vistas
//Traer desde las cookies el correo
//Implementar reCaptcha y usarlo para validar si está autorizado para ver la vista.
//Implementar el userCheckStatus (Crear otro archivo)


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
