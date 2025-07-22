import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

interface Note {
  id: number;
  note: number; //note de l'animé de 1 à 5
  users_id: number; // user qui a noté
  anime_id: number; //l'animé concerné
}

class noteRepository {
  // Le C du CRUD - Create
  async create(note: Omit<Note, "id">) {
    // Création d'une nouvelle note
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Note ( users_id, anime_id, note) values (?, ?, ?)",
      [note.users_id, note.anime_id, note.note],
    );
    //Retourne l'ID de la nouvelle note inséré
    return result.insertId;
  }

  // Le R du CRUD - Read
  async read(anime_id: number) {
    // Récupère la note
    const [noteRows] = await databaseClient.query<Rows>(
      "SELECT AVG(note) AS average FROM Note WHERE anime_id = ?",
      [anime_id],
    );
    // Retourne la note moyenne
    return noteRows[0] as { average: number };
  }

  async readAll() {
    // Exécute la requête SQL pour lire tout le tableau de la table "Note"
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM Note");

    // Return the array of items
    return rows as Note[];
  }

  // Le U du CRUD - Update
  async update(note: Omit<Note, "id">) {
    // Exécute la requête SQL pour lire tout le tableau de la table "Anime"
    const [result] = await databaseClient.query<Result>(
      "UPDATE Note SET note = ? WHERE anime_id = ? AND users_id = ?",
      [note.note, note.anime_id, note.users_id],
    );

    // Retourne le tableau d'animés mis à jour

    return result.affectedRows;
  }

  // Requête pour lire la note du user selon l'anime_id
  async readUserNote(anime_id: number, users_id: number) {
    // Récupère la note
    const [noteRows] = await databaseClient.query<Rows>(
      "SELECT note FROM Note WHERE anime_id = ? AND users_id = ?",
      [anime_id, users_id],
    );
    // Retourne la note moyenne
    return noteRows[0];
  }
}

export default new noteRepository();
