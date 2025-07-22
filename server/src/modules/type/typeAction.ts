import type { RequestHandler } from "express";

// Accès à la base de données
import typeRepository from "./typeRepository";

interface Type {
  id: number;
  name: string;
}

// Le B du BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch tout les types
    const types = await typeRepository.readAll();

    // Reponse avec les types au format JSON
    res.json(types);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch un élément spécifique à partir de l'ID fourni
    const typeId = Number(req.params.id);
    const type = await typeRepository.read(typeId);

    // Si l'élément est introuvable, répondez avec HTTP 404 (Introuvable)
    // Sinon, répondez avec l'élément au format JSON
    if (type == null) {
      res.sendStatus(404);
    } else {
      res.json(type);
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
    const type = {
      id: Number(req.params.id),
      name: req.body.name,
    };

    const affectedRows = await typeRepository.update(type);

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
    const newType: Type = {
      id: Number(req.params.id),
      name: req.params.name,
    };
    // Créer le type
    const insertId = await typeRepository.create(newType);

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
    const typeId = Number(req.params.id);

    await typeRepository.delete(typeId);

    // Répondez quand même avec HTTP 204 (Aucun contenu)
    res.sendStatus(204);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

export default { browse, read, add, destroy, edit };
