import type { RequestHandler } from "express";

// Accès à la base de données
import animeRepository from "./animeRepository";

interface Anime {
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  date: number;
  genre_id?: number;
  genre_name?: string;
  paysage: string;
  video: string;
}

// Le B du BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch tout les animes
    const animes = await animeRepository.readAll();

    // Reponse avec les animes au format JSON
    res.json(animes);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};
const browseType: RequestHandler = async (req, res, next) => {
  try {
    const { genre, type } = req.params;
    // Fetch tout les animes
    const animes = await animeRepository.readAllType(genre, type);
    // Reponse avec les animes au format JSON
    res.json(animes);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch un élément spécifique à partir de l'ID fourni
    const animeId = Number(req.params.id);
    const anime = await animeRepository.read(animeId);

    // Si l'élément est introuvable, répondez avec HTTP 404 (Introuvable)
    // Sinon, répondez avec l'élément au format JSON
    if (anime == null) {
      res.sendStatus(404);
    } else {
      res.json(anime);
    }
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Le E de BREAD
const edit: RequestHandler = async (req, res, next) => {
  try {
    // Mettre à jour une catégorie spécifique en fonction de l'identifiant fourni.
    console.log("Body reçu:", req.body);
    const anime = {
      id: Number(req.params.id),
      title: req.body.title,
      synopsis: req.body.synopsis,
      portrait: req.body.portrait,
      date: req.body.date,
      genre_name: req.body.genre_name,
      genre_id: req.body.genre_id,
      paysage: req.body.paysage,
      video: req.body.video,
    };

    const affectedRows = await animeRepository.update(anime);

    // Si la catégorie n’est pas trouvée, répondre avec un code HTTP 404 (Non trouvé)
    // Sinon, répondre avec la catégorie au format JSON.
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.json(anime);
    }
  } catch (err) {
    // Transmettre toute erreur au middleware de gestion des erreurs.
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extraire les données de l'élément du corps de la requête
    // Préparer un nouvel anime sans l'id et avec genre_id obligatoire
    const newAnime = {
      title: req.body.title,
      synopsis: req.body.synopsis,
      portrait: req.body.portrait,
      date: req.body.date,
      genre_name: req.body.genre_name,
      genre_id: Number(req.body.genre_id),
      paysage: req.body.paysage,
      video: req.body.video,
    };
    // Create the anime
    const insertId = await animeRepository.create(newAnime);

    // Répondez avec HTTP 201 (Créé) et l'ID de l'élément nouvellement inséré
    res.status(201).json({ insertId });
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Le D de Destroy - Supprimer l'élément
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Supprimer une catégorie spécifique en fonction de l'ID fourni
    const animeId = Number(req.params.id);

    await animeRepository.delete(animeId);

    // Répondez quand même avec HTTP 204 (Aucun contenu)
    res.sendStatus(204);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Lire TOUS les animés avec le genre en plus
const browseWithGenre: RequestHandler = async (req, res, next) => {
  try {
    const animes = await animeRepository.readAllWithGenre();
    res.json(animes);
  } catch (err) {
    next(err);
  }
};

// Lire TOUS les animés avec la Note en plus
const browseWithNote: RequestHandler = async (req, res, next) => {
  try {
    const animes = await animeRepository.readAllWithNote();
    res.json(animes);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  add,
  destroy,
  edit,
  browseWithGenre,
  browseType,
  browseWithNote,
};
