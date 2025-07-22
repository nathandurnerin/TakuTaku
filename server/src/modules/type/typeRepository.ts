import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Type = {
  id: number;
  name: string;
};

class TypeRepository {
  // Le C du CRUD - Create
  async create(type: Omit<Type, "id">) {
    // Création d'un nouvel animé
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Type (name) values (?)",
      [type.name],
    );
    //Retourne l'ID du nouveau type inséré
    return result.insertId;
  }
  // Le R du CRUD - Read
  async read(id: number) {
    // Execute la requête SQL pour lire un item spécifique par son ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Type WHERE id = ?",
      [id],
    );
    //Retourne la première ligne du résultat de la requête
    return rows[0] as Type;
  }
  async readAll() {
    // Exécute la requête SQL pour lire tout le tableau de la table "type"
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM Type");

    // Retourne le tableau d'items
    return rows as Type[];
  }

  // Le U du CRUD - Update
  async update(type: Type) {
    // Exécute la requête SQL pour lire tout le tableau de la table "Type"
    const [reesult] = await databaseClient.query<Result>(
      "DELETE FROM Type WHERE id = ?",
      [type.name, type.id],
    );

    // Retourne le tableau d'animés mis à jour

    return reesult.affectedRows;
  }
  // Le D du CRUD - Delete
  async delete(id: number) {
    // Exécute la requête SQL pour supprimer un type spécifique par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Type WHERE id = ?",
      [id],
    );
    // Retourne le nombre de lignes affectées par la suppression
    return result.affectedRows;
  }
}

export default new TypeRepository();
