import type { RequestHandler } from "express";

//Accès à la BDD
import favoriteAnimeRepository from "./favoriteAnimeRepository";

interface FavoriteAnime {
  id?: number; // L'id est optionnel pour les créations
  users_id: number;
  anime_id: number;
}

const browse: RequestHandler = async (req, res, next) => {
  try {
    //Fetch des favoris
    const users_id = Number(req.params.users_id);
    const favori = await favoriteAnimeRepository.readAll(users_id);
    //réponse au format JSON
    res.json(favori);
  } catch (err) {
    //Transmission des erreurs au middleware pour gestion des erreurs
    next(err);
  }
};

// Le R du BREAD - Logique pour lire un favori spécifique
const read: RequestHandler = async (req, res, next) => {
  try {
    const users_id = Number(req.params.users_id);
    const anime_id = Number(req.params.anime_id);
    const favori = await favoriteAnimeRepository.read(users_id, anime_id);
    if (!favori) res.sendStatus(404);
    else res.json(favori);
  } catch (error) {
    next(error);
  }
};

// Le A de BREAD - Créer une opération
const add: RequestHandler = async (req, res, next) => {
  try {
    // On extrait les donnés de l'élément du corps de la requête
    const newFavori: FavoriteAnime = {
      users_id: req.body.users_id,
      anime_id: req.body.anime_id,
    };
    // Création d'un favori
    const insertFavorite = await favoriteAnimeRepository.create(newFavori);

    // On répond avec http 201 (crée) et l'id de l'élément nouvellement inséré
    res.status(201).json({ insertFavorite });
  } catch (err) {
    // On transmet toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Le D du BREAD - Logique pour supprimer un favori spécifique
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const users_id = Number(req.params.users_id);
    const anime_id = Number(req.params.anime_id);
    const id = Number(req.params.id);

    const affectedRows = await favoriteAnimeRepository.delete(
      users_id,
      anime_id,
      id,
    );

    if (!affectedRows) res.sendStatus(404);
    else res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default { browse, read, add, destroy };
