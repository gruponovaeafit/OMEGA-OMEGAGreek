import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import emailChecker from "../emailCheker";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { getEmailFromCookies } from "../getEmailFromCookies";
import sql from "mssql";

//First view, where the institutional email is stored

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    // Db connection
    
    try {

        if (req.method !== "POST") {
            return res.status(405).json({ message: "Método no permitido" });
        }
        const pool = await connectToDatabase();

        const institutional_email  = req.body.institutional_email;

        // 1: Validate that the data is not empty    
        if (!institutional_email) {
            console.error("Campo faltante");
            return res.status(400).json({ error: "Faltan datos requeridos" });  
        }
        const emailLower = institutional_email.toLowerCase();

        


        // 2: Validate recaptcha token
        // if (!token) {
        //     console.error("Token de reCAPTCHA faltante");
        //     return res.status(400).json({
        //       notification: {
        //         type: "error",
        //         message: "Falta el token de reCAPTCHA.",
        //       },
        //     });
        // }

       

        try {

            const existingUser = await pool
            .request()
            .input("email", sql.VarChar, emailLower)
            .query("SELECT TOP 1 institutional_email FROM Personal_data WHERE institutional_email = @email");

            // 3: Validate email format
            const emailCheckResponse =  emailChecker(req, res);
            if (emailCheckResponse !== 200) {
            console.error("El correo no pasó la validación:", { institutional_email });
            return res.status(emailCheckResponse).json({
                notification: {
                type: "error",
                message: "El correo no tiene un dominio válido.",
                },
            });
            }
             // 4: Store the email in the cookies

            const jwtToken = jwt.sign({ email: institutional_email }, process.env.JWT_KEY as string, {
                expiresIn: "5m",
            });

            // Setting cookie
            res.setHeader(
                "Set-Cookie",
                serialize("jwtToken", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "development",
                maxAge: 3600,
                path: "/",
                sameSite: "strict",
                })
            );


            //5: Validate that the email does not exist in the database
            try {
                if (existingUser.recordset.length > 0) {
                    const user = existingUser.recordset[0];
                    console.log("Usuario encontrado:", user);
                    // Verify if the user has forms to complete searching for the specific fields of each form in the database
                    // The first form has the fields "name", "surname", "id_number", "birth_date", "data_treatment" 
                    const userData = await pool
                    .request()
                    .input("email", sql.VarChar, emailLower)
                    .query("SELECT TOP 1 * FROM Personal_data WHERE institutional_email = @email");
                    const userInfo = userData.recordset[0];
                    console.log("Datos del primer formulario: ", userInfo);
                    // Check if the user has completed the first form
                    if (userInfo.name && userInfo.surname && userInfo.id_number && userInfo.birth_date && userInfo.data_treatment) {
                        console.log("Primer formulario completado", user);
                    
                    } else {
                        const incompleteFields = [];
                        if (!userInfo.name) incompleteFields.push("name");
                        if (!userInfo.surname) incompleteFields.push("surname");
                        if (!userInfo.id_number) incompleteFields.push("id_number");
                        if (!userInfo.birth_date) incompleteFields.push("birth_date");
                        if (!userInfo.data_treatment) incompleteFields.push("data_treatment");
                        console.log("Campos incompletos Formulario 2: ", incompleteFields);

                        return res.status(200).json({
                            notification: {
                                type: "info",
                                message: "Tienes datos pendientes por completar (2).",
                            },
                            incompleteFields,
                            redirectUrl: "/registration/individual",
                        });
                    
                    }
                    // Check if the user has completed the second form
                    if (userInfo.preferred_role_1 && userInfo.preferred_role_2) {
                        console.log("Segundo formulario completado", user);
                    } else {
                        const incompleteFields = [];
                        if (!userInfo.preferred_role_1) incompleteFields.push("preferred_role1");
                        if (!userInfo.preferred_role_2) incompleteFields.push("preferred_role2");
                        console.log("Campos incompletos Formulario 3: ", incompleteFields);

                        return res.status(200).json({
                            notification: {
                                type: "info",
                                message: "Tienes datos pendientes por completar (3).",
                            },
                            incompleteFields,
                            redirectUrl: "/registration/individual/view2",
                        });
                    }
                    // Check if the user has completed the third form   
                    if (userInfo.how_did_hear && userInfo.has_time && userInfo.phone && userInfo.previus_participation) {
                        console.log("Tercer formulario completado", user);
                    } else {
                        const incompleteFields = [];
                        if (!userInfo.how_did_hear) incompleteFields.push("how_did_hear");
                        if (!userInfo.has_time) incompleteFields.push("has_time");
                        if (!userInfo.phone) incompleteFields.push("phone");
                        if (!userInfo.previus_participation) incompleteFields.push("previus_participation");
                        console.log("Campos incompletos Formulario 4: ", incompleteFields);

                        return res.status(200).json({
                            notification: {
                                type: "info",
                                message: "Tienes datos pendientes por completar (4).",
                            },
                            incompleteFields,
                            redirectUrl: "/registration/individual/view3",
                        });
                    }
            
                    return res.status(200).json({
                    notification: {
                        type: "info",
                        message: "Ya completaste el formulario de registro individual.",
                    },
                    redirectUrl: "/registration",
                    });
                }
            }
            catch (error) {
                console.error("Error al verificar si el correo ya existe:", error);
                return res.status(500).json({
                    notification: {
                        type: "error",
                        message: "Error al verificar si el correo ya existe.",
                    },
                });
            }

            //6: Insert new email

            await pool.request().input("email", sql.VarChar, emailLower).query(`
                INSERT INTO Personal_data (institutional_email)
                VALUES (@email)
              `);
              console.log("Correo insertado correctamente:", institutional_email);


            // Routing to the second form
            return res.status(200).json({
                notification: {
                type: "success",
                message: "Correo electrónico guardado correctamente.",
                },
                redirectUrl: "/registration",
            });

        } catch (error) {
            console.error("Error al insertar el correo en la base de datos:", error);
            return res.status(500).json({
            notification: {
                type: "error",
                message: "Error al insertar el correo en la base de datos.",
            },
            });
        }

      } catch (error) {
        res.status(500).json({
            notification: {
                type: "error",
                message: "Error al insertar el correo en la base de datos.",
            },
            });
    }


}