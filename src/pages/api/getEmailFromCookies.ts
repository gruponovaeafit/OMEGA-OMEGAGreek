import { NextApiRequest, NextApiResponse } from "next";
import {parse} from "cookie";
import jwt from "jsonwebtoken";

export function getEmailFromCookies(
  req: NextApiRequest,
  res: NextApiResponse
): string | null {
  // Check if the request has cookies
  const cookies = req.headers.cookie;
  if (!cookies) {
    console.error("No se encontraron cookies", { cookies });
    res.status(401).json({ success: false, 
      notification: {
        type: "info",
        message: "Tus credenciales han expirado, ingresa de nuevo.",
        },
    });
    return null;
  }

  const parsedCookies = parse(cookies);

  // Extract the JWT token from the cookies
  const jwtToken = parsedCookies.jwtToken;

  // Check if the JWT token is present in the cookies
  if (!jwtToken) {
    console.error("No se encontró el token en las cookies", { cookies });
    res.status(401).json({ success: false,
      notification: {
        type: "error",
        message: "Tus credenciales han expirado, ingresa de nuevo.",
        },
    });
    return null;
  }

  try {
    // Obtain the email from the JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_KEY as string) as { email: string };
    console.log("Token decodificado:", decoded);
    return decoded.email;
  } catch (error) {
    console.error("Error al decodificar el token");
    res.status(401).json({ success: false, 
      notification: {
        type: "info",
        message: "Tus credenciales han expirado, ingresa de nuevo.",
        },
     });
    return null;
  }
}
