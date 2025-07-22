import type { RequestHandler } from "express";

//Accès à la BDD
import userRepository from "./userRepository";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  is_admin: boolean;
  is_actif: boolean;
  abonnement_id: number;
  profil_picture_id: number;
}

//Le B DU Bread (Read All)
const browse: RequestHandler = async (req, res, next) => {
  try {
    //Fetch des users
    const user = await userRepository.readAll();
    //réponse des informations du user au format JSON
    res.json(user);
  } catch (err) {
    //Transmission des erreurs au middleware pour gestion des erreurs
    next(err);
  }
};

// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch via ID d'un élement de la table User
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    // Si l'élément est introuvable, on répond avec une page 404
    // Sinon, on répond avec l'élément en JSON
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};
// Le E du BREAD

const edit: RequestHandler = async (req, res, next) => {
  try {
    //Mettre à jour une information spécifique en fonction de l'ID fourni
    const user = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      is_admin: req.body.is_admin,
      is_actif: req.body.is_actif,
      abonnement_id: req.body.abonnement_id,
      profil_picture_id: req.body.profil_picture_id,
    };
    const affectedRows = await userRepository.update(user);
    // Si l'information n'est pas trouvée, répondre avec statut 404
    //Sinon répondre avec l'information au format JSON
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Transmission de toute erreur au middleware pour gestion des erreurs
    next(err);
  }
};

// Le A de BREAD - Créer une opération
const add: RequestHandler = async (req, res, next) => {
  try {
    // On extrait les donnés de l'élément du corps de la requête
    const newUser: Omit<User, "id"> = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      is_admin: req.body.is_admin,
      is_actif: req.body.is_actif,
      abonnement_id: req.body.abonnement_id,
      profil_picture_id: req.body.profil_picture_id,
    };
    // Création d'un user
    const insertId = await userRepository.create(newUser);

    // On répond avec http 201 (crée) et l'id de l'élément nouvellment inséré
    res.status(201).json({ insertId });
  } catch (err) {
    // On transmet toutes les erreurs au middlexare de gestion des erreurs
    next(err);
  }
};

// Le D de Destroyu du BREAD - Supprime un élément
const destroy: RequestHandler = async (req, res, next) => {
  try {
    //Supprime un élément spécifique en fonction de l'ID fourni
    const userId = Number(req.params.id);
    await userRepository.delete(userId);
    // Répondre quand avec un statut HTTP 204 (Requête correcte mais pas de corps de réponse à afficher)
    res.sendStatus(204);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Lire TOUS les users avec le type d'abonnement en plus
const browseWithAbonnement: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.readAllWithAbonnement();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Fonction qui récupère tous les utilisateurs et tous les animés qu'ils ont vus
const readAllWithUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.readAllWithUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
//Cette fonction ajoute un animé à l'historique de visionnage d'un utilisateur
const addToHistory: RequestHandler = async (req, res, next) => {
  try {
    //On récupère l'ID de l'utilisateur et de l'animé depuis le corps de la requête
    const userId = Number(req.body.userId);
    const animeId = Number(req.body.animeId);
    const addAnime = await userRepository.addToHistory(userId, animeId);
    res.json(addAnime);
  } catch (err) {
    next(err);
  }
};
//Cette fonction retourne uniquement les animés vus par un utilisateur spécifique
const readUserHistory: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const animeHistory = await userRepository.readUserHistory(userId);
    res.json(animeHistory);
  } catch (err) {
    next(err);
  }
};

// Pour la modification de l'image de profil
const editProfilPicture: RequestHandler = async (req, res, next) => {
  try {
    //Mettre à jour uniquement l'image de profil en fonction de l'ID fourni
    const id = Number(req.body.id);
    const profil_picture_id = req.body.profil_picture_id;
    const affectedRows = await userRepository.updateProfilPicture(
      id,
      profil_picture_id,
    );
    // Si l'information n'est pas trouvée, répondre avec statut 404
    //Sinon répondre avec l'information au format JSON
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.json({ id, profil_picture_id });
    }
  } catch (err) {
    // Transmission de toute erreur au middleware pour gestion des erreurs
    console.error("Erreur de mise à jour de l'image de profil :", err);
    next(err);
  }
};

// Pour lire toutes les images de profil
const readAllProfilPicture: RequestHandler = async (req, res, next) => {
  try {
    //Fetch des images de profil
    const pictures = await userRepository.readAllPicture();
    //réponse des informations des images de profil au format JSON
    res.json(pictures);
  } catch (err) {
    //Transmission des erreurs au middleware pour gestion des erreurs
    next(err);
  }
};

// Pour récupérer le bon id de la picture selon l'id du user
const readUrlPicture: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const urlPicture = await userRepository.readUrlPicture(userId);
    res.json(urlPicture);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  edit,
  add,
  destroy,
  browseWithAbonnement,
  readAllWithUsers,
  addToHistory,
  readUserHistory,
  editProfilPicture,
  readAllProfilPicture,
  readUrlPicture,
};
