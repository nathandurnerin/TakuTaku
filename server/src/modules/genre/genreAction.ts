import type { RequestHandler } from "express";

// Accès à la base de données
import genreRepository from "./genreRepository";

interface Genre {
  id: number;
  name: string;
}

// Le B du BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, resizeBy, next) => {
  try {
    // Fetch tout les genres
    const genres = await genreRepository.readAll();

    // Reponse avec les genres au format JSON
    resizeBy.json(genres);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch un élément spécifique à partir de l'ID fourni
    const genreId = Number(req.params.id);
    const genre = await genreRepository.read(genreId);

    // Si l'élément est introuvable, répondez avec HTTP 404 (Introuvable)
    // Sinon, répondez avec l'élément au format JSON
    if (genre == null) {
      res.sendStatus(404);
    } else {
      res.json(genre);
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
    const genre = {
      id: Number(req.params.id),
      name: req.body.name,
    };

    const affectedRows = await genreRepository.update(genre);

    // Si la catégorie n’est pas trouvée, répondre avec un code HTTP 404 (Non trouvé)
    // Sinon, répondre avec la catégorie au format JSON.
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
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
    const newGenre: Genre = {
      id: Number(req.params.id),
      name: req.body.name,
    };
    // Creation du genre
    const insertId = await genreRepository.create(newGenre);
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
    const genreId = Number(req.params.id);

    await genreRepository.delete(genreId);

    // Répondez quand même avec HTTP 204 (Aucun contenu)
    res.sendStatus(204);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

export default { browse, read, add, destroy, edit };
