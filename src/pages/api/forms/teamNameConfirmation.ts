import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import sql from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { team_name } = req.body;

  const userEmail = getEmailFromCookies(req, res);
  if (!userEmail) {
    return res.status(400).json({
      notification: {
        type: "error",
        message: "No se pudo obtener el correo desde las cookies",
      },
      redirectUrl: "/",
    });
  }

  const emailLower = userEmail.toLowerCase();

  try {
    const pool = await connectToDatabase();

    // Obtener nombre actual del equipo
    const result = await pool
      .request()
      .input("email", sql.VarChar, emailLower)
      .query("SELECT team_name FROM teams_data WHERE leader_email = @email");

    const currentTeamName = result.recordset[0]?.team_name || "";

    // Si no se envió un nombre nuevo, simplemente devuelve el actual
    if (!team_name || team_name.trim() === "") {
      return res.status(200).json({
        notification: {
          type: "success",
          message: "Nombre de equipo obtenido correctamente.",
        },
        teamName: currentTeamName,
        redirectUrl: "/confirmation/teams/view2",
      });
    }

    // Si el nombre no ha cambiado
    if (team_name === currentTeamName) {
      return res.status(200).json({
        notification: {
          type: "info",
          message: "El nombre de equipo no ha cambiado.",
        },
        teamName: currentTeamName,
        redirectUrl: "/confirmation/teams/view2",
      });
    }

    // Verifica si el nuevo nombre ya existe
    const existingTeamName = await pool
      .request()
      .input("team_name", sql.VarChar, team_name)
      .query("SELECT * FROM teams_data WHERE team_name = @team_name");

    if (existingTeamName.recordset.length > 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El nombre de equipo ya existe.",
        },
        teamName: currentTeamName,
      });
    }

    // Actualiza el nombre del equipo
    await pool
      .request()
      .input("team_name", sql.VarChar, team_name)
      .input("email", sql.VarChar, emailLower).query(`
        UPDATE teams_data
        SET team_name = @team_name
        WHERE leader_email = @email
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Nombre de equipo actualizado correctamente.",
      },
      teamName: team_name,
      redirectUrl: "/confirmation/teams/view2",
    });
  } catch (error) {
    console.error("❌ Error en el handler:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno del servidor.",
      },
    });
  }
}
