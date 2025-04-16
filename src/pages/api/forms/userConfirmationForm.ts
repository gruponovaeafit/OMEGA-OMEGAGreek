import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Db connection
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    //const pool = await connectToDatabase();

    //res.status(200).json({ message: "Conexión exitosa" });

    // Get data from the request body
    const {
      team_name,
      leader_email,
      team_member1_email,
      team_member2_email,
      team_member3_email,
      team_member4_email,
      team_member5_email,
      team_member6_email,
      rol_member1,
      rol_member2,
      rol_member3,
      rol_member4,
      rol_member5,
      rol_member6,
    } = req.body;
    console.log("Datos recibidos:", req.body);

    // Validate that the data is not empty
    if (
      !team_name ||
      !leader_email ||
      !team_member1_email ||
      !team_member2_email ||
      team_member3_email ||
      !team_member4_email ||
      !team_member5_email ||
      !team_member6_email ||
      rol_member1 ||
      rol_member2 ||
      rol_member3 ||
      rol_member4 ||
      rol_member5 ||
      rol_member6
    ) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const emails = [
      leader_email,
      team_member1_email,
      team_member2_email,
      team_member3_email,
      team_member4_email,
      team_member5_email,
      team_member6_email,
    ];

    // Validate that all emails are in the correct format
    for (const email of emails) {
      if (!leader_email || !leader_email.endsWith("@eafit.edu.co")) {
        console.error("Correo inválido o faltante:", { leader_email });
        return res.status(400).json({
          notification: {
            type: "error",
            message: "El correo debe ser del dominio @eafit.edu.co.",
          },
        });
      }
    }

    console.log("Datos recibidos:", req.body);
  } catch (error) {
    res.status(500).json({ error: "Error conectando a la base de datos" });
  }
}
