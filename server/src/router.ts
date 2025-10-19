import express from "express";
import { checkEmailExists } from "./middleware/checkEmailExists";
import { checkToken } from "./middleware/security";

const router = express.Router();

/* ************************************************************************* */
/* Anime */
import animeAction from "./modules/anime/animeAction";
router.get("/api/anime", animeAction.browse);
router.get("/api/animetype/:genre/:type", animeAction.browseType);
router.get("/api/anime/:id([0-9]+)", animeAction.read);
router.post("/api/anime", checkToken as express.RequestHandler, animeAction.add);
router.put("/api/anime/:id([0-9]+)", checkToken as express.RequestHandler, animeAction.edit);
router.delete("/api/anime/:id([0-9]+)", checkToken as express.RequestHandler, animeAction.destroy);
router.get("/api/anime_with_genre", animeAction.browseWithGenre);
router.get("/api/anime_with_note", animeAction.browseWithNote);

/* Genre */
import genreAction from "./modules/genre/genreAction";
router.get("/api/genre", genreAction.browse);
router.get("/api/genre/:id([0-9]+)", genreAction.read);
router.post("/api/genre", checkToken as express.RequestHandler, genreAction.add);
router.put("/api/genre/:id([0-9]+)", checkToken as express.RequestHandler, genreAction.edit);
router.delete("/api/genre/:id([0-9]+)", checkToken as express.RequestHandler, genreAction.destroy);

/* Type */
import typeAction from "./modules/type/typeAction";
router.get("/api/type", typeAction.browse);
router.get("/api/type/:id([0-9]+)", typeAction.read);
router.post("/api/type", checkToken as express.RequestHandler, typeAction.add);
router.put("/api/type/:id([0-9]+)", checkToken as express.RequestHandler, typeAction.edit);
router.delete("/api/type/:id([0-9]+)", checkToken as express.RequestHandler, typeAction.destroy);

/* Season */
import seasonAction from "./modules/season/seasonAction";
router.get("/api/season", seasonAction.browse);
router.get("/api/season/:id([0-9]+)", seasonAction.read);
router.post("/api/season", checkToken as express.RequestHandler, seasonAction.add);
router.put("/api/season/:id([0-9]+)", checkToken as express.RequestHandler, seasonAction.edit);
router.delete("/api/season/:id([0-9]+)", checkToken as express.RequestHandler, seasonAction.destroy);

/* Episode */
import episodeAction from "./modules/episode/episodeAction";
router.get("/api/episode", episodeAction.browse);
router.get("/api/episode/:id([0-9]+)", episodeAction.read);
router.post("/api/episode", checkToken as express.RequestHandler, episodeAction.add);
router.put("/api/episode/:id([0-9]+)", checkToken as express.RequestHandler, episodeAction.edit);
router.delete("/api/episode/:id([0-9]+)", checkToken as express.RequestHandler, episodeAction.destroy);

/* Abonnement */
import abonnementAction from "./modules/Abonnement/abonnementAction";
router.get("/api/abonnement", abonnementAction.browse);
router.get("/api/abonnement/:id([0-9]+)", abonnementAction.read);
router.post("/api/abonnement", checkToken as express.RequestHandler, abonnementAction.add);
router.put("/api/abonnement/:id([0-9]+)", checkToken as express.RequestHandler, abonnementAction.edit);
router.delete("/api/abonnement/:id([0-9]+)", checkToken as express.RequestHandler, abonnementAction.destroy);

/* User */
import userAction from "./modules/user/userAction";
router.get("/api/user", userAction.browse);
router.get("/api/user/:id([0-9]+)", checkToken as express.RequestHandler, userAction.read);
router.post("/api/user", userAction.add);
router.put("/api/user/profil_picture", checkToken as express.RequestHandler, userAction.editProfilPicture);
router.put("/api/user/:id([0-9]+)", checkToken as express.RequestHandler, userAction.edit);
router.delete("/api/user/:id([0-9]+)", checkToken as express.RequestHandler, userAction.destroy);
router.get("/api/user_with_abonnement", userAction.browseWithAbonnement);
router.get("/api/read_all_with_anime", userAction.readAllWithUsers);
router.post("/api/add_to_history", checkToken as express.RequestHandler, userAction.addToHistory);
router.get("/api/user/:id([0-9]+)/history", checkToken as express.RequestHandler, userAction.readUserHistory);
router.get("/api/user/readAllProfilPicture", userAction.readAllProfilPicture);
router.get("/api/user/readUrlPicture/:id([0-9]+)", userAction.readUrlPicture);

/* Auth */
import authAction from "./modules/auth/authAction";
router.post("/api/auth/signin", authAction.signIn);
router.post("/api/auth/signup", checkEmailExists, authAction.signUp);

/* Favorites */
import favoriteAnimeAction from "./modules/favoriteAnime/favoriteAnimeAction";
router.get("/api/favorite_anime/:users_id([0-9]+)", favoriteAnimeAction.browse);
router.get("/api/favorite_anime/:users_id([0-9]+)/:anime_id([0-9]+)",  favoriteAnimeAction.read);
router.post("/api/favorite_anime", checkToken as express.RequestHandler, favoriteAnimeAction.add);
router.delete("/api/favorite_anime/:users_id([0-9]+)/:anime_id([0-9]+)", checkToken as express.RequestHandler, favoriteAnimeAction.destroy);
/* Notes */
import noteAction from "./modules/note/noteAction";
router.get("/api/note", noteAction.browse);
router.get("/api/note/:anime_id([0-9]+)/:users_id([0-9]+)", noteAction.readUserNote);
router.get("/api/note/:anime_id([0-9]+)/average", noteAction.readAverage);
router.post("/api/note", checkToken as express.RequestHandler, noteAction.add);
router.put("/api/note/:anime_id([0-9]+)/:users_id([0-9]+)", checkToken as express.RequestHandler, noteAction.edit);

export default router;
