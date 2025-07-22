import type { RequestHandler } from "express";

import noteRepository from "./noteRepository";

interface Note {
  id: number;
  note: number; //note de l'animé de 1 à 5
  users_id: number; // user qui a noté
  anime_id: number; //l'animé concerné
}

// Le B du BREAD - Browse (Read All) operation
const browse: RequestHandler = async (_req, res, next) => {
  try {
    // Fetch toutes les notes
    const notes = await noteRepository.readAll();

    // Reponse avec les notes au format JSON
    res.json(notes);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Le R du BREAD - Lis la requête
const readAverage: RequestHandler = async (req, res, next) => {
  try {
    // Fetch un élément spécifique à partir de l'ID fourni
    const anime_id = Number(req.params.anime_id);
    const averageNote = await noteRepository.read(anime_id);

    // Si l'élément est introuvable, répondez avec HTTP 404 (Introuvable)
    // Sinon, répondez avec l'élément au format JSON
    if (averageNote == null) {
      res.sendStatus(404);
    } else {
      res.json(averageNote);
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
    const note: Omit<Note, "id"> = {
      note: Number(req.body.note),
      anime_id: Number(req.params.anime_id),
      users_id: Number(req.params.users_id),
    };

    const affectedRows = await noteRepository.update(note);

    // Si la catégorie n’est pas trouvée, répondre avec un code HTTP 404 (Non trouvé)
    // Sinon, répondre avec la catégorie au format JSON.
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.json(note);
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
    // Préparer une nouvelle note sans l'id
    const newNote = {
      note: req.body.note,
      users_id: req.body.users_id,
      anime_id: req.body.anime_id,
    };
    // Create the note
    const insertId = await noteRepository.create(newNote);

    // Répondez avec HTTP 201 (Créé) et l'ID de l'élément nouvellement inséré
    res.status(201).json({ insertId });
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// Pour lire la note d'un utilisateur
const readUserNote: RequestHandler = async (req, res, next) => {
  try {
    // Fetch un élément spécifique à partir de l'ID fourni
    const anime_id = Number(req.params.anime_id);
    const users_id = Number(req.params.users_id);
    const userNote = await noteRepository.readUserNote(anime_id, users_id);
    // Si l'élément est introuvable, répondez avec HTTP 404 (Introuvable)
    // Sinon, répondez avec l'élément au format JSON
    if (userNote == null) {
      res.status(200).json("Vous n'avez pas encore noté cet animé");
      console.error("Vous n'avez pas encore noté cet animé");
    } else {
      res.json(userNote);
    }
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

export default {
  browse,
  readAverage,
  add,
  edit,
  readUserNote,
};
