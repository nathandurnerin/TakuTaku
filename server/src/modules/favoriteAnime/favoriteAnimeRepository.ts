import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Favorite = {
  id?: number;
  users_id: number;
  anime_id: number;
};

class favoriteAnimeRepository {
  // Le C du CRUD - Create
  async create(favorite: Favorite) {
    // Création d'un nouveau favori
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO favorite_anime (users_id, anime_id) VALUES (?, ?)",
      [favorite.users_id, favorite.anime_id],
    );
    // Retourne l'ID de la nouvelle saison insérée
    return result.insertId;
  }

  // Le R du CRUD - Read
  async read(users_id: number, anime_id: number) {
    // Exécute la requête SQL pour lire un favori spécifique par l'ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM favorite_anime WHERE users_id = ? AND anime_id = ?",
      [users_id, anime_id],
    );
    // Retourne la première ligne du résultat de la requête
    return rows[0] as Favorite;
  }

  async readAll(users_id: number) {
    // Exécute la requête SQL pour lire tous les favoris
    const [rows] = await databaseClient.query(
      `SELECT fa.anime_id, a.title, a.portrait
     FROM favorite_anime fa
     JOIN Anime a ON fa.anime_id = a.id
     WHERE fa.users_id = ?`,
      [users_id],
    );
    return rows as Favorite[];
  }

  // Le D du CRUD - Delete
  async delete(users_id: number, anime_id: number, id: number) {
    // Exécute la requête SQL pour supprimer un favori par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM favorite_anime WHERE users_id = ? AND anime_id = ?",
      [users_id, anime_id],
    );
    return result.affectedRows > 0; // Retourne true si la suppression a réussi
  }
}

export default new favoriteAnimeRepository();
