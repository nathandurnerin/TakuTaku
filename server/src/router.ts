import express from "express";
import { checkEmailExists } from "./middleware/checkEmailExists";
import security from "./middleware/security";
import { checkToken } from "./middleware/security";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

// Routes for the anime module
import animeAction from "../src/modules/anime/animeAction";
router.get("/api/anime", animeAction.browse);
router.get("/api/animetype/:genre/:type", animeAction.browseType);
router.get("/api/anime/:id", animeAction.read);
router.post("/api/anime", animeAction.add);
router.put("/api/anime/:id", animeAction.edit);
router.delete("/api/anime/:id", animeAction.destroy);
router.get("/api/anime_with_genre", animeAction.browseWithGenre);
router.get("/api/anime_with_note", animeAction.browseWithNote);

//Routes for the genre module
import genreAction from "./modules/genre/genreAction";
router.get("/api/genre", genreAction.browse);
router.get("/api/genre/:id", genreAction.read);
router.post("/api/genre", genreAction.add);
router.put("/api/genre/:id", genreAction.edit);
router.delete("/api/genre/:id", genreAction.destroy);

// Routes for the type module
import typeAction from "./modules/type/typeAction";
router.get("/api/type", typeAction.browse);
router.get("/api/type/:id", typeAction.read);
router.post("/api/type", typeAction.add);
router.put("/api/type/:id", typeAction.edit);
router.delete("/api/type/:id", typeAction.destroy);

// Routes for the season module
import seasonAction from "../src/modules/season/seasonAction";
router.get("/api/season", seasonAction.browse);
router.get("/api/season/:id", seasonAction.read);
router.post("/api/season", seasonAction.add);
router.put("/api/season/:id", seasonAction.edit);
router.delete("/api/season/:id", seasonAction.destroy);

// Routes for the episode module
import episodeAction from "../src/modules/episode/episodeAction";
router.get("/api/episode", episodeAction.browse);
router.get("/api/episode/:id", episodeAction.read);
router.post("/api/episode", episodeAction.add);
router.put("/api/episode/:id", episodeAction.edit);
router.delete("/api/episode/:id", episodeAction.destroy);

// Routes for the abonnement module
import abonnementAction from "./modules/Abonnement/abonnementAction";
router.get("/api/abonnement", abonnementAction.browse);
router.get("/api/abonnement/:id", abonnementAction.read);
router.post("/api/abonnement", abonnementAction.add);
router.put("/api/abonnement/:id", abonnementAction.edit);
router.delete("/api/abonnement/:id", abonnementAction.destroy);

// Routes for the user module
import userAction from "./modules/user/userAction";
router.get("/api/user", userAction.browse);
router.get("/api/user/:id([0-9]+)", checkToken, userAction.read);
router.post("/api/user", userAction.add);
router.put("/api/user/profil_picture", userAction.editProfilPicture);
router.put("/api/user/:id([0-9]+)", userAction.edit);
router.delete("/api/user/:id([0-9]+)", userAction.destroy);
router.get("/api/user_abonnement", userAction.browse);
router.get("/api/user_with_abonnement", userAction.browseWithAbonnement);
router.get("/api/read_all_with_anime", userAction.readAllWithUsers);
router.post("/api/add_to_history", userAction.addToHistory);
router.get("/api/user/:id([0-9]+)/history", userAction.readUserHistory);
router.get("/api/user/readAllProfilPicture", userAction.readAllProfilPicture);
router.get("/api/user/readUrlPicture/:id", userAction.readUrlPicture);

//Routes for the authenfication module
import authAction from "./modules/auth/authAction";
router.post("/api/auth/signin", authAction.signIn);
router.post("/api/auth/signup", checkEmailExists, authAction.signUp);

// Routes for the favorite_anime / favorites
import favoriteAnimeAction from "./modules/favoriteAnime/favoriteAnimeAction";
router.get("/api/favorite_anime/:users_id([0-9]+)", favoriteAnimeAction.browse);
router.get(
  "/api/favorite_anime/:users_id([0-9]+)/:anime_id([0-9]+)",
  favoriteAnimeAction.read,
);
router.post("/api/favorite_anime", favoriteAnimeAction.add);
router.delete(
  "/api/favorite_anime/:users_id([0-9]+)/:anime_id([0-9]+)",
  favoriteAnimeAction.destroy,
);

//Routes for the note module
import noteAction from "./modules/note/noteAction";
router.get("/api/note", noteAction.browse);
router.get(
  "/api/note/:anime_id([0-9]+)/:users_id([0-9]+)",
  noteAction.readUserNote,
);
router.get("/api/note/:anime_id([0-9]+)/average", noteAction.readAverage);
router.post("/api/note", noteAction.add);
router.put("/api/note/:anime_id([0-9]+)/:users_id([0-9]+)", noteAction.edit);

export default router;
