import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

interface JwtPayload extends DefaultJwtPayload {
  id: number;
}
//Middleware qui protège une route on vérifie si le token a été envoyé par le client et s'il est valide (il reçoit tous les objets req,res,next)
export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization; // on récupère le token envoyé dans les headers de la requête http du client(dans le champs Autorization + précisément)

  if (!token) {
    res.status(401).send({ message: "Accès non autorisé" });
    return;
  } //Si le client n'envoie pas de Token alors on bloque l'accès

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).send({ message: "Unauthorized" });
    } //Grâce a verify on vérifie si le token est unique (fonctionnalité native de JWT) pour ça on lui donne : le token et la clé secrète

    const payload = decoded as JwtPayload;
    if (payload?.id) {
      req.body.userID = payload.id;
    } //On ajoute l'ID de l'utilisateur dans le corps de la requête pour qu'il soit accessible dans les prochaines étapes du traitement de la requête
    next();
  });
};

export default { checkToken };
