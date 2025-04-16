import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    // List of valid email domains to validate the memebers emails
    const emailDomains = [
      "@eafit.edu.co",
      "@unal.edu.co",
      "@pascualbravo.edu.co",
      "@itm.edu.co",
      "@udea.edu.co",
    ];

    const {leader_rol,
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
     } = req.body

    const leader_email = getEmailFromCookies(req, res);

    const roleMap: Record<string, number> = {
        Administrador: 1,
        Diseñador: 2,
        Mercadeo: 3,
        Desarrollador: 4,
    };

    // Validate the members information
    const membersInfo = [

      { role: leader_rol,  email: leader_email  },
      { role: member2_rol, email: member2_email },
      { role: member3_rol, email: member3_email },
      { role: member4_rol, email: member4_email },
      { role: member5_rol, email: member5_email },
      { role: member6_rol, email: member6_email },
    ];

    const teamRoles = [];
    const teamEmails = [];

    try{

      //Team data parsing
      for (const field of membersInfo) {

        //Case if the member data exist
        if(field.role && field.email){

          if(!(field.role in roleMap)) {
            return res.status(400).json({
              notification : {
                type: 'error',
                message: 'Rol no encontrado'
              }
            });
          }
          //Push into teamRoles each role
          teamRoles.push(field.role)

          //Validate all members emails domain
          const isValidDomain = emailDomains.some((domain) =>
            field.email.endsWith(domain),
          );

          if (isValidDomain){
            teamEmails.push(field.email)

          } else if (!isValidDomain){

            return res.status(400).json({
              notification : {
                type: 'error',
                message: 'El correo electronico de todos los integrantes debe ser de un dominio valido'
              }
            })
          }
        }

        //Validate if one of the members data is missing
        if (!field.email && field.role){
          return res.status(400).json({
            notification: {
              type: 'error',
              message: 'Falta el correo de alguno de los miembros',
            },
            });

        }

        if (field.email && !field.role){
          return res.status(400).json({
            notification: {
              type: 'error',
              message: 'Falta el rol de alguno de los roles',
            },
            });
        }
      }

      console.log("team roles: ", teamRoles);
      console.log("team emails: ", teamEmails);

      //Validate that the team has at least 2 members
      if (teamRoles.length < 2){
        return res.status(400).json({
          notification: {
            type: 'error',
            message: 'El equipo debe de tener al menos 2 integrantes',
          },
          });
      }

      //Validate that the team has the correct roles distribution
      const uniqueRoles = new Set(teamRoles);
      if (uniqueRoles.size < 2 && teamRoles.length == 2) {
        return res.status(400).json({
        notification: {
          type: 'error',
          message: 'El equipo debe tener al menos 2 roles diferentes',
        },
        });
      }
      if (uniqueRoles.size < 3 && teamRoles.length == 3) {
        return res.status(400).json({
        notification: {
          type: 'error',
          message: 'El equipo debe tener al menos 3 roles diferentes',
        },
        });
      }
      if (uniqueRoles.size < 4 && teamRoles.length >= 4) {
        return res.status(400).json({
        notification: {
          type: 'error',
          message: 'El equipo debe tener al menos 4 roles diferentes',
        },
        });
      }

    }catch(err){

      console.log("Error parseando los datos del equipo", err)
      return res.status(500).json({
        notification: {
          type: 'error',
          message: 'Error parseando los datos',
        },
        });
    };

  //Inserting and updating data
   const pool = await connectToDatabase();

    // Validate that all emails in teamEmails are registered in the Personal_data table
    const unregisteredEmails = [];

    for (const email of teamEmails) {
      const emailCheck = await pool.request()
        .input('email', email)
        .query(`
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
          type: 'error',
          message: `Los siguientes correos no están registrados en el sistema: ${unregisteredEmails.join(', ')}`,
        },
      });
    }

   try{

      // 1. Obtain team_id
      const result = await pool.request()
      .input('leader_email', leader_email)
      .query('SELECT id FROM Teams_data WHERE leader_email = @leader_email');

      if (result.recordset.length === 0) {
      console.log("No se encontró un equipo registrado con ese correo de lider")
      return res.status(404).json({
        notification: {
          type: 'error',
          message: 'No se encontró un equipo con ese correo de líder',
        },
      });
      }

      const team_id = result.recordset[0].id;
      const existingMemberEmail = []

      const teamData = await pool.request()
                                 .input("team_id", team_id)
                                 .query(`
                                    SELECT institutional_email FROM Teams_members where team_id = @team_id
                                  `)
      if (teamData.recordset.length > 0){

        for (let i = 0; i < teamData.recordset.length; i++){
            existingMemberEmail.push(teamData.recordset[i].institutional_email)
        }
        //Sending the existing emails
        console.log("Datos enviados al front:", existingMemberEmail)
        res.status(200).json({
          notification: {
            type: 'info',
            message: 'Emails enviados al front',
          },
          teamEmails : existingMemberEmail
          });
      }


      // 2. Insert member to the team
      for (let i = 0; i < teamEmails.length; i++) {
        const email = teamEmails[i];
        const roleName = teamRoles[i];
        const role = roleMap[roleName];


        // Insert the member only if they do not already exist
        if (!existingMemberEmail.includes(email)) {
          await pool.request()
            .input('team_id', sql.Int ,team_id)
            .input('leader_email', sql.VarChar ,leader_email)
            .input('institutional_email', sql.VarChar ,email)
            .input('role', sql.Int ,role)
            .query(`
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
            console.log("Miembro insertado con éxito")

        } else {
          await pool.request()
            .input('team_id', sql.Int ,team_id)
            .input('institutional_email', sql.VarChar ,email)
            .input('role', sql.Int ,role)
            .query(`
              UPDATE TEAMS_MEMBERS
              SET role = @role
              WHERE team_id = @team_id AND institutional_email = @institutional_email
            `);
            console.log("Miembro actualizado con éxito")
        }
      }
      return res.status(200).json({
        notification: {
          type: 'info',
          message: 'Equipo actualizado con éxito',
        },
        redirectUrl: "/confirmation/team/view3"
        });

   }catch(err){
    console.log(err)
    return res.status(500).json({
      notification: {
        type: 'error',
        message: 'Error insertando datos',
      },
      });

   }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      notification: {
        type: 'error',
        message: 'Error conectando con la base de datos',
      },
      });
  }
}
