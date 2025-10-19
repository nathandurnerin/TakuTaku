// server/src/middleware/security.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    auth?: { id: number; mail?: string; role?: string };
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization || "";
    // supporte "Bearer xxx" ou directement "xxx"
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    if (!token) return res.status(401).json({ message: "Accès non autorisé" });

    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      mail?: string;
      role?: string;
      exp?: number;
      iat?: number;
    };

    if (!payload?.id) return res.status(401).json({ message: "Unauthorized" });

    // on stocke l’info d’auth ici (pas dans req.body)
    req.auth = { id: payload.id, mail: payload.mail, role: payload.role };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default { checkToken };
