import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Date, Text, TinyInt, VarChar } from "mssql";
import { get } from "http";
import { getEmailFromCookies } from "../getEmailFromCookies";


// Second view, where the personal data is stored

export default async function handler(req: NextApiRequest, res: NextApiResponse){


    try {

        if (req.method !== "POST") {
            return res.status(405).json({ 
                notification: {
                    type: "error",
                    message: "El método no es permitido",
                    },
            });
        }

        const pool = await connectToDatabase();

        // set as index the roles names
        const rolesNames: Record<number, string> = {
            1: "Administrador",
            2: "Diseño",
            3: "Mercadeo",
            4: "Desarrollo",
          };

          let { preferred_role1, preferred_role2 } = req.body;

          const roleNameToIndex = Object.entries(rolesNames).reduce((acc, [index, name]) => {
            acc[name] = Number(index);
            return acc;
          }, {} as Record<string, number>);

          preferred_role1 = roleNameToIndex[preferred_role1] || null;
          preferred_role2 = roleNameToIndex[preferred_role2] || null;

          console.log("preferred_role1 (index):", preferred_role1);
          console.log("preferred_role2 (index):", preferred_role2);


        // Validate that the data is not empty

        if (!preferred_role1 || !preferred_role2  === null) {
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "Seleccion invalida",
                    },
                status: 400,
             });
        }

        try {

            // get the institutional email from the cookies
            const userEmail = getEmailFromCookies(req, res);

            if (userEmail == null) {
                return res.status(400).json({
                    
                    status: 400,
                    redirectUrl: "/email"
                 });
            }

            console.log("Correo electrónico del usuario desde cookies:", userEmail);

        
            await pool.request()
                .input("rol1", VarChar(20), preferred_role1)
                .input("rol2", VarChar(20), preferred_role2)
                .input("email", VarChar(255), userEmail)
                .query("UPDATE Personal_data SET preferred_role_1 = @rol1, preferred_role_2 = @rol2 WHERE email = @email");

            // Routing to the third view
            console.log("Usuario insertado correctamente:");
            return res.status(200).json({
                notification: {
                    type: "info",
                    message: "Tus datos han sido guardados correctamente",
                    },
                status: 200,
                redirectUrl: "/registration/individual/view3",

            });

        } catch (error) {
            return res.status(400).json({
                notification: {
                    type: "error",
                    message: "Error al guardar los datos",
                    },
                status: 400,
             });
        }

      } catch (error) {
        res.status(500).json({
            notification: {
                type: "error",
                message: "Error conectando a la base de datos",
                },
         });
    }
    

}
