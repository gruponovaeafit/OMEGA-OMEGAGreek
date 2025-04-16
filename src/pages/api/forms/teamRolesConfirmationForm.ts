import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { getEmailFromCookies } from "../getEmailFromCookies";

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

    // List of valid email domains to validate the memebers emails
    const emailDomains = [
      "@eafit.edu.co",
      "@unal.edu.co",
      "@pascualbravo.edu.co",
      "@itm.edu.co",
      "@udea.edu.co",
    ];

    const {leader_rol,
        leader_email,
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

    //const leader_email = getEmailFromCookies(req, res);

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

        console.log("Email: ", field.email)
        console.log("Role: ", field.role)

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
      return res.status(400).json({
        notification: {
          type: 'error',
          message: 'Error parseando los datos',
        },
        });
    };

  //Inserting data
   const pool = await connectToDatabase();

   try{

      // 1. Obtener el team_id
      const result = await pool.request()
      .input('leader_email', leader_email)
      .query('SELECT id FROM Teams_data WHERE leader_email = @leader_email');

      if (result.recordset.length === 0) {
      return res.status(404).json({
        notification: {
          type: 'error',
          message: 'No se encontró un equipo con ese correo de líder',
        },
      });
      }

      const team_id = result.recordset[0].id;

      const teamData = await pool.request()
                                 .input("team_id", team_id)
                                 .query(`
                                    SELECT institutional_email where team_id = @team_id
                                  `)
      
      if (teamData.recordset.length == 0){
        
      }

      // 2. Insertar miembros al equipo
      for (let i = 0; i < teamEmails.length; i++) {
      const email = teamEmails[i];
      const role = teamRoles[i];

      await pool.request()
        .input('team_id', team_id)
        .input('leader_email', leader_email)
        .input('institutional_email', email)
        .input('role', role)
        .query(`
          INSERT INTO Teams_members (
            team_id,
            leader_email,
            institutional_email,
            role,

          ) VALUES (
            @team_id,
            @leader_email,
            @institutional_email,
            @role,

          )
        `);
      }
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
