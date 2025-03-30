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

        // Get data from the request body
        const {name , surname , institutional_email , id_number , phone , birth_date , how_did_hear , has_availability , previous_participation , preferred_rol_1 , preferred_rol_2 , data_treatment} = req.body;
        console.log("Datos recibidos:", req.body);


        // Validate that the data is not empty
        if (!name || !surname || !id_number || !phone || !birth_date || !how_did_hear || has_availability === undefined || previous_participation === undefined || data_treatment === undefined) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        //Validate that the birthdate is more tan 15 years old
        const birthDate = new global.Date(birth_date);
        const today = new global.Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 15) {
            return res.status(400).json({ error: "Debes tener al menos 15 años para registrarte" });
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

        try {
            const time_stamp = new global.Date(); // Get the current date and time
            pool.request()
            .input("name", VarChar, name)
            .input("surname", VarChar, surname)
            .input("institutional_email", VarChar, institutional_email)
            .input("id_number", VarChar, id_number)
            .input("phone", VarChar, phone)
            .input("birth_date", Date, birth_date)
            .input("how_did_hear", Text, how_did_hear)
            .input("has_availability", TinyInt, has_availability)
            .input("previous_participation", TinyInt, previous_participation)
            .input("preferred_rol_1", VarChar, preferred_rol_1)
            .input("preferred_rol_2", VarChar, preferred_rol_2)
            .input("data_treatment", TinyInt, data_treatment)
            .input("time_stamp", DateTime, time_stamp)
            .query("INSERT INTO users (name, surname, id_number, phone, birth_date, how_did_hear, has_availability, previous_participation, data_treatment, time_stamp) VALUES (@name, @surname, @id_number, @phone, @birth_date, @how_did_hear, @has_availability, @previous_participation, @data_treatment, @time_stamp)");

            return res.status(200).json({ message: "Usuario insertado correctamente" });

        } catch (error) {
            return res.status(400).json({ error: "Error al insertar el usuario en la base de datos" });
        }

      } catch (error) {
        res.status(500).json({ error: "Error conectando a la base de datos" });
    }

}