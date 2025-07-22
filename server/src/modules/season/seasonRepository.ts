import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Season = {
  id: number;
  number: number;
  anime_id: number;
};

class SeasonRepository {
  // Le C du CRUD - Create
  async create(season: Omit<Season, "id">) {
    // Création d'une nouvelle saison
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Season (number, anime_id) VALUES (?, ?)",
      [season.number, season.anime_id],
    );
    // Retourne l'ID de la nouvelle saison insérée
    return result.insertId;
  }

  // Le R du CRUD - Read
  async read(id: number) {
    // Exécute la requête SQL pour lire une saison spécifique par son ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Season WHERE id = ?",
      [id],
    );
    // Retourne la première ligne du résultat de la requête
    return rows[0] as Season;
  }

  async readAll() {
    // Exécute la requête SQL pour lire toutes les saisons
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM Season");
    // Retourne le tableau des saisons
    return rows as Season[];
  }

  // Le U du CRUD - Update
  async update(season: Season) {
    // Exécute la requête SQL pour mettre à jour une saison existante
    const [result] = await databaseClient.query<Result>(
      "UPDATE Season SET number = ?, anime_id = ? WHERE id = ?",
      [season.number, season.anime_id, season.id],
    );
    return result.affectedRows > 0; // Retourne true si la mise à jour a réussi
  }

  // Le D du CRUD - Delete
  async delete(id: number) {
    // Exécute la requête SQL pour supprimer une saison par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Season WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0; // Retourne true si la suppression a réussi
  }
}

export default new SeasonRepository();
