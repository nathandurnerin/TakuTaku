import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Genre = {
  id: number;
  name: string;
};

class GenreRepository {
  // Le C du CRUD - Create
  async create(genre: Omit<Genre, "id">) {
    // Création d'un nouveau genre
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Genre (name) values (?)",
      [genre.name],
    );
    //Retourne l'ID du nouveau genre inséré
    return result.insertId;
  }

  // Le R du CRUD - Read
  async read(id: number) {
    // Execute la requête SQL pour lire un item spécifique par son ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Genre WHERE id = ?",
      [id],
    );
    //Retourne la première ligne du résultat de la requête
    return rows[0] as Genre;
  }
  async readAll() {
    // Exécute la requête SQL pour lire tout le tableau de la table "Genre"
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM Genre");

    // Return the array of items
    return rows as Genre[];
  }

  // Le U du CRUD - Update
  async update(genre: Genre) {
    // Exécute la requête SQL pour lire tout le tableau de la table "Genre"
    const [result] = await databaseClient.query<Result>(
      "Update Genre SET name = ? WHERE id = ?",
      [genre.name, genre.id],
    );

    // Retourne le tableau d'animés mis à jour

    return result.affectedRows;
  }
  // Le D du CRUD - Delete
  async delete(id: number) {
    // Exécute la requête SQL pour supprimer un genre spécifique par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Genre WHERE id = ?",
      [id],
    );
    // Retourne le nombre de lignes affectées par la suppression
    return result.affectedRows;
  }
}

export default new GenreRepository();
