import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export default function cookieCheck(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Parse cookies from the request headers
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};

    // Check if the cookie (jwtToken) exists
    if (!cookies.jwtToken) {
      // If no JWT cookie, return a 401 Unauthorized status
      return res.status(401).json({ message: "No autorizado" });
    }

    // If the cookie exists, you can continue with the request handling
    return res.status(200).json({ message: "Autorizado" });
  }

  return res.status(405).json({ message: "Método no permitido" });
}
