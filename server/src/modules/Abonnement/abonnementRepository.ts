import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type AbonnementName = "découverte" | "premium";

type Abonnement = {
  id: number;
  name: AbonnementName;
};

class AbonnementRepository {
  // Le C du CRUD - Create
  async create(abonnement: Omit<Abonnement, "id">) {
    // Création d'un nouvel abonnement
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Abonnement (name) values (?)",
      [abonnement.name],
    );
    //Retourne l'ID du nouvel abonnement inséré
    return result.insertId;
  }
  // Le R du CRUD - Read
  async read(id: number) {
    // Execute la requête SQL pour lire un item spécifique par son ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from Abonnement where id = ?",
      [id],
    );
    //Retourne la première ligne du résultat de la requête
    return rows[0] as Abonnement;
  }
  async readAll() {
    // Exécute la requête SQL pour lire tout le tableau de la table "Abonnement"
    const [rows] = await databaseClient.query<Rows>("select * from Abonnement");

    // Return the array of items
    return rows as Abonnement[];
  }

  // Le U du CRUD - Update
  async update(abonnement: Abonnement) {
    // Exécute la requête SQL pour lire tout le tableau de la table "Abonnement"
    const [result] = await databaseClient.query<Result>(
      "UPDATE Abonnement set name = ? WHERE id = ?",
      [abonnement.name, abonnement.id],
    );

    // Retourne le tableau d'abonnements mis à jour

    return result.affectedRows;
  }
  // Le D du CRUD - Delete
  async delete(id: number) {
    // Exécute la requête SQL pour supprimer un abonnement spécifique par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Abonnement WHERE id = ?",
      [id],
    );
    // Retourne le nombre de lignes affectées par la suppression
    return result.affectedRows;
  }
}

export default new AbonnementRepository();
