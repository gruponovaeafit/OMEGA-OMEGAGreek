import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import emailChecker from "../emailCheker";

//Los roles se insertan en la tabla ROLES

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const  departments = {
        1: "Administración",
        2: "mercadeo",
        3: "desarrollo",
        4: "diseño",
    }

    //Db connection
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Método no permitido" });
        }

        const pool = await connectToDatabase();
        res.status(200).json({ message: "Conexión exitosa" });

        // Get data from the request body;
        const { team_name, leader_email, department} = req.body;
        console.log("Datos recibidos:", req.body);

        //const departmentIndex = Object.keys(departments).find(key => departments[key] === department);

        // Validate that the data is not empty
        if (!team_name || !leader_email) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        // Validate that the email is in the correct format
        emailChecker(req, res);

        // Validate that the email exist in Personal_data table
        const result = await pool.request()
            .input("leader_email", leader_email)
            .query("SELECT * FROM Personal_data WHERE institutional_email = @leader_email");
        const rows = result.recordset;
        if (rows.length === 0) {
            console.error("Correo no encontrado en la base de datos:", { leader_email });
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "El correo no existe en la base de datos.",
                },
            });
        }

        // Validate that leader_email is not already registered in Teams_data table
        const result3 = await pool.request()
            .input("leader_email", leader_email)
            .query("SELECT * FROM Teams_data WHERE leader_email = @leader_email");
        const rows2 = result3.recordset;
        if (rows2.length > 0) {
            console.error("El participante ya hace parte de un equipo:", { leader_email });
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "Ya estas dentro de un equipo.",
                },
            });
        }

        // Validate that the team_name is not already registered in Teams_data table
        const result4 = await pool.request()
            .input("team_name", team_name)
            .query("SELECT * FROM Teams_data WHERE team_name = @team_name");
        const rows3 = result4.recordset;
        if (rows3.length > 0) {
            console.error("El nombre del equipo ya existe:", { team_name });
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "El nombre del equipo ya existe.",
                },
            });
        }

        //consult last id_number from db
        const result2 = await pool.request()
            .query("SELECT TOP 1 id FROM Teams_data ORDER BY id DESC");
        const lastId = result2.recordset[0].id;
        console.log("Ultimo id_number:", lastId);
        // Generate a new id_number based on the last one
        const id = parseInt(lastId) + 1;
        console.log("Nuevo id_number:", id);

        try {
            const timestamp = new global.Date(); // Get the current date and time
            pool.request()
                .input("team_name", team_name)
                .input("leader_email", leader_email)
                .input("id", id)
                .query("INSERT INTO Teams_data (team_name, leader_email, id) VALUES (@team_name, @leader_email, @id)");
                console.log("Equipo insertado:", { team_name, leader_email});

                return res.status(200).json({ message: "Registro exitoso" });

        } catch (error) {
            return res.status(400).json({ error: "Error al insertar en la base de datos" });
          }

    } catch (error) {
            console.error("Error al insertar en la base de datos:", error);
            res.status(500).json({ error: "Error al insertar en la base de datos" });
      }
}
