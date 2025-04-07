import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import sql from "mssql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pool = await connectToDatabase();
    const userEmail = getEmailFromCookies(req, res);

    if (!userEmail) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (req.method === "POST") {
      const { emails } = req.body;

      if (!emails || !Array.isArray(emails)) {
        return res.status(400).json({ error: "Lista de correos no válida" });
      }

      const teamResult = await pool
        .request()
        .input("leader_email", sql.VarChar, userEmail)
        .query("SELECT TOP 1 id FROM TEAMS_DATA WHERE leader_email = @leader_email");

      if (teamResult.recordset.length === 0) {
        return res.status(404).json({ error: "Equipo no encontrado" });
      }

      const teamId = teamResult.recordset[0].id;

      for (const email of emails) {
        if (!email) continue;

        // Validar existencia del correo en PERSONAL_DATA para evitar FK error
        const userExists = await pool
          .request()
          .input("email", sql.VarChar, email)
          .query("SELECT * FROM PERSONAL_DATA WHERE institutional_email = @email");

        if (userExists.recordset.length === 0) {
          continue; // ignora si no existe
        }

        const existing = await pool
          .request()
          .input("team_id", sql.Int, teamId)
          .input("institutional_email", sql.VarChar, email)
          .query(`SELECT * FROM TEAMS_MEMBERS WHERE team_id = @team_id AND institutional_email = @institutional_email`);

        if (existing.recordset.length === 0) {
          await pool
            .request()
            .input("team_id", sql.Int, teamId)
            .input("leader_email", sql.VarChar, userEmail)
            .input("institutional_email", sql.VarChar, email)
            .query(`
              INSERT INTO TEAMS_MEMBERS (team_id, leader_email, institutional_email)
              VALUES (@team_id, @leader_email, @institutional_email)
            `);
        }
      }

      // Verificar cuántos miembros hay ahora
      const membersResult = await pool
        .request()
        .input("leader_email", sql.VarChar, userEmail)
        .query(`
          SELECT COUNT(*) as count
          FROM TEAMS_MEMBERS M
          INNER JOIN TEAMS_DATA T ON M.team_id = T.id
          WHERE T.leader_email = @leader_email
        `);

      const count = membersResult.recordset[0].count;

      if (count >= 6) {
        return res.status(200).json({
          message: "Todos los miembros registrados correctamente",
          redirectUrl: "/registration/teams/final"
        });
      }

      return res.status(200).json({
        message: "Miembros registrados correctamente. Aún puedes añadir más."
      });

    } else if (req.method === "GET") {
      const membersResult = await pool
        .request()
        .input("leader_email", sql.VarChar, userEmail)
        .query(`
          SELECT M.institutional_email
          FROM TEAMS_MEMBERS M
          INNER JOIN TEAMS_DATA T ON M.team_id = T.id
          WHERE T.leader_email = @leader_email
          ORDER BY M.timestamp ASC
        `);

      const emails = membersResult.recordset.map(row => row.institutional_email);
      return res.status(200).json({ members: emails });

    } else {
      return res.status(405).json({ error: "Método no permitido" });
    }

  } catch (error) {
    console.error("Error en teamData:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
