import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Episode = {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
};

class EpisodeRepository {
  // Le C du CRUD - Create
  async create(episode: Omit<Episode, "id">) {
    // Création d'un nouvel episode
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Episode (number, title, synopsis, season_id) VALUES (?, ?, ?, ?)",
      [episode.number, episode.title, episode.synopsis, episode.season_id],
    );
    // Retourne l'ID du nouvel episode inséré
    return result.insertId;
  }

  // Le R du CRUD - Read
  async read(id: number) {
    // Exécute la requête SQL pour lire un episode spécifique par son ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Episode WHERE id = ?",
      [id],
    );
    // Retourne la première ligne du résultat de la requête
    return rows[0] as Episode;
  }

  async readAll() {
    // Exécute la requête SQL pour lire tous les episodes
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM Episode");
    // Retourne le tableau des episodes
    return rows as Episode[];
  }

  // Le U du CRUD - Update
  async update(episode: Episode) {
    // Exécute la requête SQL pour mettre à jour un episode existant
    const [result] = await databaseClient.query<Result>(
      "UPDATE Episode SET number = ?, title = ?, synopsis = ?, season_id = ? WHERE id = ?",
      [
        episode.number,
        episode.title,
        episode.synopsis,
        episode.season_id,
        episode.id,
      ],
    );
    return result.affectedRows > 0; // Retourne true si la mise à jour a réussi
  }

  // Le D du CRUD - Delete
  async delete(id: number) {
    // Exécute la requête SQL pour supprimer un episode par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Episode WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0; // Retourne true si la suppression a réussi
  }
}

export default new EpisodeRepository();
