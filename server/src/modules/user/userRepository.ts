import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password?: string;
  is_admin: boolean;
  is_actif: boolean;
  abonnement_id: number;
  profil_picture_id: number;
};

type ProfilPicture = {
  id: number;
  profil_picture: string;
};

class userRepository {
  // Le C du CRUD - CREATE
  async create(user: Omit<User, "id">) {
    try {
      // Création d'un nouveau user dans la base de données
      const [result] = await databaseClient.query<Result>(
        "INSERT INTO Users (firstname, lastname, mail, password, is_admin, is_actif, abonnement_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          user.firstname,
          user.lastname,
          user.mail,
          user.password,
          user.is_admin,
          user.is_actif,
          user.abonnement_id,
        ],
      );
      // Retourne l'ID du nouveau user inséré
      return result.insertId;
    } catch (error) {
      console.error("Erreur d'insertion dans la base :", error);
      throw error; // si la requête échoue, on relance l'erreur
    }
  }

  // Le R du CRUD
  async read(id: number) {
    //Exécute la requête SQL pour lire une information par son id
    const [rows] = await databaseClient.query<Rows>(
      "select * from Users where id = ?",
      [id],
    );
    //Retourne la première ligne du résultat de la requête
    return rows[0] as User;
  }
  async readAll() {
    // Exécute la requête SQL pour lire tout le tableau de la table "Users"
    const [rows] = await databaseClient.query<Rows>("select * from Users");
    // Retournes le tableau d'éléments
    return rows as User[];
  }

  //   Le U du CRUD - Update
  async update(user: User) {
    // Exécute la requête SQL pour lire tout le tableau de la table "User"
    const [result] = await databaseClient.query<Result>(
      "UPDATE Users set firstname = ?, lastname = ?, mail = ?, is_admin = ?, is_actif = ?, abonnement_id = ? WHERE id = ?",
      [
        user.firstname,
        user.lastname,
        user.mail,
        user.is_admin,
        user.is_actif,
        user.abonnement_id,
        user.id,
      ],
    );
    // Retourne le tableau des users mis à jour
    return result.affectedRows;
  }
  // Le D du CRUD
  async delete(id: number) {
    // Exécute la requête SQL pour supprimer un user spécifique par son ID
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Users WHERE id= ?",
      [id],
    );
    // Retourne le nombre de lignes affectées par la suppression

    return result.affectedRows;
  }

  // Lire TOUS les users avec le type d'abonnement en plus

  async readAllWithAbonnement() {
    const [rows] = await databaseClient.query(
      `SELECT u.id, u.firstname, u.lastname, u.mail, u.is_admin, u.is_actif,
            a.name AS abonnement_name
      FROM Users u
      LEFT JOIN Abonnement a ON u.abonnement_id = a.id`,
    );
    return rows;
  }
  // Lire le prénom et le nom de chaque User et afficher toutes les infos des animés qu'il a visualisé
  async readAllWithUsers() {
    const [rows] = await databaseClient.query(`
    SELECT 
      u.id AS user_id,
      u.firstname,
      u.lastname,
      a.id AS anime_id,
      a.title,
      a.portrait
    FROM users AS u
    INNER JOIN users_anime AS ua ON u.id = ua.users_id
    INNER JOIN anime AS a ON a.id = ua.anime_id
  `);
    return rows;
  }
  //Cette fonction ajoute un animé visionné dans l'historique et dans la table Users_Anime
  async addToHistory(userId: number, animeId: number) {
    try {
      // On vérifie si l'utilisateur à déjà visionné l'animé
      const [existing] = await databaseClient.query<Rows>(
        "SELECT * FROM Users_Anime WHERE users_id = ? AND anime_id = ?",
        [userId, animeId],
      );
      //Si on trouve déjà l'animé alors on ne l'ajoute pas à l'historique
      if ((existing as Rows).length > 0) {
        return { message: "Déjà présent" };
      }

      // Sinon on ajoute l'animé à l'historique
      const [result] = await databaseClient.query(
        "INSERT INTO Users_Anime (users_id, anime_id) VALUES (?, ?)",
        [userId, animeId],
      );

      return result; // on renvoie le résultat de l'instertion
    } catch (error) {
      console.error("Erreur lors de l'ajout à l'historique :", error);
      throw error;
    }
  }
  // Lire les animés vus par un utilisateur spécifique
  async readUserHistory(userId: number) {
    const [rows] = await databaseClient.query(
      `
    SELECT 
     a.*
    FROM users_anime AS ua
    INNER JOIN anime AS a ON a.id = ua.anime_id
    WHERE ua.users_id = ?
  `,
      [userId],
    );
    return rows;
  }

  async signIn(mail: string, password: string) {
    // Exécute la requête SQL pour lire un utilisateur par son mail et mot de passe
    const [rows] = await databaseClient.query<Rows>(
      "select * FROM Users where mail = ?",
      [mail],
    );
    //Retourne la première ligne du résultat de la requête ou undefined si aucun utilisateur n'est trouvé
    return rows[0] as User | undefined;
  }

  async signUp(
    firstname: string,
    lastname: string,
    mail: string,
    passHash: string,
    abonnement_id: number,
    is_admin: boolean, // Par défaut, les nouveaux utilisateurs ne sont pas administrateurs
    is_actif: boolean, // Par défaut, les nouveaux utilisateurs sont actifs
  ) {
    // Exécute la requête SQL pour créer un nouvel utilisateur
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Users (firstname, lastname, mail, password, abonnement_id, is_admin, is_actif) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstname, lastname, mail, passHash, abonnement_id, is_admin, is_actif],
    );
    // Retourne l'ID du nouvel utilisateur inséré
    return result.insertId;
  }

  // Récupère un utilisateur depuis la base de données par son ID pour le test unitaire de suppression d'un user
  async findById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Users WHERE id = ?",
      [id],
    );
    return (rows[0] as User) || null;
  }

  //   Pour le changement de l'image de profil
  async updateProfilPicture(id: number, profil_picture_id: number) {
    // Exécute la requête SQL pour lire tout le tableau de la table "User"
    const [result] = await databaseClient.query<Result>(
      "UPDATE Users SET profil_picture_id = ? WHERE id = ?",
      [profil_picture_id, id],
    );
    // Retourne le tableau des users mis à jour
    return result.affectedRows;
  }

  async readAllPicture() {
    // Exécute la requête SQL pour lire tout le tableau de la table "ProfilPicture"
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM ProfilPicture",
    );
    // Retournes le tableau d'éléments
    return rows as ProfilPicture[];
  }

  // Pour récupérer le bon id picture selon l'id du user
  async readUrlPicture(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT profil_picture FROM ProfilPicture AS pp INNER JOIN Users AS u ON pp.id=u.profil_picture_id WHERE u.id = ?",
      [userId],
    );
    return rows[0];
  }

  // Vérification de l'existence de l'e-mail en BDD pour le middleware checkEmailExists
  async findByEmail(mail: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM Users WHERE mail = ?",
      [mail],
    );
    return rows[0];
  }
}

export default new userRepository();
