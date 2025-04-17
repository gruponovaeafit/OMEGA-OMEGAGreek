import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const email = getEmailFromCookies(req, res);
    if (!email) {
      return res.status(200).json({ redirectUrl: "/email" });
    }

    const pool = await connectToDatabase();
    const request = pool.request().input("email", sql.VarChar, email);

    // Comprobar si el usuario es miembro de otro equipo
    const memberQuery = `
      SELECT TOP 1 T.team_name, T.leader_email
      FROM TEAMS_MEMBERS M
      INNER JOIN TEAMS_DATA T ON M.team_id = T.id
      WHERE M.institutional_email = @email AND T.leader_email != @email
    `;
    const { recordset: memberRecordset } = await request.query(memberQuery);

    if (memberRecordset.length > 0) {
      const { team_name, leader_email } = memberRecordset[0];
      return res.status(400).json({
        notification: {
          type: "error",
          message: `Ya estás inscrito en el equipo "${team_name}", liderado por ${leader_email}.`,
        },
      });
    }

    // Comprobar si el usuario ya es líder
    const leaderQuery = `
      SELECT TOP 1 team_name FROM Teams_data WHERE leader_email = @email
    `;
    const { recordset: leaderRecordset } = await request.query(leaderQuery);

    if (leaderRecordset.length > 0) {
      return res.status(200).json({
        redirectUrl: "/confirmation/teams",
      });
    }

    return res.status(200).json({}); // Puede continuar
  } catch (error) {
    console.error("❌ Error al verificar estado del equipo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
