import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../db";
import { Int, Date as SqlDate, TinyInt, VarChar } from "mssql";
import { getEmailFromCookies } from "../getEmailFromCookies";
import verifyRecaptchaEnterprise from "../verifyRecaptchaEnterprise";

//almacenamos los datos de las areas de estudio y carreras en arrays
// para evitar consultas innecesarias a la base de datos y poder obtener el id de las carreras y areas de estudio

//utilizamos i y j para manejar if y saber que consulta debemos hacer

const study_area_complete: { id: number; area_name: string }[][] = [];
const careers_caeers_complete: { id: number; career_name: string }[][] = [];
let i = 0
let j = 0

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,

) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const {university} = req.body;

    const universityMap: Record<string, number> = {
      "Universidad Nacional": 1,
      "Universidad de Antioquia": 2,
      "Instituto Tecnologico Metropolitano": 3,
      "Universidad Pontificia Bolivariana": 4,
      "Institucion Universitaria Pascual Bravo": 5,
      "Institucion Universitaria Salazar y Herrera": 6,
      "Universidad EAFIT": 7,
    };

    const university1 = universityMap[university] ?? null;
    let study_area_id = undefined;
    let career_id = undefined;

    // Validate data
    if(!university1){
        return res.status(400).json({
            notification: {
              type: "error",
              message: "Faltan datos requeridos uni.",
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

        console.log(i, "estudio area completo")
        try {
          //verifica que el valor de i sea 0 para hacer la consulta a la base de datos
          if(!i){
            const result = await pool
              .request()
              .input("university", Int, university1)
              .query(`
              SELECT * FROM Areas WHERE university = @university
              `);

            const study_area = []
            //incrementamos el valor de i para que no vuelva a hacer la consulta a la base de datos
            i += 1
            study_area_complete.push(result.recordset)

            for (const row of result.recordset) {
              console.log("Fila:", row);
              console.log("Nombre del área:", row.area_name);
              study_area.push(row.area_name);
            }

            console.log("Nombres de las áreas:", study_area);

            res.status(200).json({
              notification: {
                type: "success",
                message: "Datos obtenidos correctamente w.",
              },
              study_area: study_area,
            });
          }
        } catch (error) {
            console.error("❌ Error al obtener las áreas de estudio:", error);
            return res.status(500).json({
                notification: {
                    type: "error",
                    message: "Error al obtener las áreas de estudio",
                },
            });
        }

        //obtenemos el area de estudio del body

        const {study_area} = req.body;
        if (!study_area) {
            return res.status(400).json({
                notification: { type: "error", message: "Faltan datos requeridos area." },
            });
        }

        // Search study area id in study_area_complete
        study_area_id = study_area_complete[0].find((area) => area.area_name === study_area)?.id;
        if (!study_area_id) {
            return res.status(400).json({
                notification: { type: "error", message: "Área de estudio no encontrada." },
            });
        }
        console.log("ID del área de estudio:", study_area_id);

        try {
          //verifica que el valor de j sea 0 para hacer la consulta a la base de datos
          if(!j){
            const result = await pool
              .request()
              .input("area_id", Int, study_area_id)
              .query(`
              SELECT * FROM careers WHERE area = @area_id
              `);

            const careers1 = []
            //incrementamos el valor de j para que no vuelva a hacer la consulta a la base de datos
            j += 1
            careers_caeers_complete.push(result.recordset)

            for (const row of result.recordset) {
              console.log("Fila:", row);
              console.log("Nombre de la carrera:", row.career_name);
              careers1.push(row.career_name);
            }

            console.log("Nombres de las carreras:", careers1);

            res.status(200).json({
              notification: {
                type: "success",
                message: "Datos obtenidos correctamente.",
              },
              careers: careers1,
            });
          }

        }catch (error) {
          console.error("❌ Error al obtener los datos:", error);
          return res.status(500).json({
            notification: {
              type: "error",
              message: "Error al obtener los datos",
            },
          });
        }

        //verificamos que el id de la carrera sea undefined y que el array de carreras
        // no este vacio para consultar el id de la carrera del body
        if (career_id === undefined && careers_caeers_complete.length > 0) {
            try {
              const { career } = req.body;
              if (!career) {
                  return res.status(400).json({
                      notification: { type: "error", message: "Faltan datos requeridos area." },
                  });
              }

              // Search study area id in study_area_complete
              career_id = Array.isArray(careers_caeers_complete[0])
                  ? careers_caeers_complete[0].find((carrera: { career_name: string; id: number }) => carrera.career_name === career)?.id
                  : undefined;
              console.log("ID del área de estudio:", career_id);

              res.status(200).json({
                notification: {
                  type: "success",
                  message: "Datos obtenidos correctamente.",
                },
                career_id: career_id,
                study_area_id: study_area_id,
              });

              console.log("ID del área de estudio:", study_area_id);
              console.log("ID del área de carrera:", career_id);

            } catch (error) {
              console.error("❌ Error al obtener los datos:", error);
              return res.status(500).json({
                notification: {
                  type: "error",
                  message: "Error al obtener los datos",
                },
              });
            }
          }

        // Get the data_treatment from the body
        const { data_treatment } = req.body;
        if (!data_treatment) {
            return res.status(400).json({
                notification: {
                  type: "error",
                  message: "Faltan datos requeridos data.",
                },
              });
        }

        //Verificamos que los datos no esten vacios
        if(!university1 || !study_area_id || !career_id || !data_treatment) {
            return res.status(400).json({
                notification: {
                  type: "error",
                  message: "Faltan datos requeridos uni.",
                },
              });
        }

        try
        {
            await pool
                .request()
                .input("university", Int, university1)
                .input("study_area", Int, study_area_id)
                .input("email", VarChar(255), userEmail)
                .input("data_treatment", TinyInt, data_treatment)
                .input("career", Int, career_id).query(`
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
    }catch (error) {
        console.error("❌ Error al guardar los datos:", error);
        return res.status(500).json({
            notification: {
            type: "error",
            message: "Error al guardar los datos",
            },
        });
    }
}