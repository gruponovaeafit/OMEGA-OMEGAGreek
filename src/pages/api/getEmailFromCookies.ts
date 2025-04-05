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
    res.status(401).json({ success: false, message: "No se encontraron cookies" });
    return null;
  }

  const parsedCookies = parse(cookies);

  // Extract the JWT token from the cookies
  const jwtToken = parsedCookies.jwtToken;

  // Check if the JWT token is present in the cookies
  if (!jwtToken) {
    res.status(401).json({ success: false, message: "No se encontró el token en las cookies" });
    return null;
  }

  try {
    // Obtain the email from the JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_KEY as string) as { email: string };
    return decoded.email;
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido o expirado. " + error });
    return null;
  }
}
