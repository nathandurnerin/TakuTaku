import type { RequestHandler } from "express";

// Accès à la base de données
import episodeRepository from "./episodeRepository";

interface Episode {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
}

// Le B du BREAD - Logique pour parcourir toutes les episodes
const browse: RequestHandler = async (req, res, next) => {
  try {
    const episodes = await episodeRepository.readAll(); // Fetch toutes les episodes
    res.json(episodes); // Réponse avec les episodes au format JSON
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Logique pour lire une episode spécifique
const read: RequestHandler = async (req, res, next) => {
  try {
    const episodeId = Number(req.params.id); // Récupère l'ID de la episode à partir des paramètres de la requête
    const episode = await episodeRepository.read(episodeId); // Fetch la episode spécifique
    // Si la episode n'est pas trouvée, renvoie un statut 404
    // Sinon, renvoie la episode au format JSON
    if (episode == null) {
      res.sendStatus(404);
    } else {
      res.json(episode);
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E du BREAD - Logique pour modifier une episode spécifique
const edit: RequestHandler = async (req, res, next) => {
  try {
    // Met à jour une episode spécifique en fonction de l'ID fourni
    const episode = {
      id: Number(req.params.id),
      number: req.body.number,
      title: req.body.title,
      synopsis: req.body.synopsis,
      season_id: req.body.season_id,
    };
    // Appelle le repository pour mettre à jour la episode
    const affectedRows = await episodeRepository.update(episode);

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

// Le A du BREAD - Logique pour ajouter une nouvelle episode
const add: RequestHandler = async (req, res, next) => {
  try {
    // Crée une nouvelle episode avec les données fournies dans le corps de la requête
    const newepisode = {
      number: req.body.number,
      title: req.body.title,
      synopsis: req.body.synopsis,
      season_id: req.body.season_id,
    };
    // Appelle le repository pour créer la nouvelle episode
    const insertId = await episodeRepository.create(newepisode);

    // Renvoie l'ID de la nouvelle episode créée avec un statut 201 (Créé)
    res.status(201).json({ insertId });
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Logique pour supprimer une episode spécifique
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Supprime une episode spécifique en fonction de l'ID fourni
    const episodeId = Number(req.params.id);
    await episodeRepository.delete(episodeId); // Appelle le repository pour supprimer la episode
    res.sendStatus(204); // Renvoie un statut 204 (Aucun Contenu) pour indiquer que la suppression a réussi
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, edit, destroy };
