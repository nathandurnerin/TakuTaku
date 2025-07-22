import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt, { sign } from "jsonwebtoken";
import userRepository from "../user/userRepository";

// Clé secrète pour signer les tokens et verifier leur authenticité (obligatoire pour la sécurité, à mettre dans .env ne doit pas être exposée)
const tokenKey = process.env.JWT_SECRET;
if (!tokenKey) {
  throw new Error("La clé secrète du token n'est pas définie dans le .env");
}

// Fonction asynchrone de connexion d'un utilisateur (login)
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const signIn = async (request: Request, response: Response): Promise<any> => {
  // Récupération des données envoyées depuis le client via le formulaire et insertion dans le corps de la requête
  const { mail, password } = request.body;
  // Appel du repository pour vérifier si un utilisateur existe dans la base de donnees
  const user = await userRepository.signIn(mail, password);

  if (!user) {
    return response.status(401).send({ message: "Erreur d'authentification" });
  }

  // Vérifier le mot de passe
  const isPasswordValid = bcrypt.compareSync(password, user.password || "");

  // Si le mot de passe est incorrect, renvoyer une erreur 401
  if (!isPasswordValid) {
    return response.status(401).send({ message: "Mot de passe incorrect" });
  }

  // Si un user est trouvé, récupération du token de l'utilisateur
  const userId = user.id;
  const token = jwt.sign({ id: userId }, tokenKey);
  // Envoie au client un message de succes, le token dauthentification (JWT) et l'identifiant du nouvel utilisateur
  response.send({
    message: "Utilisateur connecté",
    token: token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      mail: user.mail,
      abonnement_id: user.abonnement_id,
      is_admin: Boolean(user.is_admin),
      is_actif: Boolean(user.is_actif),
    },
  });
};

// Fonction asynchrone de creation dun utilisateur (inscription)
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const signUp = async (request: Request, response: Response): Promise<any> => {
  // Récupération des données envoyées depuis le client via le formulaire et insertion dans le corps de la requête
  const {
    firstname,
    lastname,
    mail,
    password,
    abonnement_id,
    is_actif,
    is_admin,
  } = request.body;
  const passHash = bcrypt.hashSync(password, 8);

  const user = await userRepository.signUp(
    firstname,
    lastname,
    mail,
    passHash,
    abonnement_id,
    is_admin,
    is_actif,
  );
  console.log("user", user);
  if (!user) {
    return response
      .status(500)
      .send({ message: "Utilisateur créé mais non retrouvé" });
  }
  // Si un user est cree, un token lui est attribue qui permet de l'identifier lors des futures requetes
  const token = jwt.sign({ user }, tokenKey);
  // Envoie au client un message de succees, le token dauthentification (JWT) et l'identifiant du nouvel utilisateur
  // Renvoyer tout l'objet user + token
  response.send({
    user: user,
    token: token,
  });
};

export default { signIn, signUp };
