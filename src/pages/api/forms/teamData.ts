import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import emailChecker from "../emailCheker";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const userEmail = getEmailFromCookies(req, res);
    if (!userEmail) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const pool = await connectToDatabase();
    const request = pool
      .request()
      .input("leader_email", sql.VarChar, userEmail);

    if (req.method === "POST") {
      const { emails } = req.body;
      if (!emails || !Array.isArray(emails)) {
        return res.status(400).json({ error: "Lista de correos no válida" });
      }

      // Obtener ID del equipo
      const teamResult = await request.query(`
        SELECT TOP 1 id FROM TEAMS_DATA WHERE leader_email = @leader_email
      `);
      if (teamResult.recordset.length === 0) {
        return res.status(404).json({ error: "Equipo no encontrado" });
      }

      const teamId = teamResult.recordset[0].id;

      for (const email of emails.filter(Boolean)) {
        const fakeReq = { ...req, body: { institutional_email: email } };
        const isValid = emailChecker(fakeReq as NextApiRequest, res);

        if (isValid !== 200) {
          return res.status(400).json({
            notification: {
              type: "error",
              message: `El correo "${email}" no tiene un dominio permitido.`,
            },
          });
        }

        // 🔍 Insertar en PERSONAL_DATA si no existe
        const exists = await pool
          .request()
          .input("email", sql.VarChar, email)
          .query(
            "SELECT 1 FROM PERSONAL_DATA WHERE institutional_email = @email",
          );

        if (exists.recordset.length === 0) {
          await pool
            .request()
            .input("email", sql.VarChar, email)
            .query(
              "INSERT INTO PERSONAL_DATA (institutional_email) VALUES (@email)",
            );
        }

        // 🔁 Verificar duplicado
        const check = await pool
          .request()
          .input("team_id", sql.Int, teamId)
          .input("institutional_email", sql.VarChar, email).query(`
            SELECT 1 FROM TEAMS_MEMBERS 
            WHERE team_id = @team_id AND institutional_email = @institutional_email
          `);

        if (check.recordset.length === 0) {
          await pool
            .request()
            .input("team_id", sql.Int, teamId)
            .input("leader_email", sql.VarChar, userEmail)
            .input("institutional_email", sql.VarChar, email).query(`
              INSERT INTO TEAMS_MEMBERS (team_id, leader_email, institutional_email)
              VALUES (@team_id, @leader_email, @institutional_email)
            `);
        }
      }

      // Contar miembros
      const { recordset } = await request.query(`
        SELECT COUNT(*) AS count
        FROM TEAMS_MEMBERS M
        INNER JOIN TEAMS_DATA T ON M.team_id = T.id
        WHERE T.leader_email = @leader_email
      `);

      const count = recordset[0].count;
      const completed = count >= 6;

      return res.status(200).json({
        message: completed
          ? "Todos los miembros registrados correctamente"
          : "Miembros registrados correctamente. Aún puedes añadir más.",
        ...(completed && { redirectUrl: "/registration/teams/final" }),
      });
    }

    // Método GET: traer todos los miembros
    const { recordset: members } = await request.query(`
      SELECT M.institutional_email
      FROM TEAMS_MEMBERS M
      INNER JOIN TEAMS_DATA T ON M.team_id = T.id
      WHERE T.leader_email = @leader_email
      ORDER BY M.timestamp ASC
    `);

    return res.status(200).json({
      members: members
        .map((row) => row.institutional_email)
        .filter((email) => email !== userEmail), // excluir el correo del líder
    });
  } catch (error) {
    console.error("Error en teamData:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
