import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Db connection
  // We need to validate that the leader select right the roles of their team. 
  // If the team members is equal to 4, each role could not repeat 
  // If the team members is mayor to 4, each role could not repeat more than a time.
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const [leader_rol,
        member2_rol,
        member2_email,
        member3_rol,
        member3_email,
        member4_rol,
        member4_email,
        member5_rol,
        member5_email,
        member6_rol,
        member6_email
      ] = req.body

    const roleMap: Record<string, number> = {
        Administrador: 1,
        Diseñador: 2,
        Marketing: 3,
        Desarrollador: 4,
    };
    // Validate that required fields exist and roles are valid
    const requiredFields = [
      { role: leader_rol },
      { role: member2_rol, email: member2_email },
      { role: member3_rol, email: member3_email },
      { role: member4_rol, email: member4_email },
    ];

    for (const field of requiredFields) {
      if (!field.role || !(field.role in roleMap)) {
        return res.status(400).json({ message: "Rol inválido o faltante" });
      }
      if (field.email !== undefined && !field.email) {
        return res.status(400).json({ message: "Debes tener mínimo 4 personas en tu equipo" });
      }
    }



    const pool = await connectToDatabase();

    res.status(200).json({ message: "Conexión exitosa" });
  } catch (error) {
    res.status(500).json({ error: "Error conectando a la base de datos" });
  }
}
