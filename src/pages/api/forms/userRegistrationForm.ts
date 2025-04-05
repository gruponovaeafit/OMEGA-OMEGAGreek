import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Date, DateTime, Text, TinyInt, VarChar } from "mssql";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    //Db connection
    try {

        if (req.method !== "POST") {
            return res.status(405).json({ message: "Método no permitido" });
        }

        const pool = await connectToDatabase();
        res.status(200).json({ message: "Conexión exitosa" });
        // Get data from the request body;

        const {name , surname , institutional_email , id_number , phone , birth_date , how_did_hear , has_availability , previous_participation , preferred_rol_1 , preferred_rol_2 , data_treatment } = req.body;
        console.log("Datos recibidos:", req.body);

        // Validate that the data is not empty

        if (!name || !surname || !id_number || !phone || !birth_date || !how_did_hear || has_availability === undefined || previous_participation === undefined || data_treatment === undefined) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        // Validate that the birthdate  is  more than 15 years ago
        const birthDate = new global.Date(birth_date);
        const today = new global.Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 15) {
          console.error("Edad inválida:", { birth_date });
            return res.status(400).json({ error: "Debes tener al menos 16 años para registrarte." });
        }

        // Validate that the email is in the correct format
        if (!institutional_email || !institutional_email.endsWith("@eafit.edu.co")) {
            console.error("Correo inválido o faltante:", { institutional_email });
            return res.status(400).json({
              notification: {
                type: "error",
                message: "El correo debe ser del dominio @eafit.edu.co.",
              },
            });
          }
        // valitade that the institutional email is not already registered

        try {
            const result = await pool.request()
                .input("institutional_email", VarChar(50), institutional_email)
                .query("SELECT * FROM Personal_data WHERE institutional_email = @institutional_email");
            if (result.recordset.length > 0) {
                console.error("El correo ya está registrado:", { institutional_email });
                return res.status(400).json({ error: "El correo ya está registrado" });
            }
        }
        catch (error) {console.error("Error al verificar el correo:", error);}


        try {
            const timestamp = new global.Date(); // Get the current date and time
            pool.request()
            .input("name", VarChar(50), name)
            .input("surname", VarChar, surname)
            .input("institutional_email", VarChar, institutional_email)
            .input("id_number", VarChar, id_number)
            .input("phone", VarChar, phone)
            .input("birth_date", Date, birth_date)
            .input("how_did_hear", Text, how_did_hear)
            .input("has_time", TinyInt, has_availability)
            .input("previous_participation", TinyInt, previous_participation)
            .input("preferred_rol_1", VarChar, preferred_rol_1)
            .input("preferred_rol_2", VarChar, preferred_rol_2)
            .input("data_treatment", TinyInt, data_treatment)
            .query("INSERT INTO Personal_data (name, surname, institutional_email, id_number, phone, birth_date, how_did_hear, has_time, previous_participation, data_treatment) VALUES (@name, @surname, @institutional_email, @id_number, @phone, @birth_date, @how_did_hear, @has_time, @previous_participation, @data_treatment)");

            console.log("Usuario insertado correctamente:");
            return res.status(200).json({ message: "Usuario insertado correctamente" });

        } catch (error) {
            return res.status(400).json({ error: "Error al insertar el usuario en la base de datos" });
        }

      } catch (error) {
        res.status(500).json({ error: "Error conectando a la base de datos" });
    }
    

}
