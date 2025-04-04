import type { NextApiRequest, NextApiResponse } from "next";

export default async function emailChecker(req: NextApiRequest, res: NextApiResponse) {

    const emailDomains = ["@eafit.edu.co", "@unal.edu.co", "@pascualbravo.edu.co", ];
    //Check if the email is valid
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }
    const { institutional_email } = req.body;
    console.log("Datos recibidos:", institutional_email);
    // Validate that the email is not empty
    if (!institutional_email) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    // Validate that the email's domain is in the list of allowed domains
    const isValidDomain = emailDomains.some((domain) => institutional_email.endsWith(domain));
    if (!isValidDomain) {
        console.error("Dominio de correo electrónico no permitido:", { institutional_email });
        return res.status(400).json({ error: "El dominio del correo electrónico no está permitido" });
    }

}