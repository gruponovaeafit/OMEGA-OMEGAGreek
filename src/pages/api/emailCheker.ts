import type { NextApiRequest, NextApiResponse } from "next";

export default function emailChecker(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const emailDomains = [
    "@eafit.edu.co",
    "@unal.edu.co",
    "@pascualbravo.edu.co",
    "@itm.edu.co",
    "@udea.edu.co",
    "@upb.edu.co",
    "@iush.edu.co",
    "@comunidad.iush.edu.co"
  ];

  // Check if the email is valid
  if (req.method !== "POST") {
    return 405;
  }

  const { institutional_email } = req.body;

  // Validate that the email is not empty
  if (!institutional_email) {
    return 400;
  }

  // Validate that the email's domain is in the list of allowed domains
  const isValidDomain = emailDomains.some((domain) =>
    institutional_email.endsWith(domain),
  );
  if (!isValidDomain) {
    console.error("Dominio de correo electrónico no permitido:", {
      institutional_email,
    });
    return 400;
  }

  // If everything is valid
  return 200;
}
