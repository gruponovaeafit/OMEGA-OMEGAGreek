import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const email = getEmailFromCookies(req, res);
    if (!email) {
      return res.status(200).json({ redirectUrl: "/email" });
    }

    const pool = await connectToDatabase();

    // Primero, verificar si ya está registrado como miembro de otro equipo (cuando no es el líder)
    const memberResult = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT TOP 1 T.team_name, T.leader_email
        FROM TEAMS_MEMBERS M
        INNER JOIN TEAMS_DATA T ON M.team_id = T.id
        WHERE M.institutional_email = @email AND T.leader_email != @email
      `);

    if (memberResult.recordset.length > 0) {
      const { team_name, leader_email } = memberResult.recordset[0];
      return res.status(400).json({
        notification: {
          type: "error",
          message: `Ya estás inscrito en el equipo "${team_name}", liderado por ${leader_email}`,
        },
      });
    }

    // Luego, verificar si el usuario ya es líder de un equipo
    const leaderResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT TOP 1 team_name FROM Teams_data WHERE leader_email = @email");

    const team = leaderResult.recordset[0];

    if (team && team.team_name) {
      return res.status(200).json({
        redirectUrl: "/registration/teams/view2",
      });
    }

    // Si no está registrado en ningún equipo
    return res.status(200).json({});

  } catch (error) {
    console.error("❌ Error al verificar estado del equipo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
