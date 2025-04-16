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

    const {university , study_area , career , data_treatment} = req.body;

    // Validate data
    if(!university || !study_area || !career || data_treatment === undefined){
        return res.status(400).json({
            notification: {
              type: "error",
              message: "Faltan datos requeridos.",
            },
          });
    }

    // Validate data treatment
    if (data_treatment === 0)
    {
        return res.status(400).json({
            notification: {
              type: "error",
              message: "Debes aceptar el tratamiento de datos.",
            },
          });
    }

    // Ask if we have to send to another url if the recaptcha fails
    // Validate the recaptcha
    // const isHuman = await verifyRecaptchaEnterprise(recaptchaToken);

    // if (!isHuman) {
    //     return res.status(400).json({
    //         notification: {
    //           type: "error",
    //           message: "Validación reCAPTCHA fallida. Intenta de nuevo.",
    //         },
    //     });
    // }

    // Get the email from the cookies
    const userEmail = getEmailFromCookies(req, res);
    if (!userEmail) {
        return res.status(400).json({
            notification: {
                type: "error",
                message: "Validación reCAPTCHA fallida. Intenta de nuevo.",
              },
            redirectUrl: "/" });
    }

    try {

        const pool = await connectToDatabase();

        try
        {
            await pool
                .request()
                .input("university", Int, university)
                .input("study_area", Int, study_area)
                .input("email", VarChar(255), userEmail)
                .input("data_treatment", TinyInt, data_treatment)
                .input("career", Int, career).query(`
                UPDATE Applicant_details
                SET university = @university, study_area = @study_area, career = @career , data_treatment = @data_treatment
                WHERE institutional_email = @email
                `);

            return res.status(200).json({
                notification: {
                type: "info",
                message: "Tus datos han sido guardados correctamente",
                },
                redirectUrl: "/confirmation/Individual/view3",
            });
        } catch (error) {
            console.error("❌ Error al guardar los datos:", error);
            return res.status(500).json({
                notification: {
                type: "error",
                message: "Error al guardar los datos",
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