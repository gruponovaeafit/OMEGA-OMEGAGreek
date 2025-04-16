import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import emailChecker from "../emailCheker";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const pool = await connectToDatabase();
    const { team_name } = req.body;
    const leader_email = getEmailFromCookies(req, res);

    if (!team_name || !leader_email) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Validar formato de correo
    emailChecker(req, res);

    // Verificar existencia del líder en Personal_data
    const userCheck = await pool
      .request()
      .input("email", sql.VarChar, leader_email)
      .query("SELECT * FROM Personal_data WHERE institutional_email = @email");

    if (userCheck.recordset.length === 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El correo no está registrado en la base de datos.",
        },
      });
    }

    // Verificar si ya hace parte de un equipo
    const teamExistCheck = await pool
      .request()
      .input("leader_email", sql.VarChar, leader_email)
      .query("SELECT * FROM Teams_data WHERE leader_email = @leader_email");

    if (teamExistCheck.recordset.length > 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "Ya haces parte de un equipo.",
        },
      });
    }

    // Verificar si el nombre del equipo ya existe
    const nameCheck = await pool
      .request()
      .input("team_name", sql.VarChar, team_name)
      .query("SELECT * FROM Teams_data WHERE team_name = @team_name");

    if (nameCheck.recordset.length > 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El nombre del equipo ya existe.",
        },
      });
    }

    // Obtener último ID e insertar nuevo equipo
    const lastIdQuery = await pool
      .request()
      .query("SELECT TOP 1 id FROM Teams_data ORDER BY id DESC");

    const newTeamId =
      lastIdQuery.recordset.length > 0 ? lastIdQuery.recordset[0].id + 1 : 1;

    await pool
      .request()
      .input("id", sql.Int, newTeamId)
      .input("leader_email", sql.VarChar, leader_email)
      .input("team_name", sql.VarChar, team_name)
      .query(
        "INSERT INTO Teams_data (id, leader_email, team_name) VALUES (@id, @leader_email, @team_name)",
      );

    // ➕ Insertar líder en Teams_members
    await pool
      .request()
      .input("team_id", sql.Int, newTeamId)
      .input("leader_email", sql.VarChar, leader_email)
      .input("institutional_email", sql.VarChar, leader_email)
      .input("role", sql.Int, null) // Puedes cambiar a otro valor si tienes lógica de roles
      .query(`
        INSERT INTO Teams_members (team_id, leader_email, institutional_email, role)
        VALUES (@team_id, @leader_email, @institutional_email, @role)
      `);

    return res.status(200).json({
      notification: {
        type: "success",
        message: "Equipo registrado correctamente.",
      },
      redirectUrl: "/registration/teams/view2",
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error del servidor al guardar los datos.",
      },
    });
  }
}
