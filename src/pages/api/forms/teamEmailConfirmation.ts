//Validate that the email is in Teams_data
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Int, Date as SqlDate, TinyInt, VarChar } from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";
import verifyRecaptchaEnterprise from "../verifyRecaptchaEnterprise";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,

) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { recaptchaToken, leader_email } = req.body;

    // Validate data
    if (!leader_email) {
        return res.status(400).json({
            notification: {
                type: "error",
                message: "No se ingreso ningun correo.",
            },
        });
    }

    // Ask if we have to send to another url if the recaptcha fails
    // Validate the recaptcha
    const isHuman = await verifyRecaptchaEnterprise(recaptchaToken);

    if (!isHuman) {
        return res.status(400).json({
            notification: {
                type: "error",
                message: "Validación reCAPTCHA fallida. Intenta de nuevo.",
            },
        });
    }

   

    try {

        const pool = await connectToDatabase();

        try {
            const isThereLeaderEmail = await pool
                .request()
                .input("leader_email", VarChar(100), leader_email).query(`
                SELECT leader_email from Teams_data
                WHERE leader_email = @leader_email
                `);

            if (isThereLeaderEmail.recordset.length === 0) {
                return res.status(400).json({
                    notification: {
                        type: "error",
                        message: "El correo no es de un lider.",
                    },
                });

            } else

            {
                const leaderEmailLower = leader_email.toLowerCase();
                // Generar JWT
                const jwtToken = jwt.sign(
                    { email: leaderEmailLower},
                    process.env.JWT_KEY as string,
                    {
                        expiresIn: "20m",
                    },
                );
                // Generate Cookies and store JWT in it
                res.setHeader(
                    "Set-Cookie",
                    serialize("jwtToken", jwtToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        maxAge: 3600,
                        path: "/",
                        sameSite: "strict",
                    }),
                );

                return res.status(200).json({
                    notification: {
                        type: "info",
                        message: "El correo es valido.",
                        redirectUrl: "/teamNameConfirmation",
                    }
                });
            }

        }
        catch (error) {
            console.error("❌ Error al consultar el correo:", error);
            return res.status(500).json({
                notification: {
                    type: "error",
                    message: "Error al consultar el correo",
                },
            });
        }

    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        return res.status(500).json({
            notification: {
                type: "error",
                message: "Error al conectar a la base de datos",
            },
        });
    }

}