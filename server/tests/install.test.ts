// Importe et charge automatiquement les variables d'environnement définies dans le fichier `.env`
import "dotenv/config";
import userRepository from "../src/modules/user/userRepository"; // si exporté comme instance

// Importe le module `fs` de Node.js, qui permet d’interagir avec le système de fichiers
import fs from "node:fs";

// Définition d’un groupe de tests nommé "Installation"
describe("Installation", () => {
  // Test unitaire qui vérifie si le fichier `.env` existe bien à l'emplacement prévu
  test("You have created /server/.env", async () => {
    // Vérifie que le fichier `.env` existe dans le dossier parent de celui du test (__dirname/../.env)
    // __dirname = répertoire du fichier actuel
    // ../.env = le fichier `.env` à la racine du dossier /server
    expect(fs.existsSync(`${__dirname}/../.env`)).toBe(true);
    // Si le fichier existe, le test passe. Sinon, il échoue.
  });
});

// Test pour vérifier si le ficher App.tsx existe bien
describe("Installation", () => {
  test("You have created /client/src/App.tsx", async () => {
    expect(fs.existsSync(`${__dirname}/../../client/src/App.tsx`)).toBe(true);
  });
});

// Test unitaire de la méthode "create" du userRepository
test("create retourne l'ID inséré (number)", async () => {
  const fakeUser = {
    firstname: "Test",
    lastname: "User",
    mail: `delete.test.${Date.now()}@example.com`, // ← unique à chaque exécution
    password: "securepass",
    is_admin: false,
    is_actif: true,
    abonnement_id: 1,
    profil_picture_id: 1,
  };

  // Appelle la méthode create() pour insérer l'utilisateur dans la base
  const result = await userRepository.create(fakeUser);

  // Vérifie que le résultat retourné est bien un type "number"
  expect(typeof result).toBe("number");

  // Vérifie que l'ID retourné est strictement positif (donc insertion réussie)
  expect(result).toBeGreaterThan(0);
});

// Test unitaire de la méthode "delete" du userRepo
// et vérification si le user existe toujours ou pas
test("Test delete", async () => {
  // Création d'un faux user pour pouvoir faire le test du delete (c'est du copier/coller du test Create)
  const fakeUser = {
    firstname: "Test",
    lastname: "User",
    mail: `delete.test.${Date.now()}@example.com`, // ← unique à chaque exécution
    password: "securepass",
    is_admin: false,
    is_actif: true,
    abonnement_id: 1,
    profil_picture_id: 1,
  };

  const createId = await userRepository.create(fakeUser);

  expect(typeof createId).toBe("number");

  expect(createId).toBeGreaterThan(0);

  // Deuxième partie du test, supression du user

  const deleteUser = await userRepository.delete(createId);
  // Vérifie qu'au moins un enregistrement a été supprimé (le retour est souvent un count ou booléen)
  expect(deleteUser).toBeGreaterThan(0);

  const user = await userRepository.findById(createId);
  // Vérifie que l'utilisateur supprimé n'existe plus dans la base
  expect(user).toBeNull();
});

import type { NextFunction, Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import { checkEmailExists } from "../src/middleware/checkEmailExists";

jest.mock("../src/modules/user/userRepository"); // Pour ce test, je vais remplacer toutes les fonctions de userRepository par des versions simulées(mockées)
const mockedUserRepo = userRepository as jest.Mocked<typeof userRepository>; //je veux accéder à toute les fonctions du module userRepo, comme des fonctions Jest mockées(simulées)

describe("checkEmailExists", () => {
  it("doit renvoyer 409 si l'email existe déjà", async () => {
    // 1. On simule le retour de findByEmail
    mockedUserRepo.findByEmail.mockResolvedValue({
      id: 1,
      mail: "test@test.com",
    } as unknown as RowDataPacket); // quand j'appelle la fonction findByEmail je retourne un user factice

    // 2. On crée les mocks de req, res, next
    const req = {
      body: { mail: "test@test.com" },
    } as Partial<Request> as Request; //permet de ne pas créer toutes les autres propriétés du vrai Request

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response> as Response; //simule une réponse

    const next = jest.fn() as NextFunction; //simule une fonction next

    // 3. On appelle le middleware
    await checkEmailExists(req, res, next);

    // 4. On vérifie les effets attendus
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({
      message: "Adresse e-mail déjà existante",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Test unitaire pour vérifier que la fonction de hachage de mot de passe fonctionne correctement : logique identique à signup dans le module auth
import bcrypt from "bcryptjs";

describe("hachage de mot de passe", () => {
  const password = "MonMotDePasse123!";

  it("génère un hash différent du mot de passe original", () => {
    const hashPassword = bcrypt.hashSync(password, 8);
    expect(hashPassword).not.toBe(password);
  });

  it("permet de vérifier le mot de passe via bcrypt.compareSync", () => {
    const hashPassword = bcrypt.hashSync(password, 8);
    const isPasswordValid = bcrypt.compareSync(password, hashPassword);
    expect(isPasswordValid).toBe(true);
  });

  it("échoue si le mot de passe est incorrect", () => {
    const hashPassword = bcrypt.hashSync(password, 8);
    const isPasswordValid = bcrypt.compareSync(
      "MauvaisMotDePasse",
      hashPassword,
    );
    expect(isPasswordValid).toBe(false);
  });
});
