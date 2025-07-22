import type { RequestHandler } from "express";

// Accès à la base de données
import seasonRepository from "./seasonRepository";

interface Season {
  id: number;
  number: number;
  anime_id: number;
}

// Le B du BREAD - Logique pour parcourir toutes les saisons
const browse: RequestHandler = async (req, res, next) => {
  try {
    const seasons = await seasonRepository.readAll(); // Fetch toutes les saisons
    res.json(seasons); // Réponse avec les saisons au format JSON
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Logique pour lire une saison spécifique
const read: RequestHandler = async (req, res, next) => {
  try {
    const seasonId = Number(req.params.id); // Récupère l'ID de la saison à partir des paramètres de la requête
    const season = await seasonRepository.read(seasonId); // Fetch la saison spécifique
    // Si la saison n'est pas trouvée, renvoie un statut 404
    // Sinon, renvoie la saison au format JSON
    if (season == null) {
      res.sendStatus(404);
    } else {
      res.json(season);
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E du BREAD - Logique pour modifier une saison spécifique
const edit: RequestHandler = async (req, res, next) => {
  try {
    // Met à jour une saison spécifique en fonction de l'ID fourni
    const season = {
      id: Number(req.params.id),
      number: req.body.number,
      anime_id: req.body.anime_id,
    };
    // Appelle le repository pour mettre à jour la saison
    const affectedRows = await seasonRepository.update(season);

    // Si aucune ligne n'est affectée, renvoie un statut 404 (Non trouvé)
    // Sinon, renvoie un statut 204 (Aucun Contenu)
    if (!affectedRows) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le A du BREAD - Logique pour ajouter une nouvelle saison
const add: RequestHandler = async (req, res, next) => {
  try {
    // Crée une nouvelle saison avec les données fournies dans le corps de la requête
    const newSeason = {
      number: req.body.number,
      anime_id: req.body.anime_id,
    };
    // Appelle le repository pour créer la nouvelle saison
    const insertId = await seasonRepository.create(newSeason);

    // Renvoie l'ID de la nouvelle saison créée avec un statut 201 (Créé)
    res.status(201).json({ insertId });
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Logique pour supprimer une saison spécifique
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Supprime une saison spécifique en fonction de l'ID fourni
    const seasonId = Number(req.params.id);
    await seasonRepository.delete(seasonId); // Appelle le repository pour supprimer la saison
    res.sendStatus(204); // Renvoie un statut 204 (Aucun Contenu) pour indiquer que la suppression a réussi
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, edit, destroy };
