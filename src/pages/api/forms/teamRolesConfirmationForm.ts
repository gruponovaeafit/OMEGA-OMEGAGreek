import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import sql from "mssql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const {
    leader_rol,
    member2_rol,
    member2_email,
    member3_rol,
    member3_email,
    member4_rol,
    member4_email,
    member5_rol,
    member5_email,
    member6_rol,
    member6_email,
  } = req.body;

  const leader_email = getEmailFromCookies(req, res);

  const roleMap: Record<string, number> = {
    Administrador: 1,
    Diseñador: 2,
    Mercadeo: 3,
    Desarrollador: 4,
  };

  const inverseRoleMap: Record<number, string> = {
    1: "Administrador",
    2: "Diseñador",
    3: "Mercadeo",
    4: "Desarrollador",
  };

  try {
    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input("leader_email", leader_email)
      .query("SELECT id FROM Teams_data WHERE leader_email = @leader_email");

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({
        notification: {
          type: "error",
          message: "No se encontró un equipo con ese correo de líder",
        },
      });
    }

    const team_id = result.recordset[0].id;

    const teamData = await pool.request().input("team_id", team_id).query(`
      SELECT institutional_email, role
      FROM Teams_members
      WHERE team_id = @team_id
    `);

    const noFieldsProvided =
      !leader_rol &&
      !member2_email && !member2_rol &&
      !member3_email && !member3_rol &&
      !member4_email && !member4_rol &&
      !member5_email && !member5_rol &&
      !member6_email && !member6_rol;

    if (noFieldsProvided) {
      const existingMemberEmail = teamData.recordset.map((row) => row.institutional_email);
      const existingRoles = teamData.recordset.map((row) => inverseRoleMap[row.role] || "Seleccione Rol");

      return res.status(200).json({
        notification: {
          type: "info",
          message: "Miembros ya registrados.",
        },
        teamEmails: existingMemberEmail,
        teamRoles: existingRoles,
      });
    }

    const emailDomains = [
      "@eafit.edu.co",
      "@unal.edu.co",
      "@pascualbravo.edu.co",
      "@itm.edu.co",
      "@udea.edu.co",
    ];

    const membersInfo = [
      { role: leader_rol, email: leader_email },
      { role: member2_rol, email: member2_email },
      { role: member3_rol, email: member3_email },
      { role: member4_rol, email: member4_email },
      { role: member5_rol, email: member5_email },
      { role: member6_rol, email: member6_email },
    ];

    const teamRoles = [];
    const teamEmails = [];

    for (const field of membersInfo) {
      if (field.role && field.email) {
        if (!(field.role in roleMap)) {
          return res.status(400).json({
            notification: { type: "error", message: "Rol no encontrado" },
          });
        }
        teamRoles.push(field.role);

        const isValidDomain = emailDomains.some((domain) => field.email.endsWith(domain));

        if (isValidDomain) {
          teamEmails.push(field.email);
        } else {
          return res.status(400).json({
            notification: {
              type: "error",
              message: "El correo electronico de todos los integrantes debe ser de un dominio valido",
            },
          });
        }
      }
      if (!field.email && field.role) {
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Falta el correo de alguno de los miembros",
          },
        });
      }
      if (field.email && !field.role) {
        return res.status(400).json({
          notification: {
            type: "error",
            message: "Falta el rol de alguno de los roles",
          },
        });
      }
    }

    if (teamRoles.length < 2) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El equipo debe de tener al menos 2 integrantes",
        },
      });
    }

    const uniqueRoles = new Set(teamRoles);
    if (uniqueRoles.size < 2 && teamRoles.length === 2) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El equipo debe tener al menos 2 roles diferentes",
        },
      });
    }
    if (uniqueRoles.size < 3 && teamRoles.length === 3) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El equipo debe tener al menos 3 roles diferentes",
        },
      });
    }
    if (uniqueRoles.size < 4 && teamRoles.length >= 4) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: "El equipo debe tener al menos 4 roles diferentes",
        },
      });
    }

    const unregisteredEmails = [];
    for (const email of teamEmails) {
      const emailCheck = await pool.request().input("email", email).query(`
        SELECT institutional_email
        FROM Personal_data
        WHERE institutional_email = @email
      `);
      if (emailCheck.recordset.length === 0) {
        unregisteredEmails.push(email);
      }
    }

    if (unregisteredEmails.length > 0) {
      return res.status(400).json({
        notification: {
          type: "error",
          message: `Los siguientes correos no están registrados en el sistema: ${unregisteredEmails.join(", ")}`,
        },
      });
    }

    const existingMemberEmail = teamData.recordset.map((row) => row.institutional_email);

    for (let i = 0; i < teamEmails.length; i++) {
      const email = teamEmails[i];
      const roleName = teamRoles[i];
      const role = roleMap[roleName];

      if (!existingMemberEmail.includes(email)) {
        await pool
          .request()
          .input("team_id", sql.Int, team_id)
          .input("leader_email", sql.VarChar, leader_email)
          .input("institutional_email", sql.VarChar, email)
          .input("role", sql.Int, role).query(`
            INSERT INTO TEAMS_MEMBERS (
              team_id,
              leader_email,
              institutional_email,
              role
            ) VALUES (
              @team_id,
              @leader_email,
              @institutional_email,
              @role
            )
          `);
      } else {
        await pool
          .request()
          .input("team_id", sql.Int, team_id)
          .input("institutional_email", sql.VarChar, email)
          .input("role", sql.Int, role).query(`
            UPDATE TEAMS_MEMBERS
            SET role = @role
            WHERE team_id = @team_id AND institutional_email = @institutional_email
          `);
      }
    }

    return res.status(200).json({
      notification: {
        type: "info",
        message: "Equipo actualizado con éxito",
      },
      redirectUrl: "/confirmation/teams/send",
    });
  } catch (error) {
    return res.status(500).json({
      notification: {
        type: "error",
        message: "Error interno al procesar la solicitud.",
      },
    });
  }
}